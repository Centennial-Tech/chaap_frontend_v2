import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { XCircle, Download } from "lucide-react";
import Modal from "../components/ui/Modal";
import api from "../api";
import { useAuth } from "../provider/authProvider";
import { extractText } from "../utils";

const attachmentTypes = [
  {
    id: "device-description",
    label: "Device Description",
  },
  {
    id: "cover-letter",
    label: "Cover Letter",
  },
];

// Simplified mock API response for form questions
const mockFormQuestions = {
  "device-description": [
    { id: "deviceName", label: "Device Name", type: "text", required: true },
    {
      id: "intendedUse",
      label: "Intended Use",
      type: "textarea",
      required: true,
    },
    {
      id: "riskClass",
      label: "Risk Classification",
      type: "select",
      required: true,
      options: ["Class I", "Class II", "Class III"],
    },
  ],
  "predicate-comparison": [
    { id: "deviceName", label: "Device Name", type: "text", required: true },
    {
      id: "predicateDevice",
      label: "Predicate Device",
      type: "text",
      required: true,
    },
    {
      id: "similarities",
      label: "Key Similarities",
      type: "textarea",
      required: true,
    },
  ],
  "performance-testing": [
    {
      id: "testingOverview",
      label: "Testing Overview",
      type: "textarea",
      required: true,
    },
    {
      id: "testStandards",
      label: "Standards Followed",
      type: "text",
      required: true,
    },
    {
      id: "testResults",
      label: "Summary of Test Results",
      type: "textarea",
      required: true,
    },
  ],
  "risk-analysis": [
    {
      id: "riskAnalysisStandard",
      label: "Risk Analysis Standard",
      type: "select",
      required: true,
      options: ["ISO 14971", "IEC 62304", "ISO 13485"],
    },
    {
      id: "hazardIdentification",
      label: "Hazard Identification Process",
      type: "textarea",
      required: true,
    },
    {
      id: "riskControl",
      label: "Risk Control Measures",
      type: "textarea",
      required: true,
    },
  ],
  "clinical-data": [
    {
      id: "clinicalStrategy",
      label: "Clinical Evaluation Strategy",
      type: "textarea",
      required: true,
    },
    {
      id: "literatureReview",
      label: "Literature Review Summary",
      type: "textarea",
      required: true,
    },
    {
      id: "clinicalOutcomes",
      label: "Clinical Outcomes",
      type: "textarea",
      required: true,
    },
  ],
  labeling: [
    {
      id: "labelingStandards",
      label: "Labeling Standards",
      type: "select",
      required: true,
      options: ["21 CFR 801", "21 CFR 820", "ISO 15223"],
    },
    {
      id: "intendedUse",
      label: "Intended Use Statement",
      type: "textarea",
      required: true,
    },
    {
      id: "contraindications",
      label: "Contraindications",
      type: "textarea",
      required: true,
    },
  ],
  "manufacturing-information": [
    {
      id: "manufacturingSite",
      label: "Manufacturing Site",
      type: "text",
      required: true,
    },
    {
      id: "qualitySystem",
      label: "Quality System Standard",
      type: "select",
      required: true,
      options: ["ISO 13485", "21 CFR 820", "ISO 9001"],
    },
    {
      id: "manufacturingProcess",
      label: "Manufacturing Process Description",
      type: "textarea",
      required: true,
    },
  ],
  "quality-system": [
    {
      id: "qmsStandard",
      label: "QMS Standard",
      type: "select",
      required: true,
      options: ["ISO 13485:2016", "21 CFR Part 820", "ISO 9001:2015"],
    },
    {
      id: "designControls",
      label: "Design Controls",
      type: "textarea",
      required: true,
    },
    {
      id: "riskManagement",
      label: "Risk Management Process",
      type: "textarea",
      required: true,
    },
  ],
  biocompatibility: [
    {
      id: "biocompatibilityStandard",
      label: "Biocompatibility Standard",
      type: "select",
      required: true,
      options: ["ISO 10993", "USP Class VI", "FDA Blue Book"],
    },
    {
      id: "biologicalEvaluation",
      label: "Biological Evaluation Plan",
      type: "textarea",
      required: true,
    },
    {
      id: "contactType",
      label: "Contact Type",
      type: "select",
      required: true,
      options: ["Surface Device", "External Communicating", "Implant"],
    },
  ],
  "software-documentation": [
    {
      id: "softwareClass",
      label: "Software Classification",
      type: "select",
      required: true,
      options: ["Class A", "Class B", "Class C"],
    },
    {
      id: "softwareStandard",
      label: "Software Standard",
      type: "select",
      required: true,
      options: ["IEC 62304", "ISO 14971", "FDA Guidance"],
    },
    {
      id: "softwareLifecycle",
      label: "Software Lifecycle Process",
      type: "textarea",
      required: true,
    },
  ],
};

