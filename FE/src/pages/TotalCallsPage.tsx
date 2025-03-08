import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BackButton from '../components/BackButton';

// Mock Data for Calls (based on callSchema, removed duration field)
const mockCalls = [
  {
    callId: 'call001',
    agentId: 'agent001',
    customerId: 'cust001',
    startTime: new Date('2025-03-08T00:00:00Z'),
    endTime: new Date('2025-03-08T00:05:00Z'),
    transcript: 'Customer asked about billing...',
    sentimentScore: 85,
    complianceScore: 95,
    resolutionStatus: 'Resolved',
    metadata: { keywords: ['billing'], topics: ['payment'], responseTime: 30 },
    companyId: 'comp001',
  },
  {
    callId: 'call002',
    agentId: 'agent002',
    customerId: 'cust002',
    startTime: new Date('2025-03-08T00:15:00Z'),
    endTime: new Date('2025-03-08T00:20:00Z'),
    transcript: 'Customer reported an issue...',
    sentimentScore: 78,
    complianceScore: 92,
    resolutionStatus: 'In Progress',
    metadata: { keywords: ['issue'], topics: ['technical'], responseTime: 45 },
    companyId: 'comp001',
  },
  {
    callId: 'call003',
    agentId: 'agent003',
    customerId: 'cust003',
    startTime: new Date('2025-03-08T01:00:00Z'),
    endTime: new Date('2025-03-08T01:04:48Z'),
    transcript: 'Customer requested upgrade...',
    sentimentScore: 72,
    complianceScore: 88,
    resolutionStatus: 'Resolved',
    metadata: { keywords: ['upgrade'], topics: ['product'], responseTime: 20 },
    companyId: 'comp001',
  },
  {
    callId: 'call004',
    agentId: 'agent004',
    customerId: 'cust004',
    startTime: new Date('2025-03-08T01:30:00Z'),
    endTime: new Date('2025-03-08T01:35:12Z'),
    transcript: 'Customer canceled subscription...',
    sentimentScore: 68,
    complianceScore: 85,
    resolutionStatus: 'Resolved',
    metadata: { keywords: ['cancel'], topics: ['account'], responseTime: 25 },
    companyId: 'comp001',
  },
  {
    callId: 'call005',
    agentId: 'agent005',
    customerId: 'cust005',
    startTime: new Date('2025-03-08T02:00:00Z'),
    endTime: new Date('2025-03-08T02:05:00Z'),
    transcript: 'Customer asked for refund...',
    sentimentScore: 65,
    complianceScore: 82,
    resolutionStatus: 'In Progress',
    metadata: { keywords: ['refund'], topics: ['billing'], responseTime: 35 },
    companyId: 'comp001',
  },
  {
    callId: 'call006',
    agentId: 'agent001',
    customerId: 'cust006',
    startTime: new Date('2025-03-08T02:15:00Z'),
    endTime: new Date('2025-03-08T02:20:18Z'),
    transcript: 'Customer had a question...',
    sentimentScore: 80,
    complianceScore: 90,
    resolutionStatus: 'Resolved',
    metadata: { keywords: ['question'], topics: ['general'], responseTime: 15 },
    companyId: 'comp001',
  },
  {
    callId: 'call007',
    agentId: 'agent002',
    customerId: 'cust007',
    startTime: new Date('2025-03-08T03:00:00Z'),
    endTime: new Date('2025-03-08T03:04:12Z'),
    transcript: 'Customer needed assistance...',
    sentimentScore: 82,
    complianceScore: 91,
    resolutionStatus: 'Resolved',
    metadata: { keywords: ['assistance'], topics: ['support'], responseTime: 40 },
    companyId: 'comp001',
  },
  {
    callId: 'call008',
    agentId: 'agent003',
    customerId: 'cust008',
    startTime: new Date('2025-03-08T03:30:00Z'),
    endTime: new Date('2025-03-08T03:34:24Z'),
    transcript: 'Customer reported a bug...',
    sentimentScore: 70,
    complianceScore: 87,
    resolutionStatus: 'In Progress',
    metadata: { keywords: ['bug'], topics: ['technical'], responseTime: 50 },
    companyId: 'comp001',
  },
  {
    callId: 'call009',
    agentId: 'agent004',
    customerId: 'cust009',
    startTime: new Date('2025-03-08T04:00:00Z'),
    endTime: new Date('2025-03-08T04:04:00Z'),
    transcript: 'Customer asked about features...',
    sentimentScore: 75,
    complianceScore: 86,
    resolutionStatus: 'Resolved',
    metadata: { keywords: ['features'], topics: ['product'], responseTime: 30 },
    companyId: 'comp001',
  },
  {
    callId: 'call010',
    agentId: 'agent005',
    customerId: 'cust010',
    startTime: new Date('2025-03-08T04:15:00Z'),
    endTime: new Date('2025-03-08T04:18:06Z'),
    transcript: 'Customer had a complaint...',
    sentimentScore: 62,
    complianceScore: 80,
    resolutionStatus: 'Unresolved',
    metadata: { keywords: ['complaint'], topics: ['support'], responseTime: 60 },
    companyId: 'comp001',
  },
  {
    callId: 'call011',
    agentId: 'agent001',
    customerId: 'cust011',
    startTime: new Date('2025-03-08T05:00:00Z'),
    endTime: new Date('2025-03-08T05:04:18Z'),
    transcript: 'Customer needed help...',
    sentimentScore: 88,
    complianceScore: 96,
    resolutionStatus: 'Resolved',
    metadata: { keywords: ['help'], topics: ['support'], responseTime: 25 },
    companyId: 'comp001',
  },
  {
    callId: 'call012',
    agentId: 'agent002',
    customerId: 'cust012',
    startTime: new Date('2025-03-08T05:30:00Z'),
    endTime: new Date('2025-03-08T05:34:24Z'),
    transcript: 'Customer asked about pricing...',
    sentimentScore: 80,
    complianceScore: 93,
    resolutionStatus: 'Resolved',
    metadata: { keywords: ['pricing'], topics: ['billing'], responseTime: 20 },
    companyId: 'comp001',
  },
  {
    callId: 'call013',
    agentId: 'agent003',
    customerId: 'cust013',
    startTime: new Date('2025-03-08T06:00:00Z'),
    endTime: new Date('2025-03-08T06:04:06Z'),
    transcript: 'Customer reported an error...',
    sentimentScore: 74,
    complianceScore: 89,
    resolutionStatus: 'In Progress',
    metadata: { keywords: ['error'], topics: ['technical'], responseTime: 35 },
    companyId: 'comp001',
  },
  {
    callId: 'call014',
    agentId: 'agent004',
    customerId: 'cust014',
    startTime: new Date('2025-03-08T06:15:00Z'),
    endTime: new Date('2025-03-08T06:19:12Z'),
    transcript: 'Customer asked for a demo...',
    sentimentScore: 78,
    complianceScore: 87,
    resolutionStatus: 'Resolved',
    metadata: { keywords: ['demo'], topics: ['product'], responseTime: 15 },
    companyId: 'comp001',
  },
];

