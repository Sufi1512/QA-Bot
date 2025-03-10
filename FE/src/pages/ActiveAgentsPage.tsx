import React, { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LineChart, Line } from 'recharts';
import BackButton from '../components/BackButton';
import axios from 'axios';

// Mock Data for Agents (based on agentSchema)
const mockAgents = [
  {
    agentId: 'agent001',
    name: 'John Smith',
    totalCalls: 45,
    avgSentimentScore: 85,
    avgComplianceScore: 95,
    resolutionRate: 90,
    empathyScore: 88,
    clarityScore: 92,
    efficiencyScore: 87,
    callDuration: 28800, // 8 hours in seconds
    isActive: true,
    agentInstructions: 'Focus on empathy and clear communication during calls.',
    performanceTrends: [
      { date: '2025-03-01', sentimentScore: 80, complianceScore: 90, resolutionRate: 85 },
      { date: '2025-03-02', sentimentScore: 82, complianceScore: 92, resolutionRate: 88 },
      { date: '2025-03-03', sentimentScore: 85, complianceScore: 95, resolutionRate: 90 },
      { date: '2025-03-04', sentimentScore: 83, complianceScore: 93, resolutionRate: 87 },
      { date: '2025-03-05', sentimentScore: 86, complianceScore: 96, resolutionRate: 91 },
    ],
    audioAnalyses: [],
  },
  {
    agentId: 'agent002',
    name: 'Sarah Johnson',
    totalCalls: 38,
    avgSentimentScore: 78,
    avgComplianceScore: 92,
    resolutionRate: 85,
    empathyScore: 82,
    clarityScore: 88,
    efficiencyScore: 85,
    callDuration: 25200, // 7 hours in seconds
    isActive: true,
    agentInstructions: 'Ensure quick resolution while maintaining compliance.',
    performanceTrends: [
      { date: '2025-03-01', sentimentScore: 75, complianceScore: 90, resolutionRate: 80 },
      { date: '2025-03-02', sentimentScore: 76, complianceScore: 91, resolutionRate: 82 },
      { date: '2025-03-03', sentimentScore: 78, complianceScore: 92, resolutionRate: 85 },
      { date: '2025-03-04', sentimentScore: 77, complianceScore: 90, resolutionRate: 83 },
      { date: '2025-03-05', sentimentScore: 79, complianceScore: 93, resolutionRate: 86 },
    ],
    audioAnalyses: [],
  },
  {
    agentId: 'agent003',
    name: 'Mike Wilson',
    totalCalls: 32,
    avgSentimentScore: 72,
    avgComplianceScore: 88,
    resolutionRate: 80,
    empathyScore: 75,
    clarityScore: 82,
    efficiencyScore: 80,
    callDuration: 21600, // 6 hours in seconds
    isActive: true,
    agentInstructions: 'Prioritize efficiency without compromising clarity.',
    performanceTrends: [
      { date: '2025-03-01', sentimentScore: 70, complianceScore: 85, resolutionRate: 75 },
      { date: '2025-03-02', sentimentScore: 71, complianceScore: 86, resolutionRate: 77 },
      { date: '2025-03-03', sentimentScore: 72, complianceScore: 88, resolutionRate: 80 },
      { date: '2025-03-04', sentimentScore: 71, complianceScore: 87, resolutionRate: 78 },
      { date: '2025-03-05', sentimentScore: 73, complianceScore: 89, resolutionRate: 81 },
    ],
    audioAnalyses: [],
  },
  {
    agentId: 'agent004',
    name: 'Emily Davis',
    totalCalls: 28,
    avgSentimentScore: 68,
    avgComplianceScore: 85,
    resolutionRate: 75,
    empathyScore: 70,
    clarityScore: 78,
    efficiencyScore: 75,
    callDuration: 18000, // 5 hours in seconds
    isActive: false,
    agentInstructions: 'Work on improving sentiment scores during interactions.',
    performanceTrends: [
      { date: '2025-03-01', sentimentScore: 65, complianceScore: 80, resolutionRate: 70 },
      { date: '2025-03-02', sentimentScore: 66, complianceScore: 82, resolutionRate: 72 },
      { date: '2025-03-03', sentimentScore: 68, complianceScore: 85, resolutionRate: 75 },
      { date: '2025-03-04', sentimentScore: 67, complianceScore: 83, resolutionRate: 73 },
      { date: '2025-03-05', sentimentScore: 69, complianceScore: 86, resolutionRate: 76 },
    ],
    audioAnalyses: [],
  },
  {
    agentId: 'agent005',
    name: 'Tom Brown',
    totalCalls: 25,
    avgSentimentScore: 65,
    avgComplianceScore: 82,
    resolutionRate: 70,
    empathyScore: 68,
    clarityScore: 75,
    efficiencyScore: 70,
    callDuration: 14400, // 4 hours in seconds
    isActive: true,
    agentInstructions: 'Maintain a positive tone and resolve issues promptly.',
    performanceTrends: [
      { date: '2025-03-01', sentimentScore: 60, complianceScore: 78, resolutionRate: 65 },
      { date: '2025-03-02', sentimentScore: 62, complianceScore: 80, resolutionRate: 67 },
      { date: '2025-03-03', sentimentScore: 65, complianceScore: 82, resolutionRate: 70 },
      { date: '2025-03-04', sentimentScore: 63, complianceScore: 81, resolutionRate: 68 },
      { date: '2025-03-05', sentimentScore: 66, complianceScore: 83, resolutionRate: 71 },
    ],
    audioAnalyses: [],
  },
];

