import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Phone,
  Heart,
  Shield,
  Clock,
  ThumbsUp,
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  AlertOctagon,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Add mock data for development
const MOCK_DATA = {
  queries: [
    { query: "Product Status", category: "Support", count: 25, trend: "up" },
    { query: "Billing Issue", category: "Billing", count: 18, trend: "down" }
  ],
  topics: [
    { topic: "Service Quality", sentiment: "positive", percentage: 75 },
    { topic: "Response Time", sentiment: "neutral", percentage: 60 }
  ],
  issues: [
    { issue: "System Outage", affected: 150, status: "In Progress" },
    { issue: "Login Issues", affected: 75, status: "Resolved" }
  ],
  sentiment: [
    { time: "0min", sentiment: 75, baseline: 70 },
    { time: "5min", sentiment: 80, baseline: 70 }
  ],
  performance: {
    sentimentScore: 85,
    resolutionRate: 90,
    complianceScore: 95,
    empathyScore: 88,
    clarityScore: 92,
    efficiency: 87
  }
};

// Update API configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  endpoints: {
    queries: '/v1/analytics/queries',
    topics: '/v1/analytics/topics',
    issues: '/v1/analytics/issues',
    sentiment: '/v1/analytics/sentiment',
    performance: '/v1/agents/performance'
  },
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  useMockData: import.meta.env.DEV // Use mock data in development
};

// Add API response types
interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Define props interface for StatCard
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;  
  color: string;
  linkTo: string;
}

