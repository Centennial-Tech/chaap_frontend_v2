import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/Card";

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
  "Software Documentation"
];

const RegulatoryDocPrepAgent = () => {
  const [selectedSubmission, setSelectedSubmission] = useState("");
  const [selectedAttachmentType, setSelectedAttachmentType] = useState("");
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formResponses, setFormResponses] = useState({
    deviceName: "",
    intendedUse: "",
    targetPopulation: "",
    riskClass: "",
    regulatoryPathway: ""
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
    // Add validation logic here
  };

  const handleFormChange = (field: string, value: string) => {
    setFormResponses(prev => ({ ...prev, [field]: value }));
  };

  const handleModalCreate = () => {
    setIsCreateModalOpen(false);
    // Add creation logic here
  };

  return (
    <div className="space-y-8 flex flex-col flex-1 p-6 min-h-screen bg-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Regulatory Doc Prep Agent</h2>
          <p className="text-gray-700 mt-1">
            AI-powered assistance for preparing regulatory documentation
          </p>
        </div>
      </div>

      {/* Document Preparation Interface */}
      <div className="flex items-center justify-center min-h-[40vh]">
        <Card className="w-full max-w-2xl">
          <div className="px-6 py-4 border-b border-ms-gray-300">
            <h3 className="text-xl font-semibold text-ms-gray-900 text-center">Document Preparation Agent</h3>
            <p className="text-gray-600 text-center mt-1">Configure document generation parameters</p>
          </div>
          
          <CardContent className="space-y-8 p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="submission-select" className="text-sm font-medium text-gray-700">
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
                    <option key={submission.id} value={submission.id.toString()}>
                      {submission.submissionName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="attachment-select" className="text-sm font-medium text-gray-700">
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
                    <option key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
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

      {/* Modals would go here - simplified for now */}
      {isValidateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload Document for Validation</h3>
            <p className="text-gray-600 mb-4">Please upload the document you want to validate.</p>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsValidateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleModalValidate}
                disabled={!uploadedFile}
                className="px-4 py-2 bg-[#2094f3] text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
              >
                Validate
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create New Document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  value={formResponses.deviceName}
                  onChange={(e) => handleFormChange('deviceName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intended Use</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  value={formResponses.intendedUse}
                  onChange={(e) => handleFormChange('intendedUse', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Classification</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  value={formResponses.riskClass}
                  onChange={(e) => handleFormChange('riskClass', e.target.value)}
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