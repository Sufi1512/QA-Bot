import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BackButton from '../components/BackButton';

interface ResolutionData {
  time: string;
  rate: number;
}

const resolutionData: ResolutionData[] = [
  { time: '0:00', rate: 85 },
  { time: '1:00', rate: 87 },
  { time: '2:00', rate: 89 },
  { time: '3:00', rate: 90 },
  { time: '4:00', rate: 91 },
  { time: '5:00', rate: 92 },
  { time: '6:00', rate: 93 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-md">
        <p className="text-gray-900 font-semibold">{`Time: ${label}`}</p>
        <p className="text-indigo-500">{`Resolution Rate: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const ResolutionRatePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
            <BackButton />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Resolution Rate Overview</h2>
          </div>

          <div className="mb-8">
            <p className="text-gray-600">
              This page provides detailed information about the resolution rate of customer interactions.
              Monitoring resolution rate helps in understanding how effectively your team is resolving customer issues.
            </p>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis domain={[80, 100]} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="rate" stroke="#6366F1" strokeWidth={2} name="Resolution Rate" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Peak Resolution Rate</h4>
                    <p className="text-sm text-gray-500">6:00 PM</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    93%
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Low Resolution Rate Period</h4>
                    <p className="text-sm text-gray-500">0:00 AM</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    85%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-base font-medium text-gray-900">Trend Analysis</h4>
                <p className="text-sm text-gray-600">
                  Resolution rate improves throughout the day, peaking at 6:00 PM, possibly due to better agent performance or simpler issues later in the day. The lowest rate at 0:00 AM may indicate fatigue or complex issues.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-base font-medium text-gray-900">Comparison with Last Week</h4>
                <p className="text-sm text-gray-600">
                  Resolution rate improved by 3% compared to last week, particularly during evening hours, possibly due to improved agent training or better issue tracking.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="text-base font-medium text-gray-900">Recommendations</h4>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  <li>Analyze unresolved issues during low resolution rate periods to identify training needs.</li>
                  <li>Implement real-time resolution tracking tools to help agents improve performance during early morning shifts.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResolutionRatePage;