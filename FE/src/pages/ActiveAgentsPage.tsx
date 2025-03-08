import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LineChart, Line } from 'recharts';
import BackButton from '../components/BackButton';

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
  activeTime: agent.callDuration / 3600, // Convert seconds to hours
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

// Detailed Agent View Component
const AgentDetails = ({ agent, onBack, onToggleActive }) => {
  const [showRecentCalls, setShowRecentCalls] = useState(false);
  const agentCalls = mockCalls.filter(call => call.agentId === agent.agentId);
  const recentCalls = agentCalls.slice(0, 3); // Show last 3 calls as recent

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
          className="text-base font-medium text-gray-900 mb-4 cursor-pointer hover:text-indigo-600"
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
  const [selectedAgent, setSelectedAgent] = useState(null);

  const handleAgentClick = (agent) => {
    setSelectedAgent(agent);
  };

  const handleBack = () => {
    setSelectedAgent(null);
  };

  const handleToggleActive = (agentId) => {
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
            <AgentDetails agent={selectedAgent} onBack={handleBack} onToggleActive={handleToggleActive} />
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

              {/* Active Time Bar Chart (moved to bottom) */}
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