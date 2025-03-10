import React, { useEffect, useState, useRef, useCallback } from "react";

export function CallDashboard() {
  const [activeCalls, setActiveCalls] = useState([]);
  const [transcriptions, setTranscriptions] = useState({});
  const [audioAnalysis, setAudioAnalysis] = useState({});
  const [agentSentiment, setAgentSentiment] = useState({}); // Add this line
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [callHistory, setCallHistory] = useState([]);

  // Use a ref to keep track of the WebSocket connection
  const wsRef = useRef(null);

  // Load call history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("callHistory");
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        console.log("Loaded call history:", parsedHistory);
        setCallHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  // Handle call ended event separately without recreating the WebSocket
  const handleCallEnded = useCallback(
    (data) => {
      const callSid = data.data.callSid;

      setActiveCalls((prev) => {
        const endingCall = prev.find((call) => call.callSid === callSid);

        if (endingCall) {
          // Create deep copies of the necessary data for history
          const callTranscriptions = transcriptions[callSid]
            ? JSON.parse(JSON.stringify(transcriptions[callSid]))
            : [];

          const callAnalysis = audioAnalysis[callSid]
            ? JSON.parse(JSON.stringify(audioAnalysis[callSid]))
            : null;


          // Save the ended call to history with all data
          const callData = {
            ...endingCall,
            endTime: new Date().toISOString(),
            transcriptions: callTranscriptions,
            analysis: callAnalysis,
          };

          console.log("Saving call to history:", callData);

          // Update history in state and localStorage
          setCallHistory((prevHistory) => {
            const updatedHistory = [callData, ...prevHistory].slice(0, 50); // Keep max 50 calls
            try {
              localStorage.setItem(
                "callHistory",
                JSON.stringify(updatedHistory)
              );
              console.log("Updated history in localStorage", updatedHistory);
            } catch (error) {
              console.error("Error saving to localStorage:", error);
            }
            return updatedHistory;
          });
        }

        return prev.filter((call) => call.callSid !== callSid);
      });

      // Clean up transcriptions and analysis data for ended calls
      setTranscriptions((prev) => {
        const newTranscriptions = { ...prev };
        delete newTranscriptions[callSid];
        return newTranscriptions;
      });

      setAudioAnalysis((prev) => {
        const newAnalysis = { ...prev };
        delete newAnalysis[callSid];
        return newAnalysis;
      });

      setAgentSentiment((prev) => {
        const newSentiment = { ...prev };
        delete newSentiment[callSid];
        return newSentiment;
      });
    },
    [transcriptions, audioAnalysis, agentSentiment]
  );

  // WebSocket connection setup
  useEffect(() => {
    // Connect to the correct server port where your Express app is running
    const serverHost = "https://f1ce-103-123-226-98.ngrok-free.app";
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${serverHost}/client-updates`;

    console.log(`Attempting to connect to: ${wsUrl}`);

    // Create WebSocket connection
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to call server");
      setConnectionStatus("connected");
    };

    // Update the WebSocket handler to store agent analysis
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received websocket message:", data);

      switch (data.eventType) {
        case "call_started":
          setActiveCalls((prev) => [...prev, data.data]);
          break;
        case "call_ended":
          handleCallEnded(data);
          break;
        case "transcription":
        case "agent_response":
          setTranscriptions((prev) => {
            const updatedTranscriptions = {
              ...prev,
              [data.data.callSid]: [
                ...(prev[data.data.callSid] || []),
                {
                  text: data.data.text,
                  speaker: data.data.speaker,
                  timestamp: data.timestamp,
                  interactionCount: data.data.interactionCount, // Store the interaction count
                },
              ],
            };
            return updatedTranscriptions;
          });
          break;
        case "audio_analysis":
          setAudioAnalysis((prev) => {
            const callSid = data.data.callSid;
            const interactionCount = data.data.interactionCount || 0;

            // Create deep copy of previous analysis for this call
            const callAnalysis = prev[callSid] ? { ...prev[callSid] } : {};

            // Store analysis indexed by interaction count
            return {
              ...prev,
              [callSid]: {
                ...callAnalysis,
                [interactionCount]: data.data.analysis,
                current: data.data.analysis, // Always keep the latest analysis in 'current'
              },
            };
          });
          break;
        case "agent_audio_analysis":
          // Store agent audio analysis separately with interaction count
          setAudioAnalysis((prev) => {
            const callSid = data.data.callSid;
            const interactionCount = data.data.interactionCount;

            // Create deep copy of previous analysis for this call
            const callAnalysis = prev[callSid] ? { ...prev[callSid] } : {};

            // Store agent analysis with a special key format to distinguish from user analysis
            return {
              ...prev,
              [callSid]: {
                ...callAnalysis,
                [`agent_${interactionCount}`]: data.data.analysis,
                // We don't update 'current' for agent analysis since 'current' is for user analysis
              },
            };
          });
          break;
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setConnectionStatus("disconnected");
    };

    // Load active calls via REST on initial load
    fetch("http://f1ce-103-123-226-98.ngrok-free.app/api/active-calls")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch active calls");
        }
        return response.json();
      })
      .then((data) => {
        if (data.calls && Array.isArray(data.calls)) {
          setActiveCalls(data.calls);
        }
      })
      .catch((error) => {
        console.error("Error fetching active calls:", error);
      });

    // Cleanup function
    return () => {
      console.log("Cleaning up WebSocket connection");
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []); // Empty dependency array means this only runs once on mount

  // Helper function to render voice analysis metrics
  // Update the renderVoiceAnalysis function to include AI analysis

  // Update the renderVoiceAnalysis function to prioritize conversational analysis

  const renderVoiceAnalysis = (analysis) => {
  // First check if analysis exists at all
  if (!analysis) {
    return (
      <div className="text-gray-500 italic">
        No voice analysis data available
      </div>
    );
  }
  
  // Then check if current analysis exists
  const currentAnalysis = analysis?.current;

  if (!currentAnalysis) {
    return (
      <div className="text-gray-500 italic">
        No voice analysis data available
      </div>
    );
  }

  // Check if we have AI analysis with actual conversational content
  const hasQualityAiAnalysis =
    currentAnalysis.ai_analysis &&
    currentAnalysis.ai_analysis.notes &&
    !currentAnalysis.ai_analysis.notes.includes("only a series of beeps") &&
    !currentAnalysis.ai_analysis.notes.includes("difficult to assess");

  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <h4 className="font-semibold text-sm mb-2 text-gray-900">
        Voice Analysis
      </h4>
      <div className="space-y-2">
        {currentAnalysis.is_silent && currentAnalysis.pause_duration !== undefined && (
          <div className="bg-amber-50 border border-amber-200 rounded p-2 text-sm">
            <span className="font-medium text-amber-800">Silent for: </span>
            <span className="text-amber-800">
              {currentAnalysis.pause_duration.toFixed(1)}s
            </span>
          </div>
        )}

        {/* AI Analysis Display - Show first when quality analysis is available */}
        {hasQualityAiAnalysis && (
          <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm">
            <h5 className="text-blue-800 font-medium mb-1">AI Analysis</h5>
            {currentAnalysis.ai_analysis.emotional_tone && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">Emotion:</span>
                <span className="text-gray-800 font-medium">
                  {currentAnalysis.ai_analysis.emotional_tone}
                </span>
              </div>
            )}
            {currentAnalysis.ai_analysis.engagement && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">Engagement:</span>
                <span
                  className={`text-gray-800 ${
                    currentAnalysis.ai_analysis.engagement === "high"
                      ? "font-medium"
                      : ""
                  }`}
                >
                  {currentAnalysis.ai_analysis.engagement}
                </span>
              </div>
            )}
            {currentAnalysis.ai_analysis.confidence && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">Confidence:</span>
                <span
                  className={`text-gray-800 ${
                    currentAnalysis.ai_analysis.confidence === "high"
                      ? "font-medium"
                      : ""
                  }`}
                >
                  {currentAnalysis.ai_analysis.confidence}
                </span>
              </div>
            )}
            {currentAnalysis.ai_analysis.speech_rate && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">
                  Speech Rate:
                </span>
                <span className="text-gray-800">
                  {currentAnalysis.ai_analysis.speech_rate}
                </span>
              </div>
            )}
            {currentAnalysis.ai_analysis.notes && (
              <div className="border-t border-blue-200 mt-1 pt-1">
                <p className="text-gray-700 italic text-xs">
                  {currentAnalysis.ai_analysis.notes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Traditional pitch and tone analysis - add null checks */}
        {currentAnalysis.pitch && currentAnalysis.pitch.average_pitch !== undefined && (
          <div className="bg-white border border-gray-200 rounded p-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-gray-800">Pitch:</span>
              <span className="text-gray-800">
                {currentAnalysis.pitch.average_pitch.toFixed(1)} Hz
              </span>
            </div>
            {currentAnalysis.pitch.emotion && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">Emotion:</span>
                <span className="text-gray-800">
                  {currentAnalysis.pitch.emotion}
                </span>
              </div>
            )}
          </div>
        )}

        {currentAnalysis.tone && (
          <div className="bg-white border border-gray-200 rounded p-2 text-sm">
            {currentAnalysis.tone.tone && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">Tone:</span>
                <span className="text-gray-800">
                  {currentAnalysis.tone.tone}
                </span>
              </div>
            )}
            {currentAnalysis.tone.brightness !== undefined && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">Brightness:</span>
                <span className="text-gray-800">
                  {currentAnalysis.tone.brightness.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Show AI analysis at the bottom if it's not high quality */}
        {currentAnalysis.ai_analysis && !hasQualityAiAnalysis && (
          <div className="bg-gray-50 border border-gray-200 rounded p-2 text-sm mt-2 text-xs italic">
            <p className="text-gray-500">
              AI analysis: Limited quality audio input
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

  // Add a function to render sentiment badges
  const renderSentimentBadge = (sentiment) => {
    if (!sentiment) return null;

    // Helper function to get color classes
    const getSentimentColor = (type, value) => {
      if (type === "sentiment") {
        if (value === "positive") return "bg-green-100 text-green-800";
        if (value === "negative") return "bg-red-100 text-red-800";
        return "bg-blue-100 text-blue-800";
      }

      if (type === "empathy") {
        if (value === "high") return "bg-indigo-100 text-indigo-800";
        if (value === "low") return "bg-yellow-100 text-yellow-800";
        return "bg-blue-100 text-blue-800";
      }

      return "bg-gray-100 text-gray-800";
    };

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {sentiment.sentiment && (
          <span
            className={`inline-block px-1.5 py-0.5 rounded text-xs ${getSentimentColor(
              "sentiment",
              sentiment.sentiment
            )}`}
          >
            {sentiment.sentiment === "positive"
              ? "😊 Positive"
              : sentiment.sentiment === "negative"
              ? "😟 Negative"
              : "😐 Neutral"}
          </span>
        )}

        {sentiment.empathy_level && (
          <span
            className={`inline-block px-1.5 py-0.5 rounded text-xs ${getSentimentColor(
              "empathy",
              sentiment.empathy_level
            )}`}
          >
            Empathy: {sentiment.empathy_level}
          </span>
        )}

        {sentiment.tone && (
          <span className="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded text-xs">
            Tone: {sentiment.tone}
          </span>
        )}
      </div>
    );
  };

  // Update renderConversation to ensure AI analysis matches conversation turns properly

  const renderConversation = (
    callTranscriptions,
    callAnalysis,
    callSentiment
  ) => {
    if (
      callTranscriptions &&
      callTranscriptions.length > 0 &&
      (!callAnalysis || Object.keys(callAnalysis).length === 0)
    ) {
      return (
        <div>
          {renderTranscriptions(callTranscriptions)}
          <div className="text-xs text-gray-500 italic mt-2">
            Audio analysis processing...
          </div>
        </div>
      );
    }
    if (!callTranscriptions || callTranscriptions.length === 0) {
      return (
        <div className="text-gray-500 italic">No conversation recorded</div>
      );
    }

    return (
      <div className="max-h-72 overflow-y-auto space-y-3">
        {callTranscriptions.map((item, i) => {
          let messageAnalysis = null;
          let messageSentiment = null;

          // For user messages, look for analysis with matching interaction count
          if (item.speaker === "user" && callAnalysis) {
            // If we have an interaction count in the transcription item
            if (item.interactionCount !== undefined) {
              messageAnalysis = callAnalysis[item.interactionCount];
            } else {
              // Fall back to using the index if no interaction count
              messageAnalysis = callAnalysis[i];
            }
          }

          // For agent messages, look for analysis with agent_ prefix
          if (
            item.speaker === "agent" &&
            callAnalysis &&
            item.interactionCount !== undefined
          ) {
            messageAnalysis = callAnalysis[`agent_${item.interactionCount}`];
          }

          if (
            item.speaker === "agent" &&
            callSentiment &&
            item.interactionCount !== undefined
          ) {
            messageSentiment = callSentiment[item.interactionCount];
          }

          const aiAnalysis = messageAnalysis?.ai_analysis;

          // Check if AI analysis contains actual conversational content
          const isQualityAiAnalysis =
            aiAnalysis &&
            aiAnalysis.notes &&
            !aiAnalysis.notes.includes("only a series of beeps") &&
            !aiAnalysis.notes.includes("difficult to assess");

          return (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-[80%] ${
                item.speaker === "user"
                  ? "ml-auto bg-gray-100 text-gray-900"
                  : "mr-auto bg-blue-50 text-gray-900"
              }`}
            >
              <strong className="text-sm text-gray-800">
                {item.speaker === "user" ? "Customer" : "Agent"}:
              </strong>
              <p className="mt-1 text-gray-800">{item.text}</p>

              {/* Show analysis for both user AND agent messages */}
              {messageAnalysis && (
                <div className="mt-2 text-xs flex flex-wrap gap-1">
                  {/* Show AI analysis tags when available and of good quality */}
                  {isQualityAiAnalysis && (
                    <>
                      {aiAnalysis.emotional_tone && (
                        <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">
                          Emotion: {aiAnalysis.emotional_tone}
                        </span>
                      )}
                      {aiAnalysis.engagement && (
                        <span
                          className={`inline-block px-1.5 py-0.5 ${
                            aiAnalysis.engagement === "high"
                              ? "bg-green-100 text-green-800"
                              : aiAnalysis.engagement === "low"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          } rounded`}
                        >
                          Engagement: {aiAnalysis.engagement}
                        </span>
                      )}
                      {aiAnalysis.confidence && (
                        <span
                          className={`inline-block px-1.5 py-0.5 ${
                            aiAnalysis.confidence === "high"
                              ? "bg-green-100 text-green-800"
                              : aiAnalysis.confidence === "low"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          } rounded`}
                        >
                          Confidence: {aiAnalysis.confidence}
                        </span>
                      )}
                      {aiAnalysis.speech_rate && (
                        <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                          Speech: {aiAnalysis.speech_rate}
                        </span>
                      )}
                    </>
                  )}

                  {/* Show traditional analysis when AI analysis is missing or low quality */}
                  {!isQualityAiAnalysis && (
                    <>
                      {messageAnalysis.tone?.tone && (
                        <span className="inline-block px-1.5 py-0.5 bg-gray-200 rounded">
                          Tone: {messageAnalysis.tone.tone}
                        </span>
                      )}
                      {messageAnalysis.pitch?.emotion && (
                        <span className="inline-block px-1.5 py-0.5 bg-gray-200 rounded">
                          Emotion: {messageAnalysis.pitch.emotion}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Add sentiment badges for agent responses */}
              {item.speaker === "agent" &&
                messageSentiment &&
                renderSentimentBadge(messageSentiment)}

              {/* Show detailed AI analysis for quality analysis - for both user and agent */}
              {isQualityAiAnalysis && (
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    {item.speaker === "user" ? "Customer" : "Agent"} insights
                  </summary>
                  <p className="p-2 bg-blue-50 mt-1 rounded text-gray-700">
                    {aiAnalysis.notes}
                  </p>
                </details>
              )}

              {/* Add detailed sentiment analysis for agent */}
              {item.speaker === "agent" &&
                messageSentiment &&
                messageSentiment.suggestions && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800">
                      Agent sentiment details
                    </summary>
                    <div className="p-2 bg-indigo-50 mt-1 rounded text-gray-700">
                      <p className="font-medium mb-1">Communication quality:</p>
                      <ul className="list-disc ml-4">
                        <li>
                          Professionalism: {messageSentiment.professionalism}
                        </li>
                        <li>Formality: {messageSentiment.formality}</li>
                        <li>Confidence: {messageSentiment.confidence}</li>
                      </ul>
                      {messageSentiment.suggestions && (
                        <>
                          <p className="font-medium mt-2 mb-1">Suggestions:</p>
                          <p className="italic">
                            {messageSentiment.suggestions}
                          </p>
                        </>
                      )}
                    </div>
                  </details>
                )}
            </div>
          );
        })}
      </div>
    );
  };

  const getStatusClass = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("callHistory");
    setCallHistory([]);
  };

  // Add a function to inspect history item for debugging
  const debugHistoryItem = (item, index) => {
    console.log(`History item ${index}:`, item);
    console.log(
      `- Has transcriptions:`,
      !!item.transcriptions &&
        Array.isArray(item.transcriptions) &&
        item.transcriptions.length > 0
    );
    console.log(`- Has analysis:`, !!item.analysis);
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-5 font-sans text-gray-900">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Call Dashboard</h1>
        <div className={`px-3 py-1 rounded-md ${getStatusClass()}`}>
          Status: {connectionStatus}
        </div>
      </div>

      {/* Active Calls Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Active Calls ({activeCalls.length})
        </h2>

        {activeCalls.length === 0 ? (
          <div className="text-gray-500 italic">
            No active calls at the moment
          </div>
        ) : (
          <div className="space-y-5">
            {activeCalls.map((call) => (
              <div
                key={call.callSid}
                className="border border-gray-200 rounded-lg shadow-sm p-4 text-gray-900 bg-white"
              >
                <div className="flex flex-col md:flex-row justify-between border-b border-gray-200 pb-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Agent: {call.agentName || "Strava Agent"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Call ID: {call.callSid}
                    </p>
                    <p className="text-sm text-gray-600">
                      Started: {new Date(call.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4">
                    {renderVoiceAnalysis(audioAnalysis[call.callSid])}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  Conversation
                </h3>
                {renderConversation(
                  transcriptions[call.callSid],
                  audioAnalysis[call.callSid],
                  agentSentiment[call.callSid] // Add this parameter
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call History Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Call History ({callHistory.length})
          </h2>
          {callHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>

        {callHistory.length === 0 ? (
          <div className="text-gray-500 italic">No call history available</div>
        ) : (
          <div className="space-y-6">
            {callHistory.map((historyItem, index) => (
              <div
                key={`${historyItem.callSid}-${historyItem.endTime}`}
                className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white"
              >
                {debugHistoryItem(historyItem, index)}
                <div className="flex flex-col md:flex-row justify-between border-b border-gray-200 pb-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Agent: {historyItem.agentName || "Strava Agent"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Call ID: {historyItem.callSid}
                    </p>
                    <div className="flex space-x-4">
                      <p className="text-sm text-gray-600">
                        Started:{" "}
                        {new Date(historyItem.startTime).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Ended:{" "}
                        {new Date(historyItem.endTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4">
                    {renderVoiceAnalysis(historyItem.analysis)}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  Conversation
                </h3>
                {renderConversation(
                  historyItem.transcriptions,
                  historyItem.analysis,
                  historyItem.sentiment // Add this parameter
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

