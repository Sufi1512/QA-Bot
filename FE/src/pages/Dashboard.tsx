import React from 'react';
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
  AlertOctagon,
  AlertTriangle,
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

// Mock Data
const topQueries = [
  { query: "Password reset process", count: 245, category: "Account Access", trend: 'up' },
  { query: "Billing cycle questions", count: 198, category: "Billing", trend: 'stable' },
  { query: "Service upgrade options", count: 156, category: "Product", trend: 'up' },
  { query: "Mobile app sync issues", count: 134, category: "Technical", trend: 'down' },
  { query: "Subscription cancellation", count: 112, category: "Account Management", trend: 'stable' },
];

const customerTopics = [
  { topic: "Account Security", percentage: 35, sentiment: 'neutral' },
  { topic: "Mobile Experience", percentage: 28, sentiment: 'negative' },
  { topic: "Customer Support", percentage: 22, sentiment: 'positive' },
  { topic: "Product Features", percentage: 15, sentiment: 'positive' },
];

const urgentIssues = [
  { issue: "Mobile App Crash", affected: 127, status: "Under Investigation" },
  { issue: "Payment Gateway Error", affected: 89, status: "Resolved" },
  { issue: "Login Authentication", affected: 45, status: "In Progress" },
];

const sentimentData = [
  { time: '0:00', sentiment: 50, baseline: 50 },
  { time: '1:00', sentiment: 45, baseline: 50 },
  { time: '2:00', sentiment: 30, baseline: 50 },
  { time: '3:00', sentiment: 20, baseline: 50 },
  { time: '4:00', sentiment: 35, baseline: 50 },
  { time: '5:00', sentiment: 60, baseline: 50 },
  { time: '6:00', sentiment: 75, baseline: 50 },
];

const agentPerformance = {
  name: "John Smith",
  sentimentScore: 85,
  resolutionRate: 92,
  complianceScore: 98,
  empathyScore: 88,
  clarityScore: 90,
  efficiency: 87,
};

const radarData = [
  { metric: 'Sentiment', value: agentPerformance.sentimentScore },
  { metric: 'Resolution', value: agentPerformance.resolutionRate },
  { metric: 'Compliance', value: agentPerformance.complianceScore },
  { metric: 'Empathy', value: agentPerformance.empathyScore },
  { metric: 'Clarity', value: agentPerformance.clarityScore },
  { metric: 'Efficiency', value: agentPerformance.efficiency },
];

// StatCard Component
function StatCard({ title, value, icon, trend, color, linkTo }) {
  return (
    <Link to={linkTo} className={`bg-white rounded-lg shadow-md p-6 block transform transition-transform hover:scale-105 hover:shadow-lg ${color}`}>
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
function CallCard({ agentName, duration, sentiment, status }) {
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
function AlertCard({ type, message, agent, time }) {
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

const Dashboard = ({ metrics, timeRange, setTimeRange }) => {
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