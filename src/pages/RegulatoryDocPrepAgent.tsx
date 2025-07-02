import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { CheckCircle, AlertTriangle, XCircle, Download } from "lucide-react";
import Modal from "../components/ui/Modal";

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

// Simplified mock API response for form questions
const mockFormQuestions = {
  "device-description": [
    { id: "deviceName", label: "Device Name", type: "text", required: true },
    { id: "intendedUse", label: "Intended Use", type: "textarea", required: true },
    { id: "riskClass", label: "Risk Classification", type: "select", required: true, options: ["Class I", "Class II", "Class III"] },
  ],
  "predicate-comparison": [
    { id: "deviceName", label: "Device Name", type: "text", required: true },
    { id: "predicateDevice", label: "Predicate Device", type: "text", required: true },
    { id: "similarities", label: "Key Similarities", type: "textarea", required: true },
  ],
  "performance-testing": [
    { id: "testingOverview", label: "Testing Overview", type: "textarea", required: true },
    { id: "testStandards", label: "Standards Followed", type: "text", required: true },
    { id: "testResults", label: "Summary of Test Results", type: "textarea", required: true },
  ],
  "risk-analysis": [
    { id: "riskAnalysisStandard", label: "Risk Analysis Standard", type: "select", required: true, options: ["ISO 14971", "IEC 62304", "ISO 13485"] },
    { id: "hazardIdentification", label: "Hazard Identification Process", type: "textarea", required: true },
    { id: "riskControl", label: "Risk Control Measures", type: "textarea", required: true },
  ],
  "clinical-data": [
    { id: "clinicalStrategy", label: "Clinical Evaluation Strategy", type: "textarea", required: true },
    { id: "literatureReview", label: "Literature Review Summary", type: "textarea", required: true },
    { id: "clinicalOutcomes", label: "Clinical Outcomes", type: "textarea", required: true },
  ],
  labeling: [
    { id: "labelingStandards", label: "Labeling Standards", type: "select", required: true, options: ["21 CFR 801", "21 CFR 820", "ISO 15223"] },
    { id: "intendedUse", label: "Intended Use Statement", type: "textarea", required: true },
    { id: "contraindications", label: "Contraindications", type: "textarea", required: true },
  ],
  "manufacturing-information": [
    { id: "manufacturingSite", label: "Manufacturing Site", type: "text", required: true },
    { id: "qualitySystem", label: "Quality System Standard", type: "select", required: true, options: ["ISO 13485", "21 CFR 820", "ISO 9001"] },
    { id: "manufacturingProcess", label: "Manufacturing Process Description", type: "textarea", required: true },
  ],
  "quality-system": [
    { id: "qmsStandard", label: "QMS Standard", type: "select", required: true, options: ["ISO 13485:2016", "21 CFR Part 820", "ISO 9001:2015"] },
    { id: "designControls", label: "Design Controls", type: "textarea", required: true },
    { id: "riskManagement", label: "Risk Management Process", type: "textarea", required: true },
  ],
  biocompatibility: [
    { id: "biocompatibilityStandard", label: "Biocompatibility Standard", type: "select", required: true, options: ["ISO 10993", "USP Class VI", "FDA Blue Book"] },
    { id: "biologicalEvaluation", label: "Biological Evaluation Plan", type: "textarea", required: true },
    { id: "contactType", label: "Contact Type", type: "select", required: true, options: ["Surface Device", "External Communicating", "Implant"] },
  ],
  "software-documentation": [
    { id: "softwareClass", label: "Software Classification", type: "select", required: true, options: ["Class A", "Class B", "Class C"] },
    { id: "softwareStandard", label: "Software Standard", type: "select", required: true, options: ["IEC 62304", "ISO 14971", "FDA Guidance"] },
    { id: "softwareLifecycle", label: "Software Lifecycle Process", type: "textarea", required: true },
  ],
};

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
      description: "Risk analysis section lacks comprehensive hazard identification",
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
  const [validationResults, setValidationResults] = useState<any>(null);
  const [formQuestions, setFormQuestions] = useState<any[]>([]);
  const [formResponses, setFormResponses] = useState<Record<string, string>>(
    {}
  );
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDocumentGenerated, setIsDocumentGenerated] = useState(false);

  const isFormValid = selectedSubmission && selectedAttachmentType;

  // Simulate API call to fetch form questions
  const fetchFormQuestions = async (attachmentType: string) => {
    setIsLoadingQuestions(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const questions = (mockFormQuestions as any)[attachmentType] || [];
      setFormQuestions(questions);

      // Initialize form responses
      const initialResponses: Record<string, string> = {};
      questions.forEach((question: any) => {
        initialResponses[question.id] = "";
      });
      setFormResponses(initialResponses);
    } catch (error) {
      console.error("Error fetching form questions:", error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleValidate = () => {
    setIsValidateModalOpen(true);
  };

  const handleCreate = async () => {
    setIsCreateModalOpen(true);
    setIsDocumentGenerated(false);
    await fetchFormQuestions(selectedAttachmentType);
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

  const handleModalCreate = async () => {
    setIsGenerating(true);

    try {
      // Simulate document generation API call
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsDocumentGenerated(true);
    } catch (error) {
      console.error("Error generating document:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    // Implement actual download logic here
    console.log("Downloading document...");
    // For now, just close the modal
    setIsCreateModalOpen(false);
    setIsDocumentGenerated(false);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setIsDocumentGenerated(false);
    setIsGenerating(false);
    setFormQuestions([]);
    setFormResponses({});
  };

  const isCreateFormValid = () => {
    return formQuestions.every((question: any) => {
      if (question.required) {
        return (
          formResponses[question.id] && formResponses[question.id].trim() !== ""
        );
      }
      return true;
    });
  };

  const renderFormField = (question: any) => {
    const isDisabled = isDocumentGenerated || isGenerating;
    const fieldClasses = `w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      isDisabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
    }`;

    switch (question.type) {
      case "textarea":
        return (
          <textarea
            className={`${fieldClasses} min-h-[80px]`}
            value={formResponses[question.id] || ""}
            onChange={(e) => handleFormChange(question.id, e.target.value)}
            disabled={isDisabled}
            rows={3}
          />
        );
      case "select":
        return (
          <select
            className={fieldClasses}
            value={formResponses[question.id] || ""}
            onChange={(e) => handleFormChange(question.id, e.target.value)}
            disabled={isDisabled}
          >
            <option value="">Select {question.label.toLowerCase()}</option>
            {question.options?.map((option: any) => (
              <option
                key={option}
                value={option.toLowerCase().replace(/\s+/g, "-")}
              >
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            className={fieldClasses}
            value={formResponses[question.id] || ""}
            onChange={(e) => handleFormChange(question.id, e.target.value)}
            disabled={isDisabled}
          />
        );
    }
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

  // Modal content renderers
  const renderUploadModalContent = () => (
    <>
      <p className="text-gray-600 mb-4 text-sm">
        Please upload the document you want to validate for compliance and
        structure.
      </p>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select File
        </label>

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
              <svg
                className="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-sm mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-gray-400 text-xs">
              PDF, DOC, DOCX, TXT files supported
            </p>
          </label>
        </div>

        {uploadedFile && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <svg
              className="w-5 h-5 text-green-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
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
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Validate Document
        </button>
      </div>
    </>
  );

  const renderValidationResultsContent = () => {
    // Add dummy validation results if none exist
    const results = validationResults || {
      overallScore: 92,
      reviewPoints: [
        {
          id: 1,
          status: "pass",
          title: "Sample Validation Check",
        },
      ],
    };

    return (
      <>
        <div className="text-center mb-6">
          <div
            className={`text-4xl font-bold mb-2 ${getScoreColor(
              results.overallScore
            )}`}
          >
            {results.overallScore}%
          </div>
          <div className="text-lg text-gray-600">Overall Compliance Score</div>
        </div>

        <div className="space-y-3 mb-6">
          {results.reviewPoints.map((point: any) => (
            <div
              key={point.id}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
            >
              {getStatusIcon(point.status)}
              <span className="font-medium">{point.title}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setIsValidationResultsOpen(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </>
    );
  };

  const renderCreateModalContent = () => (
    <>
      {isLoadingQuestions ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading form questions...</span>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {formQuestions.map((question: any) => (
              <div key={question.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderFormField(question)}
              </div>
            ))}
          </div>

          {isGenerating && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Generating document...</span>
                <span>Please wait</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCloseCreateModal}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              disabled={isGenerating}
            >
              Cancel
            </button>

            {!isDocumentGenerated ? (
              <button
                onClick={handleModalCreate}
                disabled={!isCreateFormValid() || isGenerating}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Submit"}
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Document
              </button>
            )}
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="space-y-8 flex flex-col flex-1 p-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Document Prepration Agent
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
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-300 transition-colors"
              >
                Validate
              </button>

              <button
                onClick={handleCreate}
                disabled={!isFormValid}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-300 transition-colors"
              >
                Create
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isValidateModalOpen}
        onClose={() => setIsValidateModalOpen(false)}
        title="Upload Document for Validation"
      >
        {renderUploadModalContent()}
      </Modal>

      <Modal
        isOpen={isValidationResultsOpen && validationResults}
        onClose={() => setIsValidationResultsOpen(false)}
        title="Validation Results"
        maxWidth="max-w-2xl"
      >
        {renderValidationResultsContent()}
      </Modal>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Create New Document"
        maxWidth="max-w-lg"
        showCloseButton={!isGenerating}
      >
        {renderCreateModalContent()}
      </Modal>
    </div>
  );
};

export default RegulatoryDocPrepAgent;