// Aggregate calls by hour
const aggregateCallsByHour = (calls) => {
  const hourlyData = {};
  calls.forEach(call => {
    const hour = new Date(call.startTime).getHours();
    const timeKey = `${hour}:00`;
    if (!hourlyData[timeKey]) {
      hourlyData[timeKey] = 0;
    }
    hourlyData[timeKey] += 1;
  });

  // Convert to array and fill missing hours
  const result = [];
  for (let i = 0; i < 7; i++) {
    const time = `${i}:00`;
    result.push({ time, calls: hourlyData[time] || 0 });
  }
  return result;
};

const callData = aggregateCallsByHour(mockCalls);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-md">
        <p className="text-gray-900 font-semibold">{`Time: ${label}`}</p>
        <p className="text-green-500">{`Total Calls: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// Call Card Component with dynamic duration calculation
const CallCard = ({ call }) => {
  const calculateDuration = (start, end) => {
    if (!end) return 'N/A';
    const diffMs = new Date(end) - new Date(start);
    const minutes = diffMs / 1000 / 60; // Convert milliseconds to minutes
    return minutes.toFixed(1);
  };

  const duration = calculateDuration(call.startTime, call.endTime);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 transform transition-transform hover:scale-105 hover:shadow-lg">
      <p className="text-sm font-medium text-gray-900">Call ID: {call.callId}</p>
      <p className="text-sm text-gray-500">Agent ID: {call.agentId}</p>
      <p className="text-sm text-gray-500">Customer ID: {call.customerId}</p>
      <p className="text-sm text-gray-500">Start Time: {new Date(call.startTime).toLocaleString()}</p>
      <p className="text-sm text-gray-500">End Time: {call.endTime ? new Date(call.endTime).toLocaleString() : 'N/A'}</p>
      <p className="text-sm text-gray-500">Duration: {duration} min</p>
      <p className="text-sm text-gray-500">Sentiment Score: {call.sentimentScore}%</p>
      <p className="text-sm text-gray-500">Compliance Score: {call.complianceScore}%</p>
      <p className="text-sm text-gray-500">Resolution: {call.resolutionStatus}</p>
      <p className="text-sm text-gray-500">Topics: {call.metadata.topics.join(', ')}</p>
    </div>
  );
};

const TotalCallsPage = () => {
  // Find peak and lowest call volumes
  const peakCall = callData.reduce((max, curr) => (curr.calls > max.calls ? curr : max), callData[0]);
  const lowestCall = callData.reduce((min, curr) => (curr.calls < min.calls ? curr : min), callData[0]);
  const totalCalls = mockCalls.length;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-6">
            <BackButton />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Total Calls Overview</h2>
          </div>

          <div className="mb-8">
            <p className="text-gray-600">
              This page tracks the total number of calls handled by the support team over time and provides details of each call.
              Total calls recorded: <span className="font-semibold">{totalCalls}</span>. Understanding call volume trends aids in staffing and resource management.
            </p>
          </div>

          {/* Total Calls Chart */}
          <div className="h-96 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={callData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="calls" stroke="#10B981" strokeWidth={2} name="Total Calls" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Key Insights */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Peak Call Volume</h4>
                    <p className="text-sm text-gray-500">{peakCall.time}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {peakCall.calls} calls
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Lowest Call Volume</h4>
                    <p className="text-sm text-gray-500">{lowestCall.time}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {lowestCall.calls} calls
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Call Details */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {mockCalls.map(call => (
                <CallCard key={call.callId} call={call} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TotalCallsPage;