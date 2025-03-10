// CallDashboard.js
import React from 'react';

const CallDashboard = () => {
  return (
    <div className="h-full w-full">
      <iframe
        src="http://localhost:5174"
        className="w-full h-full border-none"
        title="Call Dashboard"
      />
    </div>
  );
};

export default CallDashboard;