import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LineChart, Line } from 'recharts';
import BackButton from '../components/BackButton';

interface Agent {
  _id: string;
  agentId: string;
  name: string;
  totalCalls: number;
  callDuration: number;
  isActive: boolean;
  avgSentimentScore: number;
  avgComplianceScore: number;
}

interface Call {
  callId: string;
  duration: number;
  sentimentScore: number;
}

// Agent Card Component (for overview)
const AgentCard: React.FC<{ agent: Agent; onClick: (agent: Agent) => void }> = ({ agent, onClick }) => {
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
const MetricCard: React.FC<{ title: string; value: number | string; unit?: string }> = ({ title, value, unit = '' }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 transform transition-transform hover:scale-105 hover:shadow-lg">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="text-lg font-semibold text-gray-900">{value} {unit}</p>
    </div>
  );
};

// Call Card Component (for all calls and recent calls)
const CallCard: React.FC<{ call: Call }> = ({ call }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 transform transition-transform hover:scale-105 hover:shadow-lg">
      <p className="text-sm text-gray-500">Call ID: {call.callId}</p>
      <p className="text-sm text-gray-500">Duration: {call.duration} seconds</p>
      <p className="text-sm text-gray-500">Sentiment Score: {call.sentimentScore}</p>
    </div>
  );
};

// Detailed Agent View Component
const AgentDetails: React.FC<{ agent: Agent; onBack: () => void; onToggleActive: (agentId: string) => void }> = ({ agent, onBack, onToggleActive }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await fetch(`/api/calls?agentId=${agent.agentId}`);
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Expected JSON response, got ${contentType}`);
        }
        const data = await response.json();
        setCalls(data);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchCalls();
  }, [agent.agentId]);

  const recentCalls = calls.slice(0, 3); // Show last 3 calls as recent

  return (
    <div>
      <BackButton onClick={onBack} />
      <h2 className="text-2xl font-semibold text-gray-900">{agent.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <MetricCard title="Total Calls" value={agent.totalCalls} />
        <MetricCard title="Active Time" value={(agent.callDuration / 3600).toFixed(1)} unit="hrs" />
        <MetricCard title="Sentiment Score" value={agent.avgSentimentScore} />
        <MetricCard title="Compliance Score" value={agent.avgComplianceScore} />
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-900">Recent Calls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {recentCalls.map((call) => (
            <CallCard key={call.callId} call={call} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ActiveAgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/agents", {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format: Expected array of agents');
        }
        
        setAgents(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch agents'));
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleBack = () => {
    setSelectedAgent(null);
  };

  const handleToggleActive = async (agentId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/agents/${agentId}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedAgent = await response.json();
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent._id === updatedAgent._id ? updatedAgent : agent
        )
      );
      if (selectedAgent && selectedAgent._id === updatedAgent._id) {
        setSelectedAgent(updatedAgent);
      }
    } catch (err) {
      console.error('Failed to toggle agent active status:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {selectedAgent ? (
        <AgentDetails
          agent={selectedAgent}
          onBack={handleBack}
          onToggleActive={handleToggleActive}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent._id} agent={agent} onClick={handleAgentClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveAgentsPage;