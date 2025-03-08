import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BackButton from '../components/BackButton';

interface ComplianceData {
  agent: string;
  score: number;
}

const complianceData: ComplianceData[] = [
  { agent: 'John Smith', score: 98 },
  { agent: 'Sarah Johnson', score: 95 },
  { agent: 'Mike Wilson', score: 92 },
  { agent: 'Emily Davis', score: 97 },
  { agent: 'Tom Brown', score: 90 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-md">
        <p className="text-gray-900 font-semibold">{`Agent: ${label}`}</p>
        <p className="text-purple-500">{`Compliance Score: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const CompliancePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
            <BackButton />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Compliance Overview</h2>
          </div>

          <div className="mb-8">
            <p className="text-gray-600">
              This page shows the compliance scores of agents based on adherence to protocols and regulations.
              High compliance ensures quality and legal standards are met.
            </p>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="agent" stroke="#6b7280" />
                <YAxis domain={[80, 100]} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="score" fill="#8B5CF6" name="Compliance Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Highest Compliance</h4>
                    <p className="text-sm text-gray-500">John Smith</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    98%
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg transform transition-transform hover:scale-105 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Lowest Compliance</h4>
                    <p className="text-sm text-gray-500">Tom Brown</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    90%
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

export default CompliancePage;