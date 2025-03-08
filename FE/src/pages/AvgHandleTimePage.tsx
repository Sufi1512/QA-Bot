import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BackButton from '../components/BackButton';

// Mock Data for Calls (based on callSchema)
const mockCalls = [
  { callId: 'call001', agentId: 'agent001', startTime: new Date('2025-03-08T00:00:00Z'), sentimentScore: 80, duration: 270 },
  { callId: 'call002', agentId: 'agent002', startTime: new Date('2025-03-08T00:15:00Z'), sentimentScore: 82, duration: 300 },
  { callId: 'call003', agentId: 'agent003', startTime: new Date('2025-03-08T01:00:00Z'), sentimentScore: 78, duration: 288 },
  { callId: 'call004', agentId: 'agent004', startTime: new Date('2025-03-08T01:30:00Z'), sentimentScore: 76, duration: 312 },
  { callId: 'call005', agentId: 'agent005', startTime: new Date('2025-03-08T02:00:00Z'), sentimentScore: 70, duration: 300 },
  { callId: 'call006', agentId: 'agent001', startTime: new Date('2025-03-08T02:15:00Z'), sentimentScore: 72, duration: 318 },
  { callId: 'call007', agentId: 'agent002', startTime: new Date('2025-03-08T03:00:00Z'), sentimentScore: 82, duration: 252 },
  { callId: 'call008', agentId: 'agent003', startTime: new Date('2025-03-08T03:30:00Z'), sentimentScore: 80, duration: 264 },
  { callId: 'call009', agentId: 'agent004', startTime: new Date('2025-03-08T04:00:00Z'), sentimentScore: 78, duration: 240 },
  { callId: 'call010', agentId: 'agent005', startTime: new Date('2025-03-08T04:15:00Z'), sentimentScore: 76, duration: 246 },
  { callId: 'call011', agentId: 'agent001', startTime: new Date('2025-03-08T05:00:00Z'), sentimentScore: 84, duration: 258 },
  { callId: 'call012', agentId: 'agent002', startTime: new Date('2025-03-08T05:30:00Z'), sentimentScore: 82, duration: 264 },
  { callId: 'call013', agentId: 'agent003', startTime: new Date('2025-03-08T06:00:00Z'), sentimentScore: 80, duration: 246 },
  { callId: 'call014', agentId: 'agent004', startTime: new Date('2025-03-08T06:15:00Z'), sentimentScore: 78, duration: 252 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-md">
        <p className="text-gray-900 font-semibold">{`Time: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className={entry.name === 'minutes' ? 'text-yellow-500' : 'text-blue-500'}>
            {`${entry.name === 'minutes' ? 'Avg Handle Time' : 'Sentiment Score'}: ${entry.value}${entry.name === 'minutes' ? ' min' : '%'}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AvgHandleTimePage = () => {
  // Aggregate sentiment data by hour to match handleTimeData
  const sentimentDataByHour = mockCalls.reduce((acc, call) => {
    const hour = new Date(call.startTime).getHours();
    const hourKey = `${hour}:00`;
    if (!acc[hourKey]) {
      acc[hourKey] = { sentimentScore: 0, count: 0 };
    }
    acc[hourKey].sentimentScore += call.sentimentScore || 0;
    acc[hourKey].count += 1;
    return acc;
  }, {});

  // Static handleTimeData
  const handleTimeData = [
    { time: '0:00', minutes: 4.5 },
    { time: '1:00', minutes: 4.8 },
    { time: '2:00', minutes: 5.0 },
    { time: '3:00', minutes: 4.2 },
    { time: '4:00', minutes: 4.0 },
    { time: '5:00', minutes: 4.3 },
    { time: '6:00', minutes: 4.1 },
  ];

  // Merge handleTimeData with sentiment data
  const combinedData = handleTimeData.map(data => ({
    ...data,
    sentimentScore: sentimentDataByHour[data.time] ? (sentimentDataByHour[data.time].sentimentScore / sentimentDataByHour[data.time].count) : null,
  }));

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
            <BackButton />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Average Handle Time Overview</h2>
          </div>

          <div className="mb-8">
            <p className="text-gray-600">
              This page tracks the average handle time (AHT) and sentiment scores for customer calls over time.
              Optimizing AHT improves efficiency while maintaining quality service.
            </p>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis yAxisId="left" domain={[3, 6]} stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Line yAxisId="left" type="monotone" dataKey="minutes" stroke="#F59E0B" strokeWidth={2} name="Avg Handle Time (min)" />
                <Line yAxisId="right" type="monotone" dataKey="sentimentScore" stroke="#3B82F6" strokeWidth={2} name="Sentiment Score (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Shortest AHT</h4>
                    <p className="text-sm text-gray-500">4:00 AM</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    4.0 min
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Longest AHT</h4>
                    <p className="text-sm text-gray-500">2:00 AM</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    5.0 min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AvgHandleTimePage;