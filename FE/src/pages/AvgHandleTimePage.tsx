import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BackButton from '../components/BackButton';

const AvgHandleTimePage = () => {
  interface Call {
    startTime: string;
    sentimentScore: number;
  }

  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/calls`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Include if you need to handle cookies
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let data;
        try {
          data = await response.json();
        } catch {
          throw new Error('Failed to parse JSON response');
        }

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format: expected an array');
        }

        setCalls(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch call data');
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Aggregate sentiment data by hour to match handleTimeData
  const sentimentDataByHour = calls.reduce((acc: { [key: string]: { sentimentScore: number; count: number } }, call) => {
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
                <Tooltip />
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