const DocPrepAgent = () => {
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

  // File extraction states
  const [extractedText, setExtractedText] = useState<string>("");
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [extractionError, setExtractionError] = useState<string>("");

  // Validation loading state
  const [isValidating, setIsValidating] = useState(false);

  const isFormValid = selectedSubmission && selectedAttachmentType;

  const [submissions, setSubmissions] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate API call to fetch submissions
    const fetchSubmissions = async () => {
      const response = await api.get(
        `/applications/userId?user_id=${user?.id}`
      );
      const data = response.data;
      setSubmissions(data);
    };

    fetchSubmissions();
  }, [user?.id]);

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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsExtractingText(true);
    setExtractionError("");

    try {
      const extractedText = await extractText(file);
      setExtractedText(extractedText);
      console.log(
        `Text extraction successful: ${extractedText.length} characters`
      );
    } catch (error) {
      console.error("Text extraction failed:", error);
      setExtractionError(
        error instanceof Error
          ? error.message
          : "Failed to extract text from file"
      );
    } finally {
      setIsExtractingText(false);
    }
  };

  const handleModalValidate = async () => {
    if (!uploadedFile || !extractedText) {
      console.error("No file or extracted text available for validation");
      return;
    }

    setIsValidateModalOpen(false);
    setIsValidating(true);

    try {
      // Prepare the payload for the validation API
      console.log("Preparing validation payload...", extractedText);
      const validationPayload = {
        document_content: extractedText,
        document_type: selectedSubmission || "IND",
        attachment_type: selectedAttachmentType, // This can be dynamic based on your requirements
        session_id: "string",
      };

      //       {
      //   "document_content": "The New Drug Application cover letter from {company_name} is being submitted by {contact_info} with {regulatory_contact} designated as the regulatory point of contact, and it is dated {submission_date}. It pertains to the new drug named {drug_name} (generic name: {generic_name}), assigned NDA number {nda_number}. This submission is classified as {application_type} and is supported by {supporting_data}. The entire application has been prepared in full compliance with all FDA requirements for NDA submissions.",
      //   "document_type": "NDA",       // optional
      //   "attachment_type": "cover_letter", // optional
      //   "session_id": "string"        // optional
      // }

      // Call the validation API
      const response = await api.post(
        "/agents/document_prep/validate-document",
        validationPayload
      );

      if (response.data) {
        setValidationResults(response.data);
        setIsValidationResultsOpen(true);
        console.log("Validation completed successfully:", response.data);
      } else {
        throw new Error("No validation results received");
      }
    } catch (error: any) {
      console.error("Document validation error:", error);

      // Fallback to mock results if API fails
      console.log("Falling back to mock validation results");
      setValidationResults({
        overallScore: 85,
        reviewPoints: [
          {
            id: 1,
            status: "warning",
            title: "API validation unavailable - showing mock results",
            details:
              "The validation service is currently unavailable. Please try again later.",
          },
        ],
        summary: "Mock validation results due to API error",
      });
      setIsValidationResultsOpen(true);
    } finally {
      // Clear the file and extracted text after validation
      setUploadedFile(null);
      setExtractedText("");
      setIsValidating(false);
    }
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
          <div className="mt-3 space-y-2">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
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
              <span className="text-sm text-green-700">
                {uploadedFile.name}
              </span>
            </div>

            {isExtractingText && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm text-blue-700">
                  Extracting text from file...
                </span>
              </div>
            )}

            {extractionError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <svg
                  className="w-5 h-5 text-red-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-red-700">{extractionError}</span>
              </div>
            )}

            {extractedText && !isExtractingText && !extractionError && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-1">
                  <svg
                    className="w-4 h-4 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium text-green-700">
                    Text extracted successfully
                  </span>
                </div>
                <span className="text-xs text-green-600">
                  {extractedText.length} characters extracted
                </span>
              </div>
            )}
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
          disabled={
            !uploadedFile ||
            !extractedText ||
            isExtractingText ||
            !!extractionError
          }
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Validate Document
        </button>
      </div>
    </>
  );

  const renderValidationResultsContent = () => {
    // Add dummy validation results if none exist
    // const results = validationResults || {
    //   overallScore: 92,
    //   reviewPoints: [
    //     {
    //       id: 1,
    //       status: "pass",
    //       title: "Sample Validation Check",
    //     },
    //   ],
    // };
    const results = {
      confidence_score: 40,
      detailed_analysis:
        "The submitted NDA cover letter contains placeholder content, which is unacceptable for FDA submissions. Placeholder content significantly detracts from the document's credibility and compliance. The FDA requires specific and accurate information in all sections of the cover letter, including the company name, contact information, regulatory contact details, submission date, drug name, generic name, NDA number, application type, and supporting data. Additionally, the document does not demonstrate adherence to FDA formatting guidelines, which are critical for ensuring clarity and professionalism in regulatory submissions. The presence of placeholder content and lack of specific details result in a low confidence score and non-compliance with FDA requirements.",
      is_compliant: false,
      issues: [
        "Placeholder content ({company_name}, {contact_info}, {regulatory_contact}, {submission_date}, {drug_name}, {generic_name}, {nda_number}, {application_type}, {supporting_data}) is present and unacceptable.",
        "The document lacks specific details required for a compliant NDA cover letter, such as the actual company name, contact information, regulatory contact details, submission date, drug name, generic name, NDA number, application type, and supporting data.",
        "No indication of adherence to formatting guidelines specified by the FDA for NDA cover letters.",
      ],
      recommendations: [
        "Replace all placeholder content with actual, accurate information.",
        "Ensure the cover letter includes all required elements, such as the company name, contact information, regulatory contact details, submission date, drug name, generic name, NDA number, application type, and supporting data.",
        "Verify that the formatting adheres to FDA guidelines, including proper headers, spacing, and alignment.",
      ],
    };

    return (
      <>
        <div className="text-center mb-6">
          <div
            className={`text-4xl font-bold mb-2 ${getScoreColor(
              results.confidence_score || 0
            )}`}
          >
            {results.confidence_score || "-"}%
          </div>
          <div className="text-lg text-gray-600">Overall Compliance Score</div>
          <div className="text-sm text-gray-600">
            <strong>Compliance Status:</strong>{" "}
            {results.is_compliant ? (
              <span className="text-green-600 font-semibold">Compliant</span>
            ) : (
              <span className="text-red-600 font-semibold">Not Compliant</span>
            )}
          </div>
        </div>

        <div className="space-y-3 flex flex-col gap-5">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-500 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-blue-700 mb-1">
                Detailed Analysis
              </div>
              <div className="text-sm text-blue-900 leading-relaxed">
                {results.detailed_analysis}
              </div>
            </div>
          </div>
          {/* Issues and Recommendations Combined Section */}
          {((results.issues && results.issues.length > 0) ||
            (results.recommendations &&
              results.recommendations.length > 0)) && (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-xl">
                    Compliance Review
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {results.issues?.length || 0} issue
                    {(results.issues?.length || 0) !== 1 ? "s" : ""} found •{" "}
                    {results.recommendations?.length || 0} recommendation
                    {(results.recommendations?.length || 0) !== 1
                      ? "s"
                      : ""}{" "}
                    provided
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Issues */}
                {results.issues &&
                  results.issues.length > 0 &&
                  results.issues.map((issue: any, index: number) => (
                    <div
                      key={`issue-${index}`}
                      className="bg-white border-l-4 border-red-400 rounded-lg shadow-sm"
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Issue #{index + 1}
                              </span>
                            </div>
                            <p className="text-gray-800 leading-relaxed mb-3">
                              {issue}
                            </p>

                            {/* Show corresponding recommendation if available */}
                            {results.recommendations &&
                              results.recommendations[index] && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg
                                          className="w-4 h-4 text-blue-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-blue-800">
                                          Recommended Action:
                                        </span>
                                      </div>
                                      <p className="text-blue-900 text-sm leading-relaxed">
                                        {results.recommendations[index]}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Additional Recommendations (if more recommendations than issues) */}
                {results.recommendations &&
                  results.recommendations.length >
                    (results.issues?.length || 0) && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        Additional Recommendations
                      </h4>
                      <div className="space-y-3">
                        {results.recommendations
                          .slice(results.issues?.length || 0)
                          .map((recommendation: any, index: number) => (
                            <div
                              key={`extra-rec-${index}`}
                              className="bg-white border-l-4 border-blue-400 rounded-lg shadow-sm p-4"
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-5 h-5 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      Recommendation #
                                      {(results.issues?.length || 0) +
                                        index +
                                        1}
                                    </span>
                                  </div>
                                  <p className="text-gray-800 leading-relaxed">
                                    {recommendation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Show only recommendations if no issues */}
                {(!results.issues || results.issues.length === 0) &&
                  results.recommendations &&
                  results.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                        Recommendations
                      </h4>
                      <div className="space-y-3">
                        {results.recommendations.map(
                          (recommendation: any, index: number) => (
                            <div
                              key={`rec-only-${index}`}
                              className="bg-white border-l-4 border-blue-400 rounded-lg shadow-sm p-4"
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-5 h-5 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      Recommendation #{index + 1}
                                    </span>
                                  </div>
                                  <p className="text-gray-800 leading-relaxed">
                                    {recommendation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
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
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
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
            Document Preparation Agent
          </h2>
          <p className="text-gray-700 mt-1">
            AI-powered assistance for preparing documentation
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
                  <option value="" disabled selected>
                    Select a recent submission
                  </option>
                  {submissions.map((submission) => (
                    <option
                      key={submission.id}
                      value={submission.submissionType?.toString()}
                    >
                      {submission.name}
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
                  {attachmentTypes.map(({ label, id }) => (
                    <option key={id} value={id}>
                      {label}
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

      {/* Validation Loading Modal */}
      <Modal
        isOpen={isValidating}
        onClose={() => {}} // Prevent closing during validation
        title="Validating Document"
        showCloseButton={false}
        maxWidth="max-w-md"
      >
        <div className="flex flex-col items-center justify-center py-8 px-4">
          {/* Animated validation icon */}
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full">
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Loading text */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Analyzing Your Document
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <p className="text-gray-600 text-sm">
                Our AI is reviewing your document for compliance and structure.
                This may take a few moments.
              </p>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="mt-6 w-full space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Processing document content...</span>
                <span>⚡</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full animate-pulse"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isValidationResultsOpen && validationResults}
        onClose={() => setIsValidationResultsOpen(false)}
        title="Validation Results"
        maxWidth="max-w-4xl"
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

export default DocPrepAgent;
