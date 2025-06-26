import React from "react";
const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-medium">Users</div>
          <div className="text-2xl font-bold mt-2">1,234</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-medium">Revenue</div>
          <div className="text-2xl font-bold mt-2">$12,345</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-lg font-medium">Active Sessions</div>
          <div className="text-2xl font-bold mt-2">56</div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-lg font-medium mb-4">Recent Activity</div>
        <ul className="list-disc pl-5 space-y-2">
          <li>User John signed up</li>
          <li>Payment received from Jane</li>
          <li>Session started by Alex</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
