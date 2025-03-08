import React, { useState } from 'react';
import { 
  BarChart3, 
  Headphones, 
  Users, 
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  Bell,
  Search,
  Phone,
  Heart,
  Settings,
  Clock,
  ThumbsUp,
  Shield,
  HelpCircle,
  Star,
  AlertOctagon,
  CheckCircle2,
  MessageCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  Legend
} from 'recharts';
import { format } from 'date-fns';

interface QAMetrics {
  activeAgents: number;
  totalCalls: number;
  avgSentiment: number;
  complianceScore: number;
  avgHandleTime: string;
  resolutionRate: number;
}

interface AgentPerformance {
  name: string;
  sentimentScore: number;
  resolutionRate: number;
  complianceScore: number;
  empathyScore: number;
  clarityScore: number;
  efficiency: number;
}

interface SentimentData {
  time: string;
  sentiment: number;
  baseline: number;
}

interface TopQuery {
  query: string;
  count: number;
  category: string;
  trend: 'up' | 'down' | 'stable';
}

interface CustomerTopic {
  topic: string;
  percentage: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

const topQueries: TopQuery[] = [
  { query: "Password reset process", count: 245, category: "Account Access", trend: 'up' },
  { query: "Billing cycle questions", count: 198, category: "Billing", trend: 'stable' },
  { query: "Service upgrade options", count: 156, category: "Product", trend: 'up' },
  { query: "Mobile app sync issues", count: 134, category: "Technical", trend: 'down' },
  { query: "Subscription cancellation", count: 112, category: "Account Management", trend: 'stable' }
];

const customerTopics: CustomerTopic[] = [
  { topic: "Account Security", percentage: 35, sentiment: 'neutral' },
  { topic: "Mobile Experience", percentage: 28, sentiment: 'negative' },
  { topic: "Customer Support", percentage: 22, sentiment: 'positive' },
  { topic: "Product Features", percentage: 15, sentiment: 'positive' }
];

const urgentIssues = [
  { issue: "Mobile App Crash", affected: 127, status: "Under Investigation" },
  { issue: "Payment Gateway Error", affected: 89, status: "Resolved" },
  { issue: "Login Authentication", affected: 45, status: "In Progress" }
];

const sentimentData: SentimentData[] = [
  { time: '0:00', sentiment: 50, baseline: 50 },
  { time: '1:00', sentiment: 45, baseline: 50 },
  { time: '2:00', sentiment: 30, baseline: 50 },
  { time: '3:00', sentiment: 20, baseline: 50 },
  { time: '4:00', sentiment: 35, baseline: 50 },
  { time: '5:00', sentiment: 60, baseline: 50 },
  { time: '6:00', sentiment: 75, baseline: 50 },
];

const agentPerformance: AgentPerformance = {
  name: "John Smith",
  sentimentScore: 85,
  resolutionRate: 92,
  complianceScore: 98,
  empathyScore: 88,
  clarityScore: 90,
  efficiency: 87
};

const radarData = [
  { metric: 'Sentiment', value: agentPerformance.sentimentScore },
  { metric: 'Resolution', value: agentPerformance.resolutionRate },
  { metric: 'Compliance', value: agentPerformance.complianceScore },
  { metric: 'Empathy', value: agentPerformance.empathyScore },
  { metric: 'Clarity', value: agentPerformance.clarityScore },
  { metric: 'Efficiency', value: agentPerformance.efficiency },
];

function App() {
  const [metrics] = useState<QAMetrics>({
    activeAgents: 24,
    totalCalls: 856,
    avgSentiment: 78,
    complianceScore: 95,
    avgHandleTime: "4:32",
    resolutionRate: 92
  });

  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Headphones className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">QA Monitoring Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search agents or calls..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Analytics Summary</h2>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm text-gray-600"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last Quarter</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard 
            title="Active Agents" 
            value={metrics.activeAgents.toString()}
            icon={<Users className="h-6 w-6 text-blue-500" />}
            trend="+2"
          />
          <StatCard 
            title="Total Calls" 
            value={metrics.totalCalls.toString()}
            icon={<Phone className="h-6 w-6 text-green-500" />}
            trend="+124"
          />
          <StatCard 
            title="Avg Sentiment" 
            value={`${metrics.avgSentiment}%`}
            icon={<Heart className="h-6 w-6 text-red-500" />}
            trend="+5%"
          />
          <StatCard 
            title="Compliance" 
            value={`${metrics.complianceScore}%`}
            icon={<Shield className="h-6 w-6 text-purple-500" />}
            trend="+2%"
          />
          <StatCard 
            title="Avg Handle Time" 
            value={metrics.avgHandleTime}
            icon={<Clock className="h-6 w-6 text-yellow-500" />}
            trend="-0:15"
          />
          <StatCard 
            title="Resolution Rate" 
            value={`${metrics.resolutionRate}%`}
            icon={<ThumbsUp className="h-6 w-6 text-indigo-500" />}
            trend="+3%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Most Frequent Queries</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">Export</button>
            </div>
            <div className="space-y-4">
              {topQueries.map((query, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <HelpCircle className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="font-medium text-gray-900">{query.query}</p>
                      <p className="text-sm text-gray-500">{query.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{query.count} calls</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Key Topics & Themes</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">Details</button>
            </div>
            <div className="space-y-4">
              {customerTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{topic.topic}</p>
                      <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Urgent Issues</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                3 Active
              </span>
            </div>
            <div className="space-y-4">
              {urgentIssues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <AlertOctagon className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-gray-900">{issue.issue}</p>
                      <p className="text-sm text-gray-500">{issue.affected} customers affected</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Success Stories</h2>
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Mobile App Enhancement</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Recent UI improvements led to a 45% reduction in app-related support calls and increased user satisfaction scores by 28%.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-4">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Password Reset Process</p>
                    <p className="text-sm text-gray-600 mt-1">
                      New self-service flow reduced password reset calls by 65% and improved first-contact resolution rate to 92%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Call Sentiment Timeline</h2>
              <select className="border rounded-md px-3 py-1.5 text-sm text-gray-600">
                <option>Current Call</option>
                <option>Last Call</option>
                <option>Select Call</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sentiment" stroke="#4F46E5" strokeWidth={2} />
                  <Line type="monotone" dataKey="baseline" stroke="#E5E7EB" strokeWidth={1} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Agent Performance Overview</h2>
              <select className="border rounded-md px-3 py-1.5 text-sm text-gray-600">
                <option>John Smith</option>
                <option>Sarah Johnson</option>
                <option>Mike Wilson</option>
              </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Agent" dataKey="value" stroke="#4F46E5" fill="#818CF8" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Active Calls</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">View all</button>
            </div>
            <div className="space-y-4">
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

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">View all</button>
            </div>
            <div className="space-y-4">
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
      </main>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
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
    </div>
  );
}

interface CallCardProps {
  agentName: string;
  duration: string;
  sentiment: number;
  status: string;
}

function CallCard({ agentName, duration, sentiment, status }: CallCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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

interface AlertCardProps {
  type: string;
  message: string;
  agent: string;
  time: string;
}

function AlertCard({ type, message, agent, time }: AlertCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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

export default App;