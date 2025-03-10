from pydub import AudioSegment, silence
from google.generativeai import GenerativeModel
import librosa
from faster_whisper import WhisperModel
from pyannote.audio.pipelines import SpeakerDiarization
from pyannote.audio import Model
from fastapi import HTTPException
from bs4 import BeautifulSoup
import datetime
import numpy as np
import re
import json

def load_model():
    try:
        model = GenerativeModel("gemini-2.0-flash")
        return model
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error in loading model:"+str(e))

def get_call_analysis(audio_path):
    try:
        audio  = AudioSegment.from_file(audio_path)

        # Detect silence and total silence duration
        silences = silence.detect_silence(audio, min_silence_len=2000, silence_thresh=-40)
        long_pauses = [(start/1000, stop/1000) for start,stop in silences]
        total_silence = sum([stop-start for start,stop in long_pauses])

        #extract metadata
        start_time = datetime.datetime.now().replace(microsecond=0)
        duration = len(audio)/1000
        end_time = start_time + datetime.timedelta(seconds=duration)


        return long_pauses,total_silence,start_time,end_time,duration
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error in detect_silence"+str(e))

def convert_to_wav(audio_path):
    audio = AudioSegment.from_file(audio_path)
    wav_path = audio_path.rsplit('.', 1)[0] + ".wav"
    audio = audio.set_frame_rate(16000).set_channels(1)
    audio.export(wav_path, format="wav")
    return wav_path


def clean_gemini_html(html_content):
    soup = BeautifulSoup(html_content,"html.parser")
    container = soup.find("div",class_="container")
    if container:
        return str(container)
    else:
        return html_content


def transcribe_audio(audio_path):
    try:
        print("Initializing Whisper Model")
        model = WhisperModel("base",device="cpu",compute_type="int8")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error in initializing Whisper Model"+str(e))
    try:    
        print("Model Initialized")
        segments, info = model.transcribe(audio_path,beam_size=5,language='en')
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error in transcribing audio"+str(e))
    try:
        print("Transcription Done")
        transcript = ""
        for segment in segments:
            transcript += segment.text + " "
        return transcript

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error in transcribe"+str(e))
    

def call_quality(audio_path):
    try:
        y, sr = librosa.load(audio_path)
        if len(y.shape) > 1:
            y = np.mean(y,axis=1)
        
        rms = np.sqrt(np.mean(np.square(y)))
        noise_threshold = np.percentile(np.abs(y),10)
        noise = y[np.abs(y) < noise_threshold]

        if len(noise) > 0:
            noise_rms = np.sqrt(np.mean(np.square(noise)))
            snr = 20 * np.log10(rms / noise_rms)
        else:
            noise_rms = 0
            snr = 0
        return rms,noise_rms, snr
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error in call_quality"+str(e))
    

def get_conversation(text):
    model = load_model()

    prompt = f"""
    The following is a raw, unstructured call transcript without clear separation between agent and customer.
    Your task is to:
    1. Clearly identify who is the Agent and who is the Customer.
    2. Format the conversation like this:
    
    Agent: [Text]
    Customer: [Text]
    Agent: [Text]
    Customer: [Text]
    
    Ensure maximum accuracy.
    
    Raw Transcript:
    {text}
    """

    response = model.generate_content(prompt)
    structured_text = response.text
    prompt = f"""
    Based on the structured call transcript provided below, calculate the following metrics:
    
    1. Sentiment Score (1-100) based on tone analysis.
    2. Call Resolution (Resolved, In-Progress, Unresolved).
    3. Topics Discussed (Product, Technical, Payment, etc.).
    4. Compliance Score (1-100) based on whether the agent followed standard guidelines.
    5. Empathy Score (1-100) based on the agent's tone.
    6. Cuss Word Detection (Yes/No).
    7. Customer Satisfaction (1-100).

    Structured Transcript:
    {structured_text}
    
    Return the result in this JSON format ONLY:
    {{
      "sentiment_score": "",
      "call_resolution": "",
      "topics_discussed": "",
      "compliance_score": "",
      "empathy_score": "",
      "cuss_word_detection": ""
      "customer_satisfaction": ""
    }}
    """
    response = model.generate_content(prompt)
    response = re.sub("```","",response.text)
    response = re.sub("json","",response)
    response = re.sub("JSON","",response)
    # print(response)
    response = json.loads(response)
    return response, structured_text

