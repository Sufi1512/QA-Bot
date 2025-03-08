import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BackButton from '../components/BackButton';

interface SentimentData {
  time: string;
  sentiment: number;
}

const sentimentData: SentimentData[] = [
  { time: '0:00', sentiment: 50 },
  { time: '1:00', sentiment: 45 },
  { time: '2:00', sentiment: 30 },
  { time: '3:00', sentiment: 20 },
  { time: '4:00', sentiment: 35 },
  { time: '5:00', sentiment: 60 },
  { time: '6:00', sentiment: 75 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-md">
        <p className="text-gray-900 font-semibold">{`Time: ${label}`}</p>
        <p className="text-red-500">{`Avg Sentiment: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const AvgSentimentPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
            <BackButton />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Average Sentiment Overview</h2>
          </div>

          <div className="mb-8">
            <p className="text-gray-600">
              This page monitors the average sentiment score of customer interactions over time.
              Sentiment analysis helps gauge customer satisfaction and agent performance.
            </p>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="sentiment" stroke="#EF4444" strokeWidth={2} name="Avg Sentiment" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Highest Sentiment</h4>
                    <p className="text-sm text-gray-500">6:00 PM</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    75%
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Lowest Sentiment</h4>
                    <p className="text-sm text-gray-500">3:00 AM</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    20%
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

export default AvgSentimentPage;