// Mock Data for Calls (based on callSchema)
const mockCalls = [
  { callId: 'call001', agentId: 'agent001', startTime: '2025-03-08T08:00:00Z', duration: 300, sentimentScore: 85, resolutionStatus: 'Resolved' },
  { callId: 'call002', agentId: 'agent001', startTime: '2025-03-08T09:15:00Z', duration: 240, sentimentScore: 88, resolutionStatus: 'Resolved' },
  { callId: 'call003', agentId: 'agent002', startTime: '2025-03-08T08:30:00Z', duration: 180, sentimentScore: 80, resolutionStatus: 'In Progress' },
  { callId: 'call004', agentId: 'agent002', startTime: '2025-03-08T10:00:00Z', duration: 210, sentimentScore: 76, resolutionStatus: 'Resolved' },
  { callId: 'call005', agentId: 'agent003', startTime: '2025-03-08T07:45:00Z', duration: 270, sentimentScore: 70, resolutionStatus: 'Unresolved' },
  { callId: 'call006', agentId: 'agent003', startTime: '2025-03-08T09:30:00Z', duration: 300, sentimentScore: 72, resolutionStatus: 'Resolved' },
  { callId: 'call007', agentId: 'agent004', startTime: '2025-03-08T08:15:00Z', duration: 150, sentimentScore: 65, resolutionStatus: 'In Progress' },
  { callId: 'call008', agentId: 'agent004', startTime: '2025-03-08T10:30:00Z', duration: 180, sentimentScore: 68, resolutionStatus: 'Resolved' },
  { callId: 'call009', agentId: 'agent005', startTime: '2025-03-08T09:00:00Z', duration: 240, sentimentScore: 66, resolutionStatus: 'Resolved' },
  { callId: 'call010', agentId: 'agent005', startTime: '2025-03-08T10:45:00Z', duration: 200, sentimentScore: 64, resolutionStatus: 'In Progress' },
];

// Mock data for the bar chart (active time)
const agentData = mockAgents.map(agent => ({
  name: agent.name,
  activeTime: agent.callDuration / 3600,
}));

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-md">
        <p className="text-gray-900 font-semibold">{`Agent: ${label}`}</p>
        <p className="text-blue-500">{`Active Time: ${payload[0].value} hrs`}</p>
      </div>
    );
  }
  return null;
};

// Agent Card Component (for overview)
const AgentCard = ({ agent, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg"
      onClick={() => onClick(agent)}
    >
      <h4 className="text-base font-medium text-gray-900">{agent.name}</h4>
      <p className="text-sm text-gray-500">Total Calls: {agent.totalCalls}</p>
      <p className="text-sm text-gray-500">Active Time: {(agent.callDuration / 3600).toFixed(1)} hrs</p>
      <p className="text-sm text-gray-500">Status: {agent.isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
};

// Metric Card Component (for detailed view)
const MetricCard = ({ title, value, unit = '' }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 transform transition-transform hover:scale-105 hover:shadow-lg">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="mt-2 text-lg font-semibold text-gray-700">{value}{unit}</p>
    </div>
  );
};

// Call Card Component (for all calls and recent calls)
const CallCard = ({ call }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 transform transition-transform hover:scale-105 hover:shadow-lg">
      <p className="text-sm font-medium text-gray-900">Call ID: {call.callId}</p>
      <p className="text-sm text-gray-500">Start Time: {new Date(call.startTime).toLocaleString()}</p>
      <p className="text-sm text-gray-500">Duration: {(call.duration / 60).toFixed(1)} min</p>
      <p className="text-sm text-gray-500">Sentiment Score: {call.sentimentScore}%</p>
      <p className="text-sm text-gray-500">Resolution: {call.resolutionStatus}</p>
    </div>
  );
};

