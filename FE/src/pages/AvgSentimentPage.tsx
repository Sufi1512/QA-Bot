import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BackButton from '../components/BackButton';

interface SentimentData {
  time: string;
  sentiment: number;
}

const AvgSentimentPage = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        const response = await fetch('/api/sentiments');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        // Backend now guarantees consistent time format
        setSentimentData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sentiment data');
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentData();
  }, []);

  interface CustomTooltipProps {
    active: boolean;
    payload: { value: number }[];
    label: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

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
                <Tooltip content={<CustomTooltip active={false} payload={[]} label={''} />} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="sentiment" stroke="#EF4444" strokeWidth={2} name="Avg Sentiment" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              {sentimentData.length > 0 ? (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Highest Sentiment</h4>
                        <p className="text-sm text-gray-500">
                          {sentimentData.reduce((max, current) => current.sentiment > max.sentiment ? current : max, sentimentData[0]).time}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {Math.max(...sentimentData.map(item => item.sentiment))}%
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Lowest Sentiment</h4>
                        <p className="text-sm text-gray-500">
                          {sentimentData.reduce((min, current) => current.sentiment < min.sentiment ? current : min, sentimentData[0]).time}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {Math.min(...sentimentData.map(item => item.sentiment))}%
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 text-gray-500">
                  No sentiment data available
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AvgSentimentPage;