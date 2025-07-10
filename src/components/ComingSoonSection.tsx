import { Link } from "react-router-dom";

interface ComingSoonSectionProps {
  agentName: string;
}

const ComingSoonSection = ({ agentName }: ComingSoonSectionProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {agentName}
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Coming Soon
          </h2>
        </div>
        
        <p className="text-xl text-gray-600 mb-8">
          We're working hard to bring you this exciting new feature. Stay tuned for updates!
        </p>
        
        <div className="space-y-6">
          <p className="text-gray-500">
            In the meantime, explore our other available features
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/"
              className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Return Home
            </Link>
            <Link
              to="/agents/presubmission-strategy"
              className="px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              Try Pre-submission Strategy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonSection; 