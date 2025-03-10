import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BackButton from '../components/BackButton';
import { CALLS_ENDPOINT } from '../constants/api';

const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    // Add any other required headers here
  },
  credentials: 'include' as RequestCredentials
};

interface Call {
  callId: string;
  agentId: string;
  customerId: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  transcript: string;
  sentimentScore: number;
  complianceScore: number;
  resolutionStatus: string;
  metadata: {
    keywords: string[];
    topics: string[];
    responseTime: number;
  };
  companyId: string;
}

interface CallData {
  time: string;
  calls: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

// Move outside of component
const formatTimeString = (hour: number): string => {
  const paddedHour = hour.toString().padStart(2, '0');
  return `${paddedHour}:00`;
};

const CustomTooltip = ({ active, payload, label }: TooltipProps): JSX.Element | null => {
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

const CallCard = ({ call }: { call: Call }): JSX.Element => {
  const calculateDuration = (start: string, end: string) => {
    if (!end) return 'N/A';
    const diffMs = new Date(end).getTime() - new Date(start).getTime();
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

const TotalCallsPage = (): JSX.Element => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callData, setCallData] = useState<CallData[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchCalls = async () => {
      try {
        setLoading(true);
        const response = await fetch(CALLS_ENDPOINT, {
          ...API_CONFIG,
          method: 'GET'
        });

        if (!response.ok) {
          console.error('Response status:', response.status);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (isMounted && Array.isArray(data)) {
          setCalls(data);
          const aggregatedData = aggregateCallsByHour(data);
          setCallData(aggregatedData);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch calls');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCalls();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!calls || !Array.isArray(calls)) return;
    
    const aggregatedData = aggregateCallsByHour(calls);
    setCallData(aggregatedData);
  }, [calls]);

  // Aggregate calls by hour
  const aggregateCallsByHour = (calls: Call[]): CallData[] => {
    if (!calls?.length) return [];
    
    const hourlyData: Record<string, number> = {};
    calls.forEach(call => {
      if (!call?.startTime) return;
      
      const date = new Date(call.startTime);
      if (date.toString() === 'Invalid Date') return;
      
      const hour = date.getHours();
      const timeKey = formatTimeString(hour);
      hourlyData[timeKey] = (hourlyData[timeKey] || 0) + 1;
    });

    return Array.from({ length: 24 }, (_, i) => ({
      time: formatTimeString(i),
      calls: hourlyData[formatTimeString(i)] || 0
    }));
  };

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Error: {error}</div>;
  if (!calls || !Array.isArray(calls)) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">No data available</div>;
  }
  if (!callData.length) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">No calls found</div>;

  // Find peak and lowest call volumes
  const peakCall = callData.reduce((max, curr) => (curr.calls > max.calls ? curr : max), callData[0]);
  const lowestCall = callData.reduce((min, curr) => (curr.calls < min.calls ? curr : min), callData[0]);
  const totalCalls = calls.length;

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
              {calls.map(call => (
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