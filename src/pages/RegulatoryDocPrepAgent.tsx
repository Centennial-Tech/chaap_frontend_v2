import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

// Mock data for submissions
const mockSubmissions = [
  { id: 1, submissionName: "Cardiac Monitoring Device 2024" },
  { id: 2, submissionName: "Orthopedic Implant v2.1" },
  { id: 3, submissionName: "Diagnostic Kit Alpha" },
  { id: 4, submissionName: "Surgical Instrument Pro" },
];

const attachmentTypes = [
  "Device Description",
  "Predicate Comparison",
  "Performance Testing",
  "Risk Analysis",
  "Clinical Data",
  "Labeling",
  "Manufacturing Information",
  "Quality System",
  "Biocompatibility",
  "Software Documentation",
];

// Mock validation results object structure
const mockValidationResults = {
  overallScore: 85,
  maxScore: 100,
  grade: "B",
  reviewPoints: [
    {
      id: 1,
      category: "Compliance",
      status: "pass",
      score: 95,
      title: "FDA Regulation Compliance",
      description: "Document meets FDA 21 CFR Part 820 requirements",
      recommendation: "No action required",
    },
    {
      id: 2,
      category: "Completeness",
      status: "warning",
      score: 75,
      title: "Missing Technical Specifications",
      description: "Some technical specifications are incomplete or missing",
      recommendation: "Add detailed technical specifications in Section 4.2",
    },
    {
      id: 3,
      category: "Format",
      status: "pass",
      score: 90,
      title: "Document Structure",
      description: "Document follows proper formatting guidelines",
      recommendation: "Consider adding more visual aids",
    },
    {
      id: 4,
      category: "Risk Assessment",
      status: "fail",
      score: 60,
      title: "Incomplete Risk Analysis",
      description:
        "Risk analysis section lacks comprehensive hazard identification",
      recommendation: "Conduct thorough risk assessment following ISO 14971",
    },
  ],
  summary: {
    strengths: [
      "Clear regulatory pathway identification",
      "Comprehensive predicate device comparison",
      "Well-documented clinical evidence",
    ],
    improvements: [
      "Enhanced risk management documentation",
      "More detailed technical specifications",
      "Updated labeling requirements",
    ],
  },
};

const RegulatoryDocPrepAgent = () => {
  const [selectedSubmission, setSelectedSubmission] = useState("");
  const [selectedAttachmentType, setSelectedAttachmentType] = useState("");
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [isValidationResultsOpen, setIsValidationResultsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationResults, setValidationResults] = useState(null);
  const [formResponses, setFormResponses] = useState({
    deviceName: "",
    intendedUse: "",
    targetPopulation: "",
    riskClass: "",
    regulatoryPathway: "",
  });

  const isFormValid = selectedSubmission && selectedAttachmentType;

  const handleValidate = () => {
    setIsValidateModalOpen(true);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleModalValidate = () => {
    setIsValidateModalOpen(false);
    // Simulate API call
    setValidationResults(mockValidationResults);
    setIsValidationResultsOpen(true);
    setUploadedFile(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormResponses((prev) => ({ ...prev, [field]: value }));
  };

  const handleModalCreate = () => {
    setIsCreateModalOpen(false);
    // Add creation logic here
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-8 flex flex-col flex-1 p-6 min-h-screen bg-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Regulatory Doc Prep Agent
          </h2>
          <p className="text-gray-700 mt-1">
            AI-powered assistance for preparing regulatory documentation
          </p>
        </div>
      </div>

      {/* Document Preparation Interface */}
      <div className="flex items-center justify-center min-h-[40vh]">
        <Card className="w-full max-w-2xl">
          <div className="px-6 py-4 border-b border-ms-gray-300">
            <h3 className="text-xl font-semibold text-ms-gray-900 text-center">
              Document Preparation Agent
            </h3>
            <p className="text-gray-600 text-center mt-1">
              Configure document generation parameters
            </p>
          </div>

          <CardContent className="space-y-8 p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="submission-select"
                  className="text-sm font-medium text-gray-700"
                >
                  1. Submission Name
                </label>
                <select
                  id="submission-select"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedSubmission}
                  onChange={(e) => setSelectedSubmission(e.target.value)}
                >
                  <option value="">Select a recent submission</option>
                  {mockSubmissions.map((submission) => (
                    <option
                      key={submission.id}
                      value={submission.id.toString()}
                    >
                      {submission.submissionName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="attachment-select"
                  className="text-sm font-medium text-gray-700"
                >
                  2. Attachment Type
                </label>
                <select
                  id="attachment-select"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedAttachmentType}
                  onChange={(e) => setSelectedAttachmentType(e.target.value)}
                >
                  <option value="">Select document type to generate</option>
                  {attachmentTypes.map((type) => (
                    <option
                      key={type}
                      value={type.toLowerCase().replace(/\s+/g, "-")}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center space-x-6 pt-6">
              <button
                onClick={handleValidate}
                disabled={!isFormValid}
                className="px-8 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-colors"
              >
                Validate
              </button>

              <button
                onClick={handleCreate}
                disabled={!isFormValid}
                className="px-8 py-3 bg-[#2094f3] hover:bg-blue-700 text-white rounded-md disabled:bg-gray-300 transition-colors"
              >
                Create
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Modal */}
      {isValidateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
            {/* Close button */}
            <button
              onClick={() => setIsValidateModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold mb-2">Upload Document for Validation</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Please upload the document you want to validate for compliance and structure.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              
              {/* File upload area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">Click to upload or drag and drop</p>
                  <p className="text-gray-400 text-xs">PDF, DOC, DOCX, TXT files supported</p>
                </label>
              </div>

              {/* Show uploaded file */}
              {uploadedFile && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-green-700">{uploadedFile.name}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsValidateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleModalValidate}
                disabled={!uploadedFile}
                className="px-6 py-2 bg-[#2094f3] text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Validate Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Results Modal */}
      {isValidationResultsOpen && validationResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Validation Results</h3>
              <button
                onClick={() => setIsValidationResultsOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            {/* Overall Score */}
            <div className="text-center mb-6">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(validationResults.overallScore)}`}>
                {validationResults.overallScore}%
              </div>
              <div className="text-lg text-gray-600">Overall Compliance Score</div>
            </div>

            {/* Review Points */}
            <div className="space-y-3 mb-6">
              {validationResults.reviewPoints.map((point) => (
                <div key={point.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(point.status)}
                    <span className="font-medium">{point.title}</span>
                  </div>
                  <span className={`font-medium ${getScoreColor(point.score)}`}>
                    {point.score}%
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsValidationResultsOpen(false)}
                className="px-6 py-2 bg-[#2094f3] text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create New Document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  value={formResponses.deviceName}
                  onChange={(e) =>
                    handleFormChange("deviceName", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intended Use
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  value={formResponses.intendedUse}
                  onChange={(e) =>
                    handleFormChange("intendedUse", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Classification
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  value={formResponses.riskClass}
                  onChange={(e) =>
                    handleFormChange("riskClass", e.target.value)
                  }
                >
                  <option value="">Select risk class</option>
                  <option value="class-i">Class I</option>
                  <option value="class-ii">Class II</option>
                  <option value="class-iii">Class III</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleModalCreate}
                className="px-4 py-2 bg-[#2094f3] text-white rounded hover:bg-blue-700"
              >
                Submit & Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulatoryDocPrepAgent;
