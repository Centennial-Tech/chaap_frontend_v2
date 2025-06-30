const Dashboard = () => {
  return (
    <div className="flex flex-col flex-1 p-6 min-h-screen bg-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[##2f2f32]">Dashboard</h2>
          <p className="text-gray-700 mt-1">
            Manage your 510(k) submissions and compliance documentation
          </p>
        </div>
        <a href="/form-builder">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-white transition-colors focus:outline-none focus:ring-2 focus:ring-[##2094f3] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#2094f3] hover:bg-blue-800 text-white font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 mr-2"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            New 510(k) Submission
          </button>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
