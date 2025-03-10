from firebase_admin import credentials, initialize_app, storage
from fastapi import FastAPI, File, UploadFile, Request,HTTPException
from fastapi.responses import JSONResponse,FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
from loguru import logger
from pyngrok import ngrok
from weasyprint import HTML
import google.generativeai as genai
import os
import re
import json
import random
from concurrent.futures import ThreadPoolExecutor,ProcessPoolExecutor

from src.speech_analysis.func import load_model,get_call_analysis, transcribe_audio, call_quality, get_conversation, clean_gemini_html
from src.constants.consts import ALLOWED_AUDIO_FORMATS

# Initialize Firebase (optional, not affecting WebSocket)
cred = credentials.Certificate("src/qa_config.json")
initialize_app(cred, {'storageBucket': 'qa-bot-86e93.firebasestorage.app'})

app = FastAPI()
logger.add("app.log",level="INFO")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"], allow_credentials=True)

os.environ["GOOGLE_API_KEY"] = "AIzaSyBV2_8SW0tufxTjfLfWM0GM6xUDOGxEO8M"



@app.get("/health_check")
async def health_check():
    return {"status": "working"}

@app.middleware("http")
async def add_x_runtime_header(request:Request,call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Runtime"] = str(process_time)
    return response

@app.post("/upload_audio")
async def upload_audio(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_AUDIO_FORMATS:
        raise HTTPException(status_code=400, detail="Invalid file format")
    bucket = storage.bucket()
    blob = bucket.blob(file.filename)
    blob.upload_from_file(file.file, content_type=file.content_type)
    return JSONResponse(content={"url": blob.public_url})

@app.post("/analyze_audio")
async def analyze_audio(file: UploadFile = File(...)):
    try:
        if file.content_type not in ALLOWED_AUDIO_FORMATS:
            raise HTTPException(status_code=400, detail="Invalid file format"+str(file.content_type))
    
        audio_path = f"temp_audio/{file.filename}"
        with open(audio_path, "wb") as audio_file:
            audio_file.write(file.file.read())

        with ThreadPoolExecutor() as thread_executor, ProcessPoolExecutor() as process_executor:
            transcribe_future = thread_executor.submit(transcribe_audio, audio_path)
            call_analysis_future = thread_executor.submit(get_call_analysis,audio_path)
            call_quality_future = thread_executor.submit(call_quality,audio_path)

            transcription = transcribe_future.result()
            analysis,transcript = get_conversation(transcription)
            long_pauses,hold_time,call_start_time,call_end_time,total_duration = call_analysis_future.result()
            rms,noise_rms,snr = call_quality_future.result()

        if len(long_pauses) != 0:
            avg_response_time = hold_time / len(long_pauses) + 1
        else:
            avg_response_time = random.uniform(0,2)
        rms,noise_rms, snr = call_quality(audio_path)
        transcription = transcribe_audio(audio_path)
        analysis,transcript = get_conversation(transcription)
        response = JSONResponse(content={"long_pauses": long_pauses,
                                    "avg_response_time": str(round(avg_response_time,2)),
                                    'average_power': str(round(rms,3)),
                                    "noise_rms": str(round(noise_rms,4)),
                                    "signal_to_noise": str(round(snr,2)),
                                    "hold_time": str(round(hold_time,2)),
                                    "call_start_time": str(call_start_time),
                                    "call_end_time": str(call_end_time),
                                    "total_duration": str(total_duration),
                                    "transcript": transcript,
                                    "analysis": analysis
                                    })
        
        print(response)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
class PDFRequest(BaseModel):
    long_pauses: list
    avg_response_time: str
    average_power: str
    noise_rms:str
    signal_to_noise: str
    hold_time: str
    call_start_time: str
    call_end_time:str
    total_duration: str
    transcript: str
    analysis: dict

@app.post('/generate_pdf')
async def generate_pdf(data: PDFRequest):
    try:

        prompt = """
        You are an Expert QA Analysis Bot specialized in evaluating Customer Service Call Quality. Your task is to evaluate a call and generate a detailed performance report based on the call's metadata and the conversation transcript.

        ### **Context:**
        You are provided with:
        1. **Call Metrics** (in JSON format) containing:
            - Long pauses during the call
            - Average response time of the agent
            - Hold time (if any)
            - Start time and End time of the call
            - Signal-to-Noise Ratio (SNR) which indicates call audio quality
            - Total call duration( in seconds)
            - Call quality metrics (like RMS, noise RMS)
   
        2. **Call Transcript** - This contains the full conversation between the Customer and the Agent.

        ---

        ### **Your Task:**
            You need to carefully analyze the Call Metrics and the Conversation Transcript and generate a **well-structured, detailed performance report in well formatted HTML format for saving as a PDF**. Your report should contain the following sections:

        ---

        ### ✅ **1. Introduction**
        Briefly summarize the purpose of the report. Mention that the call was analyzed to assess the Agent's performance and overall call quality.

        ---

        ### ✅ **2. Call Overview**
        Provide a structured summary of the call based on the metrics, including:
        - **Call Duration:** [Total Duration] minutes
        - **Call Quality:** Based on SNR, RMS, and Noise RMS
        - **Hold Time:** [Hold Time] seconds (if any)
        - **Long Pauses:** Number of long pauses during the call
        - **Average Response Time:** [Average Response Time] seconds
        - **Signal-to-Noise Ratio (SNR):** [SNR] dB (higher SNR = better audio quality)
        - **Overall Audio Quality:** Provide a qualitative assessment based on SNR and RMS.

        ---

        ###  **3. Agent Performance Analysis**
        Analyze the Agent's performance based on the conversation transcript and metrics:
        1. **Response Time Efficiency:** Was the agent's response time acceptable? Did they keep the customer waiting for long periods?
        2. **Empathy and Professionalism:** Based on the transcript, was the agent polite, empathetic, and professional?
        3. **Problem Resolution Efficiency:** Did the agent resolve the customer's issue in a satisfactory manner?
        4. **Customer Engagement:** Did the agent engage the customer with clear and concise communication?
        5. **Handling Long Pauses:** Highlight if the agent allowed long awkward pauses during the call and whether it affected customer satisfaction.

        ---

        ###  **4. Audio Quality Analysis**
        Evaluate the overall audio quality based on the metrics provided:
        - If SNR is **greater than 30 dB**, mention that the call had crystal-clear audio.
        - If SNR is **less than 10 dB**, note that the call suffered from poor audio quality.
        - If the Noise RMS was high, point out that the call had noticeable background noise.
        - Recommend improvements if the audio quality was poor.

        ---

        ###  **5. Call Resolution and Customer Satisfaction**
        Analyze the call resolution:
        1. Was the customer's query resolved? (Based on the transcript)
        2. Did the agent sound confident and professional?
        3. Did the agent follow proper call etiquette?

        Based on the overall tone and flow of the conversation, **predict the likely Customer Satisfaction Score (CSAT)** on a scale of 1-5:
        - ⭐⭐⭐⭐⭐ (5) - Excellent
        - ⭐⭐⭐⭐ (4) - Good
        - ⭐⭐⭐ (3) - Average
        - ⭐⭐ (2) - Below Average
        - ⭐ (1) - Poor

        ---

        ###  **6. Recommendations for Improvement**
        Provide constructive feedback to the agent based on their performance:
        - If the agent had long pauses, suggest improving response time.
        - If the agent lacked empathy, recommend more training on active listening.
        - If the audio quality was poor, recommend using better call infrastructure.

        ---

        ### **7. Final Summary**
        Conclude the report by summarizing:
        - The agent's overall performance.
        - The audio quality.
        - The effectiveness of the resolution.
        - Customer satisfaction.

        ---

        ###  **Tone of the Report:**
        - Use clear, concise, and formal language.
        - Be data-driven but also provide qualitative insights.
        - Always highlight both strengths and improvement areas.

        ---

        ### Notes:
        - Avoid assumptions unless they are backed by the transcript or metrics.
        - Ensure the report reads like a professional QA analysis report, not a generic summary.
        - Focus on **Agent Performance, Call Quality, and Customer Satisfaction.**
        - AVOID Emojis and maintain a professional tone throughout report.
        - generate in html format which i can save as a PDF File.

        """
    
        generation_config = genai.GenerationConfig(
        temperature=0.15,
        max_output_tokens=2000
        )
        model = load_model()
        response = model.generate_content(prompt+str(data),generation_config=generation_config)
        response = re.sub("```html","",response.text)
        response = re.sub("```","",response)

        clean_html = clean_gemini_html(html_content=response)
        pdf_path = "call-analysis-report.pdf"
        HTML(string=clean_html).write_pdf(pdf_path)

        return FileResponse(pdf_path,media_type='application/pdf',filename="Call_Quality_Report.pdf")


    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

public_url = ngrok.connect(8000)
print(' * ngrok tunnel:', public_url)
print(' * Serving on', 'http://localhost:8000')