// StatCard Component
function StatCard({ title, value, icon, trend, color, linkTo }: StatCardProps) {
  return (
    <Link
      to={linkTo}
      className={`bg-white rounded-lg shadow-md p-6 block transform transition-transform hover:scale-105 hover:shadow-lg ${color}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="mt-1 text-sm text-gray-500">
          <span className={trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
            {trend}
          </span>
          {' '}vs last period
        </p>
      </div>
    </Link>
  );
}

// CallCard Component
function CallCard({ agentName, duration, sentiment, status }: {
  agentName: string;
  duration: string;
  sentiment: number;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105">
      <div className="flex items-center space-x-4">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <div>
          <p className="font-medium text-gray-900">{agentName}</p>
          <p className="text-sm text-gray-500">{duration}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-900">{sentiment}%</p>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {status}
        </span>
      </div>
    </div>
  );
}

// AlertCard Component
function AlertCard({ type, message, agent, time }: {
  type: string;
  message: string;
  agent: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105">
      <div className="flex items-center space-x-4">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <div>
          <p className="font-medium text-gray-900">{type}</p>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{agent}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

interface DashboardProps {
  metrics: {
    activeAgents: number;
    totalCalls: number;
    avgSentiment: number;
    complianceScore: number;
    avgHandleTime: string;
    resolutionRate: number;
  };
  timeRange: string;
  setTimeRange: (value: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ metrics, timeRange, setTimeRange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topQueries, setTopQueries] = useState<{ query: string; category: string; count: number; trend: string; }[]>([]);
  const [customerTopics, setCustomerTopics] = useState<{ topic: string; sentiment: string; percentage: number; }[]>([]);
  const [urgentIssues, setUrgentIssues] = useState<{ issue: string; affected: number; status: string; }[]>([]);
  const [sentimentData, setSentimentData] = useState<{ time: string; sentiment: number; baseline: number; }[]>([]);
  const [agentPerformance, setAgentPerformance] = useState<{
    sentimentScore: number;
    resolutionRate: number;
    complianceScore: number;
    empathyScore: number;
    clarityScore: number;
    efficiency: number;
  } | null>(null);

  const fetchWithRetry = async (url: string, attempts: number = API_CONFIG.retryAttempts): Promise<Response> => {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(API_CONFIG.timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (attempts > 1) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
        return fetchWithRetry(url, attempts - 1);
      }
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use mock data in development mode
        if (API_CONFIG.useMockData) {
          console.log('Using mock data in development mode');
          setTopQueries(MOCK_DATA.queries);
          setCustomerTopics(MOCK_DATA.topics);
          setUrgentIssues(MOCK_DATA.issues);
          setSentimentData(MOCK_DATA.sentiment);
          setAgentPerformance(MOCK_DATA.performance);
          setIsLoading(false);
          return;
        }

        const endpoints = [
          API_CONFIG.endpoints.queries,
          API_CONFIG.endpoints.topics,
          API_CONFIG.endpoints.issues,
          API_CONFIG.endpoints.sentiment,
          API_CONFIG.endpoints.performance,
        ];

        console.log('Fetching data from endpoints:', endpoints);

        const responses = await Promise.all(
          endpoints.map(endpoint => {
            console.log('Fetching:', `${API_CONFIG.baseURL}${endpoint}`);
            return fetchWithRetry(endpoint);
          })
        );

        const [
          queriesData,
          topicsData,
          issuesData,
          sentimentData,
          agentData
        ] = await Promise.all(
          responses.map(async (res) => {
            const data = await res.json();
            if (!data || !data.data) {
              throw new Error('Invalid data format received from server');
            }
            return data.data;
          })
        );

        setTopQueries(queriesData);
        setCustomerTopics(topicsData);
        setUrgentIssues(issuesData);
        setSentimentData(sentimentData);
        setAgentPerformance(agentData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        let errorMessage = 'Failed to load dashboard data. Please try again later.';
        
        if (API_CONFIG.useMockData) {
          console.log('Falling back to mock data after error');
          setTopQueries(MOCK_DATA.queries);
          setCustomerTopics(MOCK_DATA.topics);
          setUrgentIssues(MOCK_DATA.issues);
          setSentimentData(MOCK_DATA.sentiment);
          setAgentPerformance(MOCK_DATA.performance);
          setIsLoading(false);
          return;
        }
        
        if (err instanceof TypeError && err.message.includes('NetworkError')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (err instanceof Error && err.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
        } else if (err instanceof Error && err.message.includes('Invalid data format')) {
          errorMessage = 'Server returned invalid data. Please contact support.';
        }
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]); // Added timeRange as dependency to refresh data when it changes

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <AlertOctagon className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!agentPerformance || !topQueries.length || !customerTopics.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-600">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const radarData = [
    { metric: 'Sentiment', value: agentPerformance.sentimentScore },
    { metric: 'Resolution', value: agentPerformance.resolutionRate },
    { metric: 'Compliance', value: agentPerformance.complianceScore },
    { metric: 'Empathy', value: agentPerformance.empathyScore },
    { metric: 'Clarity', value: agentPerformance.clarityScore },
    { metric: 'Efficiency', value: agentPerformance.efficiency },
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Summary */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Analytics Summary</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard 
            title="Active Agents" 
            value={metrics.activeAgents.toString()}
            icon={<Users className="h-6 w-6 text-blue-500" />}
            trend="+2"
            color="bg-blue-50"
            linkTo="/active-agents"
          />
          <StatCard 
            title="Total Calls" 
            value={metrics.totalCalls.toString()}
            icon={<Phone className="h-6 w-6 text-green-500" />}
            trend="+124"
            color="bg-green-50"
            linkTo="/total-calls"
          />
          <StatCard 
            title="Avg Sentiment" 
            value={`${metrics.avgSentiment}%`}
            icon={<Heart className="h-6 w-6 text-red-500" />}
            trend="+5%"
            color="bg-red-50"
            linkTo="/avg-sentiment"
          />
          <StatCard 
            title="Compliance" 
            value={`${metrics.complianceScore}%`}
            icon={<Shield className="h-6 w-6 text-purple-500" />}
            trend="+2%"
            color="bg-purple-50"
            linkTo="/compliance"
          />
          <StatCard 
            title="Avg Handle Time" 
            value={metrics.avgHandleTime}
            icon={<Clock className="h-6 w-6 text-yellow-500" />}
            trend="-0:15"
            color="bg-yellow-50"
            linkTo="/avg-handle-time"
          />
          <StatCard 
            title="Resolution Rate" 
            value={`${metrics.resolutionRate}%`}
            icon={<ThumbsUp className="h-6 w-6 text-indigo-500" />}
            trend="+3%"
            color="bg-indigo-50"
            linkTo="/resolution-rate"
          />
        </div>
      </div>
      
      {/* Most Frequent Queries & Key Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Most Frequent Queries</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">Export</button>
          </div>
          <div className="space-y-3">
            {topQueries.map((query, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transform transition-transform hover:scale-105">
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="font-medium text-gray-900">{query.query}</p>
                    <p className="text-sm text-gray-500">{query.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{query.count} calls</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    query.trend === 'up' ? 'bg-green-100 text-green-800' :
                    query.trend === 'down' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {query.trend === 'up' ? '↑' : query.trend === 'down' ? '↓' : '→'} {query.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Key Topics & Themes</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">Details</button>
          </div>
          <div className="space-y-3">
            {customerTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transform transition-transform hover:scale-105">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{topic.topic}</p>
                    <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          topic.sentiment === 'positive' ? 'bg-green-500' :
                          topic.sentiment === 'negative' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${topic.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{topic.percentage}%</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    topic.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                    topic.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {topic.sentiment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Urgent Issues & Call Sentiment Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Urgent Issues</h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {urgentIssues.filter(i => i.status !== 'Resolved').length} Active
            </span>
          </div>
          <div className="space-y-3">
            {urgentIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg transform transition-transform hover:scale-105">
                <div className="flex items-center space-x-3">
                  <AlertOctagon className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">{issue.issue}</p>
                    <p className="text-sm text-gray-500">{issue.affected} customers affected</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                  issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Call Sentiment Timeline</h2>
            <select className="border rounded-md px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Current Call</option>
              <option>Last Call</option>
              <option>Select Call</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="sentiment" stroke="#4F46E5" strokeWidth={2} name="Sentiment" />
                <Line type="monotone" dataKey="baseline" stroke="#E5E7EB" strokeWidth={1} strokeDasharray="5 5" name="Baseline" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Agent Performance Overview & Active Calls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Agent Performance Overview</h2>
            <select className="border rounded-md px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>John Smith</option>
              <option>Sarah Johnson</option>
              <option>Mike Wilson</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" stroke="#6b7280" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#6b7280" />
                <Radar name="Agent" dataKey="value" stroke="#4F46E5" fill="#818CF8" fillOpacity={0.6} />
                <Legend verticalAlign="top" height={36} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Calls</h2>
            <Link to="/active-agents" className="text-sm text-indigo-600 hover:text-indigo-800">View all</Link>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((call) => (
              <CallCard 
                key={call}
                agentName="John Smith"
                duration="4:32"
                sentiment={85}
                status="In Progress"
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">View all</button>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((alert) => (
            <AlertCard 
              key={alert}
              type="Compliance Risk"
              message="Missing required disclosure statement"
              agent="Sarah Johnson"
              time="2 min ago"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;