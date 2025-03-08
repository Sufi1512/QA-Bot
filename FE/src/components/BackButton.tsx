// components/BackButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  return (
    <Link
      to="/"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-auto" // Added ml-auto
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      Back to Dashboard
    </Link>
  );
};

export default BackButton;