// Analysis Result Component
const AnalysisResult = ({ analysis }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h4 className="text-base font-medium text-gray-900 mb-2">Audio Analysis Results</h4>
      <p className="text-sm text-gray-700"><strong>Agent:</strong> {analysis.agentName} (ID: {analysis.agentId})</p>
      <p className="text-sm text-gray-700"><strong>Duration:</strong> {analysis.total_duration} sec</p>
      <p className="text-sm text-gray-700"><strong>Long Pauses:</strong> {JSON.stringify(analysis.long_pauses)}</p>
      <p className="text-sm text-gray-700"><strong>RMS:</strong> {analysis.rms}</p>
      <p className="text-sm text-gray-700"><strong>SNR:</strong> {analysis.snr}</p>
      <p className="text-sm text-gray-700"><strong>Hold Time:</strong> {analysis.hold_time} sec</p>
      <p className="text-sm text-gray-700"><strong>Call Start Time:</strong> {analysis.call_start_time}</p>
      <p className="text-sm text-gray-700"><strong>Call End Time:</strong> {analysis.call_end_time}</p>
      <p className="text-sm text-gray-700"><strong>Transcript:</strong> {analysis.transcript}</p>
      
      {/* Render specific fields from analysis.analysis */}
      <div className="text-sm text-gray-700">
        <strong>Analysis:</strong>
        <ul className="list-disc pl-5">
          <li><strong>Sentiment Score:</strong> {analysis.analysis.sentiment_score}%</li>
          <li><strong>Call Resolution:</strong> {analysis.analysis.call_resolution}</li>
          <li><strong>Topics Discussed:</strong> {analysis.analysis.topics_discussed}</li>
          <li><strong>Compliance Score:</strong> {analysis.analysis.compliance_score}%</li>
          <li><strong>Empathy Score:</strong> {analysis.analysis.empathy_score}%</li>
          <li><strong>Cuss Word Detection:</strong> {analysis.analysis.cuss_word_detection || 'None'}</li>
          <li><strong>Customer Satisfaction:</strong> {analysis.analysis.customer_satisfaction || 'N/A'}</li>
        </ul>
      </div>

      <p className="text-sm text-gray-700"><strong>Analyzed At:</strong> {new Date(analysis.analyzedAt).toLocaleString()}</p>
    </div>
  );
};

// Detailed Agent View Component
const AgentDetails = ({ agent, onBack, onToggleActive, setAgents }) => {
  const [showRecentCalls, setShowRecentCalls] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // State for PDF URL
  const audioRef = useRef<HTMLAudioElement>(null);
  const agentCalls = mockCalls.filter(call => call.agentId === agent.agentId);
  const recentCalls = agentCalls.slice(0, 3);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
      setPdfUrl(null); // Reset PDF URL when a new file is uploaded
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleAnalyze = async () => {
    if (!audioFile) {
      alert('Please upload an audio file first.');
      return;
    }

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      // Step 1: Analyze the audio
      const response = await axios.post('https://1b08-152-58-47-159.ngrok-free.app/analyze_audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Audio analysis response:', response);
      const analysisData = {
        ...(typeof response.data === 'object' ? response.data : {}),
        agentId: agent.agentId,
        agentName: agent.name,
        audioFileName: audioFile.name,
        analyzedAt: new Date().toISOString(),
      };

      setAnalysisResult(analysisData);

      // Update agents state with analysis
      setAgents((prevAgents: any[]) =>
        prevAgents.map(a =>
          a.agentId === agent.agentId
            ? { ...a, audioAnalyses: [...(a.audioAnalyses || []), analysisData] }
            : a
        )
      );
      
      console.log('Analysis stored for agent:', agent.name, analysisData);

      // Step 2: Generate PDF report
      const pdfResponse = await axios.post('https://1b08-152-58-47-159.ngrok-free.app/generate_pdf', analysisData, {
        responseType: 'blob', // Expect binary PDF response
      });

      // Create a Blob and URL for the PDF
      const pdfBlob = new Blob([pdfResponse.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);

    } catch (error) {
      console.error('Audio analysis or PDF generation failed:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(`Failed: ${error.response.data.message || 'Server error'}`);
        } else if (error.request) {
          alert('Failed: No response from server. Please check your network connection.');
        } else {
          alert(`Failed: ${error.message}`);
        }
      } else {
        alert('Failed: An unexpected error occurred.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `Analysis_Report_${agent.agentId}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Optional: Clean up the URL after download
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    } else {
      alert('No PDF available to download. Please analyze an audio file first.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Agents
        </button>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-900">Status: {agent.isActive ? 'Active' : 'Inactive'}</span>
          <button
            onClick={() => onToggleActive(agent.agentId)}
            className={`px-4 py-2 text-sm font-medium rounded-md text-white ${agent.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${agent.isActive ? 'focus:ring-red-500' : 'focus:ring-green-500'}`}
          >
            {agent.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{agent.name}'s Details</h3>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Total Calls" value={agent.totalCalls} />
        <MetricCard title="Avg Sentiment Score" value={agent.avgSentimentScore} unit="%" />
        <MetricCard title="Avg Compliance Score" value={agent.avgComplianceScore} unit="%" />
        <MetricCard title="Resolution Rate" value={agent.resolutionRate} unit="%" />
        <MetricCard title="Empathy Score" value={agent.empathyScore} unit="%" />
        <MetricCard title="Clarity Score" value={agent.clarityScore} unit="%" />
        <MetricCard title="Efficiency Score" value={agent.efficiencyScore} unit="%" />
        <MetricCard title="Active Time" value={(agent.callDuration / 3600).toFixed(1)} unit=" hrs" />
      </div>

      {/* Agent Instructions */}
      <div className="mb-8">
        <h4 className="text-base font-medium text-gray-900 mb-4">Agent Instructions</h4>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-700">{agent.agentInstructions}</p>
        </div>
      </div>

      {/* Audio Upload and Analysis */}
      <div className="mb-8">
        <h4 className="text-base font-medium text-gray-900 mb-4">Upload and Analyze Audio</h4>
        <div className="bg-white rounded-lg shadow-md p-4">
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {audioUrl && (
            <div className="mb-4">
              <audio ref={audioRef} src={audioUrl} controls className="hidden" />
              <button
                onClick={handlePlay}
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Play
              </button>
            </div>
          )}
          <div className="flex space-x-4">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !audioFile}
              className={`px-4 py-2 text-sm font-medium rounded-md text-white ${isAnalyzing || !audioFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
            {pdfUrl && (
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Download PDF Report
              </button>
            )}
          </div>
          {analysisResult && <AnalysisResult analysis={analysisResult} />}
        </div>
      </div>

      {/* All Calls */}
      <div className="mb-8">
        <h4 className="text-base font-medium text-gray-900 mb-4">All Calls</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {agentCalls.map(call => (
            <CallCard key={call.callId} call={call} />
          ))}
        </div>
      </div>

      {/* Recent Calls */}
      <div className="mb-8">
        <h4
          className="text-base font-medium text-gray-900 mb-4 cursor-pointer hover:text-indig o-600"
          onClick={() => setShowRecentCalls(!showRecentCalls)}
        >
          Recent Calls {showRecentCalls ? '(Hide)' : '(Show)'}
        </h4>
        {showRecentCalls && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recentCalls.map(call => (
              <CallCard key={call.callId} call={call} />
            ))}
          </div>
        )}
      </div>

      {/* Performance Trends */}
      <h4 className="text-base font-medium text-gray-900 mb-4">Performance Trends</h4>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={agent.performanceTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} stroke="#6b7280" />
            <YAxis domain={[0, 100]} stroke="#6b7280" />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="sentimentScore" stroke="#4F46E5" strokeWidth={2} name="Sentiment Score" />
            <Line type="monotone" dataKey="complianceScore" stroke="#10B981" strokeWidth={2} name="Compliance Score" />
            <Line type="monotone" dataKey="resolutionRate" stroke="#F59E0B" strokeWidth={2} name="Resolution Rate" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ActiveAgentsPage = () => {
  const [agents, setAgents] = useState(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const handleAgentClick = (agent: any) => {
    setSelectedAgent(agent);
  };

  const handleBack = () => {
    setSelectedAgent(null);
  };

  const handleToggleActive = (agentId: string) => {
    setAgents(agents.map(agent =>
      agent.agentId === agentId ? { ...agent, isActive: !agent.isActive } : agent
    ));
    if (selectedAgent && selectedAgent.agentId === agentId) {
      setSelectedAgent({ ...selectedAgent, isActive: !selectedAgent.isActive });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BackButton />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Active Agents Overview</h2>
          </div>

          <div className="mb-8">
            <p className="text-gray-600">
              This page displays an overview of active agents. Click on an agent card to view detailed performance metrics, calls, and controls.
            </p>
          </div>

          {selectedAgent ? (
            <AgentDetails
              agent={selectedAgent}
              onBack={handleBack}
              onToggleActive={handleToggleActive}
              setAgents={setAgents}
            />
          ) : (
            <>
              {/* Agent Cards Grid */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Agents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {agents.map(agent => (
                    <AgentCard key={agent.agentId} agent={agent} onClick={handleAgentClick} />
                  ))}
                </div>
              </div>

              {/* Key Insights */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Most Active Agent</h4>
                        <p className="text-sm text-gray-500">{agents[0].name}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {agents[0].callDuration / 3600} hrs
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Least Active Agent</h4>
                        <p className="text-sm text-gray-500">{agents[agents.length - 1].name}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {agents[agents.length - 1].callDuration / 3600} hrs
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Time Bar Chart */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Time Overview</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={agentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="activeTime" fill="#3B82F6" name="Active Time (hrs)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActiveAgentsPage;
