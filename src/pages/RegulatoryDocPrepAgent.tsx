import React from "react";
import { Card, CardContent } from "../components/ui/Card";
import { FileText, Upload, CheckCircle, Clock } from "lucide-react";

const RegulatoryDocPrepAgent = () => {
  return (
    <div className="space-y-8 flex flex-col flex-1 p-6 min-h-screen bg-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Regulatory Doc Prep Agent</h2>
          <p className="text-gray-700 mt-1">
            AI-powered assistance for preparing regulatory documentation
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#2094f3] hover:bg-blue-800 text-white font-medium"
        >
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
          New Document
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md font-medium text-gray-700">
                  Documents Generated
                </p>
                <p className="text-2xl font-semibold text-blue-600">
                  24
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md font-medium text-gray-700">
                  In Progress
                </p>
                <p className="text-2xl font-semibold text-orange-500">
                  7
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md font-medium text-gray-700">
                  Completed
                </p>
                <p className="text-2xl font-semibold text-green-600">
                  17
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md font-medium text-gray-700">
                  Templates Used
                </p>
                <p className="text-2xl font-semibold text-purple-600">
                  12
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card>
        <div className="px-6 py-4 border-b border-ms-gray-300">
          <h3 className="text-lg font-medium text-ms-gray-900">
            Document Preparation Tools
          </h3>
        </div>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              AI-Powered Document Generation
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Use our AI assistant to help prepare regulatory documents, generate templates, and ensure compliance requirements are met.
            </p>
            <button className="bg-[#2094f3] hover:bg-blue-800 text-white px-6 py-2 rounded-md font-medium">
              Start Document Preparation
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Documents */}
      <Card>
        <div className="px-6 py-4 border-b border-ms-gray-300">
          <h3 className="text-lg font-medium text-ms-gray-900">
            Recent Documents
          </h3>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              { name: "510(k) Premarket Notification", type: "Device", status: "Completed", date: "2024-06-03" },
              { name: "Clinical Study Report", type: "Drug", status: "In Progress", date: "2024-06-02" },
              { name: "Risk Management Plan", type: "Device", status: "Draft", date: "2024-06-01" },
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.type} • {doc.date}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  doc.status === "Completed" ? "bg-green-100 text-green-700" :
                  doc.status === "In Progress" ? "bg-orange-100 text-orange-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegulatoryDocPrepAgent;