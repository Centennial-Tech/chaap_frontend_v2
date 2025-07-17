import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { XCircle, Download } from "lucide-react";
import Modal from "../../components/ui/Modal";
import api from "../../api";
import { extractText } from "../../utils";
import jsPDF from "jspdf";
import AnimatedBackground from "../../components/AnimatedBackground";
import { useOverlay } from "../../provider/overleyProvider";
import { useSubmission } from "../../provider/submissionProvider";

const attachmentTypes = [
  { id: "device-description", label: "Device Description" },
  { id: "cover-letter", label: "Cover Letter" },
  {
    id: "advisory-committee-briefing-docs",
    label: "Advisory Committee Briefing Docs",
  },
  {
    id: "analytical-validation-reports",
    label: "Analytical Validation Reports",
  },
  { id: "annual-reports", label: "Annual Reports" },
  { id: "audit-reports", label: "Audit Reports" },
  { id: "biocompatibility", label: "Biocompatibility" },
  {
    id: "cmc-chemistry-manufacturing-and-controls",
    label: "CMC (Chemistry, Manufacturing and Controls)",
  },
  {
    id: "clinicaltrials-gov-certification",
    label: "ClinicalTrials.gov Certification",
  },
  { id: "clinical-protocols", label: "Clinical Protocols" },
  { id: "clinical-study-reports", label: "Clinical Study Reports" },
  { id: "cybersecurity-assessment", label: "Cybersecurity Assessment" },
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
  const { submissions, activeSubmission, setActiveSubmission } =
    useSubmission();
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

  // Create workflow loading state
  const [isStartingWorkflow, setIsStartingWorkflow] = useState(false);
  const [workflowStage, setWorkflowStage] = useState<
    "starting" | "processing_responses"
  >("starting");

  // Workflow status flow state
  const [showWorkflowStatus, setShowWorkflowStatus] = useState(false);
  const [workflowResponse, setWorkflowResponse] = useState<any>(null);
  const [workflowStatus, setWorkflowStatus] = useState<any>(null);
  const [additionalQuestions, setAdditionalQuestions] = useState<string[]>([]);
  const [questionResponses, setQuestionResponses] = useState<
    Record<string, string>
  >({});
  const [showFullDocument, setShowFullDocument] = useState(false);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);

  const isFormValid = activeSubmission && selectedAttachmentType;

  const [currentSessionId, setCurrentSessionId] = useState<string>("");

  const { showOverlay, hideOverlay } = useOverlay();

  useEffect(() => {
    if (
      isValidateModalOpen ||
      isValidating ||
      isCreateModalOpen ||
      isStartingWorkflow ||
      showWorkflowStatus ||
      isValidationResultsOpen
    ) {
      showOverlay();
    } else {
      hideOverlay();
    }
  }, [
    isValidateModalOpen,
    isValidating,
    isCreateModalOpen,
    isStartingWorkflow,
    showWorkflowStatus,
    isValidationResultsOpen,
    showOverlay,
    hideOverlay,
  ]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDownloadDropdown) {
        const dropdown = document.querySelector(".download-dropdown");
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setShowDownloadDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDownloadDropdown]);

  // Debug effect to monitor validation results changes
  useEffect(() => {
    console.log("Validation results changed:", validationResults);
    console.log("isValidationResultsOpen:", isValidationResultsOpen);
  }, [validationResults, isValidationResultsOpen]);

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
    setWorkflowStage("starting");
    setIsStartingWorkflow(true);

    try {
      // Generate a UUID for the session
      const sessionId = crypto.randomUUID();
      setCurrentSessionId(sessionId);

      const response = await api.post("/agents/document_prep/start-workflow", {
        fda_document_type: activeSubmission?.submission_type || "IND",
        attachment_type: selectedAttachmentType,
        session_id: sessionId,
      });

      console.log("Workflow API response:", response.data);

      // Check if the response indicates success
      if (response.data.success === false) {
        // Handle error response from API
        console.error("API returned error:", response.data.error);
        setWorkflowResponse(response.data);
        setIsStartingWorkflow(false);
        setShowWorkflowStatus(true);
      } else {
        // Store the successful response
        setWorkflowResponse(response.data);

        // Start polling for workflow status
        await pollWorkflowStatus(sessionId);
      }
    } catch (error) {
      console.error("Error starting workflow:", error);
      setIsStartingWorkflow(false);

      // Handle network or other errors
      const errorResponse = {
        success: false,
        error: "Failed to connect to the server. Please try again.",
        session_id: null,
      };
      setWorkflowResponse(errorResponse);
      setShowWorkflowStatus(true);
      setWorkflowStage("starting");
    }
  };

  const pollWorkflowStatus = async (sessionId: string) => {
    try {
      const statusResponse = await api.get(
        `/agents/document_prep/workflow-status/${sessionId}`
      );

      console.log("Current workflow status:", statusResponse.data);
      setWorkflowStatus(statusResponse.data);

      if (statusResponse.data.status === "processing") {
        // Still processing, continue polling after a delay
        setTimeout(() => pollWorkflowStatus(sessionId), 3000); // Poll every 3 seconds
      } else if (statusResponse.data.status === "awaiting_user_input") {
        // Ready for user input
        setAdditionalQuestions(statusResponse.data.additional_questions || []);

        // Initialize question responses
        const initialResponses: Record<string, string> = {};
        (statusResponse.data.additional_questions || []).forEach(
          (question: string) => {
            initialResponses[question] = "";
          }
        );
        setQuestionResponses(initialResponses);

        setIsStartingWorkflow(false);
        setIsCreateModalOpen(true);
      } else if (statusResponse.data.status === "completed") {
        // Workflow completed - show document ready for download
        setWorkflowStatus(statusResponse.data);
        setIsStartingWorkflow(false);
        setShowWorkflowStatus(true);
      } else if (statusResponse.data.status === "error") {
        // Error occurred
        const errorResponse = {
          success: false,
          error: statusResponse.data.error || "Workflow encountered an error",
          session_id: sessionId,
        };
        setWorkflowResponse(errorResponse);
        setIsStartingWorkflow(false);
        setShowWorkflowStatus(true);
      }
    } catch (error) {
      console.error("Error polling workflow status:", error);
      setIsStartingWorkflow(false);

      const errorResponse = {
        success: false,
        error: "Failed to check workflow status. Please try again.",
        session_id: sessionId,
      };
      setWorkflowResponse(errorResponse);
      setShowWorkflowStatus(true);
    }
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
    console.log("Starting validation process...");
    console.log(
      "Current state - isValidationResultsOpen:",
      isValidationResultsOpen
    );
    console.log("Current state - validationResults:", validationResults);

    if (!uploadedFile || !extractedText) {
      console.error("No file or extracted text available for validation");
      return;
    }

    setIsValidateModalOpen(false);
    setIsValidating(true);

    // Clear any previous results
    setValidationResults(null);
    console.log("Cleared previous validation results");

    try {
      // Prepare the payload for the validation API
      console.log("Preparing validation payload...", extractedText);
      const validationPayload = {
        document_content: extractedText,
        document_type: (activeSubmission as any).submissionType || "IND",
        attachment_type: selectedAttachmentType, // This can be dynamic based on your requirements
        session_id: "string",
      };

      // Call the validation API
      const response = await api.post(
        "/agents/document_prep/validate-document",
        validationPayload
      );

      console.log("Validation API response:", response.data);

      if (response.data) {
        // Check if validation_results exists, otherwise use the entire response
        const results = response.data.validation_result || response.data;
        console.log("Setting validation results:", results);
        setValidationResults(results);
        setIsValidationResultsOpen(true);
        console.log(
          "Validation completed successfully. Modal should open now."
        );
      } else {
        throw new Error("No validation results received");
      }
    } catch (error: any) {
      console.error("Document validation error:", error);

      // Fallback to mock results if API fails
      console.log("Falling back to mock validation results");
      const mockResults = {
        overallScore: 85,
        confidence_score: 85,
        is_compliant: true,
        reviewPoints: [
          {
            id: 1,
            status: "warning",
            title: "API validation unavailable - showing mock results",
            details:
              "The validation service is currently unavailable. Please try again later.",
          },
        ],
        issues: ["API validation service is currently unavailable"],
        recommendations: [
          "Please try again later when the validation service is restored",
          "Check your internet connection and ensure the API endpoint is accessible",
        ],
        summary: "Mock validation results due to API error",
      };

      console.log("Setting mock validation results:", mockResults);
      setValidationResults(mockResults);
      setIsValidationResultsOpen(true);
      console.log("Mock validation results set. Modal should open now.");
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

  const handleQuestionResponse = (question: string, value: string) => {
    setQuestionResponses((prev) => ({ ...prev, [question]: value }));
  };

  const handleContinueToForm = async () => {
    setShowWorkflowStatus(false);
    setIsCreateModalOpen(true);
    setIsDocumentGenerated(false);
    await fetchFormQuestions(selectedAttachmentType);
  };

  const handleModalCreate = async () => {
    setIsGenerating(true);

    try {
      // If we have additional questions, submit user responses
      if (additionalQuestions.length > 0 && currentSessionId) {
        const response = await api.post(
          `/agents/document_prep/submit-additional-info`,
          {
            session_id: currentSessionId,
            user_responses: questionResponses,
          }
        );

        console.log("User input submitted:", response.data);

        // Close the create modal and show processing status
        setIsCreateModalOpen(false);
        setWorkflowStage("processing_responses");
        setIsStartingWorkflow(true);
        setIsGenerating(false); // Reset generating state since modal is closing

        // Continue polling for workflow status after submitting responses
        await pollWorkflowStatus(currentSessionId);
      } else {
        // Fallback to old behavior for mock form questions
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setIsDocumentGenerated(true);
        setIsGenerating(false);
      }
    } catch (error) {
      console.error("Error generating document:", error);
      setIsGenerating(false);
    }
  };

  const handleDownload = async (format: "pdf" | "doc" | "txt" = "pdf") => {
    try {
      // If we have the final document content from completed workflow
      if (workflowStatus?.final_document) {
        downloadFile(
          activeSubmission?.name || "Document",
          workflowStatus.final_document,
          format
        );
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document. Please try again.");
    }
  };

  const downloadFile = (
    filename: string,
    content: string,
    type: "txt" | "pdf" | "doc"
  ) => {
    if (type === "pdf") {
      console.log("Generating PDF for download...", content);
      generateStyledPDF(content, filename);
      return;
    }

    let blob: Blob;

    if (type === "doc") {
      const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${filename}</title></head>
      <body><pre>${content}</pre></body></html>
    `;
      blob = new Blob([docContent], { type: "application/msword" });
    } else {
      blob = new Blob([content], { type: "text/plain" });
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generateStyledPDF = (content: string, filename: string) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // PDF styling constants
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 6;
    const maxLineWidth = pageWidth - margin * 2;

    let yPosition = margin;

    // Add header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text(filename, margin, yPosition);
    yPosition += 15;

    // Add a line separator
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Helper function to clean markdown from text
    const cleanMarkdown = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
        .replace(/\*(.*?)\*/g, '$1')     // Remove italic markers  
        .replace(/`(.*?)`/g, '$1');      // Remove code markers
    };

    // Helper function to render text with inline formatting
    const renderFormattedText = (text: string, x: number, y: number, fontSize: number = 12, color: [number, number, number] = [60, 60, 60]) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      
      // Handle mixed formatting in the same line
      let currentX = x;
      
      // Split by markdown patterns while preserving the delimiters and content
      const markdownRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
      const segments = text.split(markdownRegex);
      
      for (const segment of segments) {
        if (!segment) continue;
        
        if (segment.startsWith("**") && segment.endsWith("**")) {
          // Bold text
          const boldText = segment.slice(2, -2);
          doc.setFont("helvetica", "bold");
          const textWidth = doc.getTextWidth(boldText);
          doc.text(boldText, currentX, y);
          currentX += textWidth;
          doc.setFont("helvetica", "normal");
        } else if (segment.startsWith("*") && segment.endsWith("*") && !segment.startsWith("**")) {
          // Italic text
          const italicText = segment.slice(1, -1);
          doc.setFont("helvetica", "italic");
          const textWidth = doc.getTextWidth(italicText);
          doc.text(italicText, currentX, y);
          currentX += textWidth;
          doc.setFont("helvetica", "normal");
        } else if (segment.startsWith("`") && segment.endsWith("`")) {
          // Inline code
          const codeText = segment.slice(1, -1);
          doc.setFont("courier", "normal");
          doc.setTextColor(100, 100, 100);
          const textWidth = doc.getTextWidth(codeText);
          doc.text(codeText, currentX, y);
          currentX += textWidth;
          doc.setFont("helvetica", "normal");
          doc.setTextColor(color[0], color[1], color[2]);
        } else {
          // Regular text
          doc.setFont("helvetica", "normal");
          const textWidth = doc.getTextWidth(segment);
          doc.text(segment, currentX, y);
          currentX += textWidth;
        }
      }
      
      return currentX - x; // Return the total width used
    };

    // Helper function to render multi-line formatted text
    const renderMultiLineFormattedText = (text: string, x: number, startY: number, fontSize: number = 12, color: [number, number, number] = [60, 60, 60]) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFont("helvetica", "normal");
      
      let currentY = startY;
      const words = text.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        // Test with cleaned text to check actual width
        const cleanTestLine = cleanMarkdown(testLine);
        const testWidth = doc.getTextWidth(cleanTestLine);
        
        if (testWidth <= maxLineWidth) {
          currentLine = testLine;
        } else {
          // Render current line if it has content
          if (currentLine) {
            renderFormattedText(currentLine, x, currentY, fontSize, color);
            currentY += lineHeight;
          }
          currentLine = word;
        }
      }
      
      // Render remaining text
      if (currentLine) {
        renderFormattedText(currentLine, x, currentY, fontSize, color);
        currentY += lineHeight;
      }
      
      return currentY; // Return the final Y position
    };

    // Parse markdown-like content
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if we need a new page
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      if (!line) {
        yPosition += lineHeight / 2; // Small space for empty lines
        continue;
      }

      // Handle headers
      if (line.startsWith("# ")) {
        const headerText = line.substring(2);
        doc.setFontSize(18);
        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "bold");
        const wrappedHeader = doc.splitTextToSize(headerText, maxLineWidth);
        doc.text(wrappedHeader, margin, yPosition);
        yPosition += wrappedHeader.length * lineHeight + 5;
      } else if (line.startsWith("## ")) {
        const headerText = line.substring(3);
        doc.setFontSize(16);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "bold");
        const wrappedHeader = doc.splitTextToSize(headerText, maxLineWidth);
        doc.text(wrappedHeader, margin, yPosition);
        yPosition += wrappedHeader.length * lineHeight + 4;
      } else if (line.startsWith("### ")) {
        const headerText = line.substring(4);
        doc.setFontSize(14);
        doc.setTextColor(70, 70, 70);
        doc.setFont("helvetica", "bold");
        const wrappedHeader = doc.splitTextToSize(headerText, maxLineWidth);
        doc.text(wrappedHeader, margin, yPosition);
        yPosition += wrappedHeader.length * lineHeight + 3;
      }
      // Handle bullet points
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        const bulletText = line.substring(2);
        doc.setFontSize(12);
        doc.setTextColor(80, 80, 80);
        doc.setFont("helvetica", "normal");
        
        // Add bullet point
        doc.text("• ", margin + 5, yPosition);
        
        // Check if the bullet text contains formatting
        if (bulletText.includes("**") || bulletText.includes("*") || bulletText.includes("`")) {
          // Use multi-line formatted text rendering
          const finalY = renderMultiLineFormattedText(bulletText, margin + 10, yPosition, 12, [80, 80, 80]);
          yPosition = finalY + 2;
        } else {
          // Simple text wrapping for plain text
          const wrappedBullet = doc.splitTextToSize(bulletText, maxLineWidth - 10);
          doc.text(wrappedBullet, margin + 10, yPosition);
          yPosition += wrappedBullet.length * lineHeight + 2;
        }
      }
      // Handle numbered lists
      else if (line.match(/^\d+\. /)) {
        const match = line.match(/^(\d+\. )(.*)/);
        if (match) {
          const listNumber = match[1];
          const listText = match[2];
          
          doc.setFontSize(12);
          doc.setTextColor(80, 80, 80);
          doc.setFont("helvetica", "normal");
          
          // Add list number
          doc.text(listNumber, margin + 5, yPosition);
          const numberWidth = doc.getTextWidth(listNumber);
          
          // Check if the list text contains formatting
          if (listText.includes("**") || listText.includes("*") || listText.includes("`")) {
            // Use multi-line formatted text rendering
            const finalY = renderMultiLineFormattedText(listText, margin + 5 + numberWidth, yPosition, 12, [80, 80, 80]);
            yPosition = finalY + 2;
          } else {
            // Simple text wrapping for plain text
            const wrappedText = doc.splitTextToSize(listText, maxLineWidth - 5 - numberWidth);
            doc.text(wrappedText, margin + 5 + numberWidth, yPosition);
            yPosition += wrappedText.length * lineHeight + 2;
          }
        }
      }
      // Handle code blocks
      else if (line.startsWith("```")) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont("courier", "normal");

        // Find the end of code block
        let codeContent = "";
        let j = i + 1;
        while (j < lines.length && !lines[j].startsWith("```")) {
          codeContent += lines[j] + "\n";
          j++;
        }

        // Draw code block background
        const codeHeight = (codeContent.split("\n").length - 1) * lineHeight + 8;
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPosition - 3, maxLineWidth, codeHeight, "F");

        const wrappedCode = doc.splitTextToSize(codeContent.trim(), maxLineWidth - 10);
        doc.text(wrappedCode, margin + 5, yPosition + 2);
        yPosition += wrappedCode.length * lineHeight + 10;

        i = j; // Skip processed lines
      }
      // Regular text with potential formatting
      else {
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "normal");
        
        // Check if line contains formatting
        if (line.includes("**") || line.includes("*") || line.includes("`")) {
          // Use multi-line formatted text rendering
          const finalY = renderMultiLineFormattedText(line, margin, yPosition, 12, [60, 60, 60]);
          yPosition = finalY + 3;
        } else {
          // Plain text without formatting
          const wrappedText = doc.splitTextToSize(line, maxLineWidth);
          doc.text(wrappedText, margin, yPosition);
          yPosition += wrappedText.length * lineHeight + 3;
        }
      }
    }

    // Add footer with page numbers
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - margin - 20,
        pageHeight - 10
      );

      // Add timestamp
      const timestamp = new Date().toLocaleDateString();
      doc.text(`Generated on ${timestamp}`, margin, pageHeight - 10);
    }

    doc.save(`${filename}.pdf`);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setIsDocumentGenerated(false);
    setIsGenerating(false);
    setFormQuestions([]);
    setFormResponses({});
  };

  const isCreateFormValid = () => {
    // If we have additional questions from the workflow
    if (additionalQuestions.length > 0) {
      return additionalQuestions.every((question: string) => {
        return (
          questionResponses[question] &&
          questionResponses[question].trim() !== ""
        );
      });
    }

    // Fallback to old form validation for mock questions
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
        <Button onClick={() => setIsValidateModalOpen(false)} variant="outline">
          Cancel
        </Button>
        <Button
          onClick={handleModalValidate}
          disabled={
            !uploadedFile ||
            !extractedText ||
            isExtractingText ||
            !!extractionError
          }
        >
          Validate Document
        </Button>
      </div>
    </>
  );

  const renderValidationResultsContent = () => {
    // Safeguard: if no validation results, show a loading or error state
    if (!validationResults) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading validation results...</p>
          </div>
        </div>
      );
    }

    const results = validationResults;

    return (
      <>
        <div className="text-center mb-6">
          <div
            className={`text-4xl font-bold mb-2 ${getScoreColor(
              Math.min(results.confidence_score, 95)
            )}`}
          >
            {Math.min(results.confidence_score, 95)}%
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
          <Button onClick={() => setIsValidationResultsOpen(false)}>
            Close
          </Button>
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
            {/* Render workflow additional questions */}
            {additionalQuestions.length > 0 ? (
              <>
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    Additional Information Required
                  </h4>
                  <p className="text-sm text-blue-700">
                    Please provide the following information to complete your
                    document:
                  </p>
                </div>
                {additionalQuestions.map((question: string, index: number) => (
                  <div key={`question-${index}`}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {question}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      className={`w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] ${
                        isDocumentGenerated || isGenerating
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : ""
                      }`}
                      value={questionResponses[question] || ""}
                      onChange={(e) =>
                        handleQuestionResponse(question, e.target.value)
                      }
                      disabled={isDocumentGenerated || isGenerating}
                      placeholder="Please provide your answer here..."
                      rows={3}
                    />
                  </div>
                ))}
              </>
            ) : (
              /* Render mock form questions (fallback) */
              formQuestions.map((question: any) => (
                <div key={question.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {question.label}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {renderFormField(question)}
                </div>
              ))
            )}
          </div>

          {isGenerating && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>
                  {additionalQuestions.length > 0
                    ? "Processing your responses..."
                    : "Generating document..."}
                </span>
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
            <Button
              onClick={handleCloseCreateModal}
              variant="outline"
              disabled={isGenerating}
            >
              Cancel
            </Button>

            {!isDocumentGenerated ? (
              <Button
                onClick={handleModalCreate}
                disabled={!isCreateFormValid() || isGenerating}
              >
                {isGenerating ? "Processing..." : "Submit"}
              </Button>
            ) : (
              <div className="relative">
                <div className="flex">
                  <Button
                    onClick={() => handleDownload("pdf")}
                    className="bg-green-600 hover:bg-green-700 rounded-r-none"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={() =>
                      setShowDownloadDropdown(!showDownloadDropdown)
                    }
                    className="bg-green-600 hover:bg-green-700 px-2 rounded-l-none border-l border-green-500"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Button>
                </div>

                {showDownloadDropdown && (
                  <div className="download-dropdown absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleDownload("pdf");
                          setShowDownloadDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Download as PDF (Formatted)
                      </button>
                      <button
                        onClick={() => {
                          handleDownload("doc");
                          setShowDownloadDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Download as Word Document
                      </button>
                      <button
                        onClick={() => {
                          handleDownload("txt");
                          setShowDownloadDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Download as Text File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );

  const renderWorkflowStatusContent = () => (
    <>
      <div className="flex flex-col items-center justify-center py-8 px-4">
        {/* Status icon - success or error */}
        <div className="relative mb-6">
          {workflowResponse?.success !== false &&
          workflowStatus?.status === "completed" ? (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
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
          ) : workflowResponse?.success ? (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-600"
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
          ) : (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-600"
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
            </div>
          )}
        </div>

        {/* Status message */}
        <div className="text-center space-y-3 mb-8">
          {workflowStatus?.status === "completed" ? (
            <>
              <h3 className="text-xl font-semibold text-gray-900">
                Document Ready for Download!
              </h3>
              <p className="text-gray-600 text-sm">
                Your document has been successfully generated and is ready to
                download.
              </p>
            </>
          ) : workflowResponse?.success ? (
            <>
              <h3 className="text-xl font-semibold text-gray-900">
                Workflow Started Successfully!
              </h3>
              <p className="text-gray-600 text-sm">
                Your document creation workflow has been initialized and is
                ready to proceed.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-900">
                Workflow Start Failed
              </h3>
              <p className="text-gray-600 text-sm">
                There was an issue starting your document creation workflow.
              </p>
            </>
          )}
        </div>

        {/* Status details */}
        {workflowResponse && (
          <div className="w-full space-y-4 mb-8">
            <div
              className={`border rounded-lg p-4 ${
                workflowResponse.success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      workflowResponse?.success !== false
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    Status:
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      workflowStatus?.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : workflowResponse?.success !== false
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {workflowStatus?.status === "completed"
                      ? "Completed"
                      : workflowResponse?.success !== false
                      ? "Active"
                      : "Failed"}
                  </span>
                </div>

                {(workflowResponse?.session_id || currentSessionId) && (
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        workflowResponse?.success !== false
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      Session ID:
                    </span>
                    <span
                      className={`text-sm font-mono px-2 py-1 rounded ${
                        workflowResponse?.success !== false
                          ? "text-green-700 bg-green-100"
                          : "text-red-700 bg-red-100"
                      }`}
                    >
                      {workflowResponse?.session_id || currentSessionId}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <span
                    className={`text-sm font-medium ${
                      workflowResponse?.success !== false
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {workflowStatus?.status === "completed"
                      ? "Document:"
                      : workflowResponse?.success !== false
                      ? "Message:"
                      : "Error:"}
                  </span>
                  <span
                    className={`text-sm text-right max-w-xs ${
                      workflowResponse?.success !== false
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {workflowStatus?.status === "completed"
                      ? "Document generation completed successfully"
                      : workflowResponse?.message || workflowResponse?.error}
                  </span>
                </div>
              </div>
            </div>

            {/* Document preview - show for completed workflows */}
            {workflowStatus?.status === "completed" &&
              workflowStatus?.final_document && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-green-600"
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
                      Document Preview
                    </div>
                    <span className="text-xs text-gray-500 font-normal">
                      {Math.round(workflowStatus.final_document.length / 1000)}K
                      chars
                    </span>
                  </h4>
                  <div className="bg-white border border-gray-300 rounded p-4 max-h-60 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-xs text-gray-800 font-mono leading-relaxed">
                      {showFullDocument
                        ? workflowStatus.final_document
                        : workflowStatus.final_document.substring(0, 1000) +
                          (workflowStatus.final_document.length > 1000
                            ? "..."
                            : "")}
                    </pre>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    {workflowStatus.final_document.length > 1000 && (
                      <p className="text-xs text-gray-500">
                        {showFullDocument
                          ? `Showing full document (${workflowStatus.final_document.length} characters)`
                          : "Showing first 1000 characters"}
                      </p>
                    )}
                    {workflowStatus.final_document.length > 1000 && (
                      <button
                        onClick={() => setShowFullDocument(!showFullDocument)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        {showFullDocument ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            {workflowResponse?.success !== false && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  {workflowStatus?.status === "completed"
                    ? "Workflow Progress:"
                    : "Next Steps:"}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
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
                    <span className="text-sm text-gray-700">
                      Workflow initialized
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        workflowStatus?.status === "completed"
                          ? "bg-green-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {workflowStatus?.status === "completed" ? (
                        <svg
                          className="w-4 h-4 text-green-600"
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
                      ) : (
                        <span className="text-xs font-medium text-blue-600">
                          2
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        workflowStatus?.status === "completed"
                          ? "text-gray-700"
                          : "text-gray-700"
                      }`}
                    >
                      Complete document information form
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        workflowStatus?.status === "completed"
                          ? "bg-green-100"
                          : "bg-gray-200"
                      }`}
                    >
                      {workflowStatus?.status === "completed" ? (
                        <svg
                          className="w-4 h-4 text-green-600"
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
                      ) : (
                        <span className="text-xs font-medium text-gray-500">
                          3
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        workflowStatus?.status === "completed"
                          ? "text-gray-700"
                          : "text-gray-500"
                      }`}
                    >
                      Generate document
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        workflowStatus?.status === "completed"
                          ? "bg-blue-100"
                          : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`text-xs font-medium ${
                          workflowStatus?.status === "completed"
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        4
                      </span>
                    </div>
                    <span
                      className={`text-sm ${
                        workflowStatus?.status === "completed"
                          ? "text-blue-700 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      Download completed document
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error guidance - only show for failed workflows */}
            {!workflowResponse.success && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  What to do next:
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  {workflowResponse.error === "Session already exists" ? (
                    <>
                      <p>
                        • A workflow session is already running for this
                        configuration.
                      </p>
                      <p>• You can wait a few minutes and try again, or</p>
                      <p>• Contact support if you believe this is an error.</p>
                    </>
                  ) : (
                    <>
                      <p>• Check your internet connection and try again.</p>
                      <p>
                        • Ensure you have selected both a submission and
                        attachment type.
                      </p>
                      <p>• If the problem persists, please contact support.</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-center items-end space-x-4 w-full">
          <Button
            onClick={() => {
              setShowWorkflowStatus(false);
              // Reset workflow state if completed
              if (workflowStatus?.status === "completed") {
                setWorkflowStatus(null);
                setWorkflowResponse(null);
                setCurrentSessionId("");
                setAdditionalQuestions([]);
                setQuestionResponses({});
                setShowFullDocument(false);
                setWorkflowStage("starting");
              }
            }}
            variant="outline"
          >
            Close
          </Button>
          {workflowStatus?.status === "completed" && (
            <div className="flex flex-col space-y-3">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Download Your Document:
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => handleDownload("pdf")}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                  size="sm"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  PDF (Formatted with Styling)
                </Button>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleDownload("doc")}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Word Doc
                  </Button>
                  <Button
                    onClick={() => handleDownload("txt")}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Text File
                  </Button>
                </div>
              </div>
            </div>
          )}
          {workflowResponse?.success &&
            workflowStatus?.status !== "completed" && (
              <Button onClick={handleContinueToForm}>
                Continue to Form
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            )}
          {!workflowResponse?.success && (
            <Button
              onClick={() => {
                setShowWorkflowStatus(false);
                // Reset any form state if needed
              }}
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
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
                    onChange={(e) => {
                      const submissionId = e.target.value;
                      const submission = submissions.find(
                        (s) => s.id === submissionId
                      );
                      if (submission) {
                        setActiveSubmission(submission);
                      }
                    }}
                  >
                    <option value="" disabled selected>
                      Select a recent submission
                    </option>
                    {submissions.map((submission) => (
                      <option
                        key={submission.id}
                        value={submission.id}
                        selected={submission.id === activeSubmission?.id}
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
                <Button
                  onClick={handleValidate}
                  disabled={!isFormValid || isStartingWorkflow}
                  size="lg"
                >
                  Validate
                </Button>

                <Button
                  onClick={handleCreate}
                  disabled={!isFormValid || isStartingWorkflow}
                  size="lg"
                >
                  {isStartingWorkflow ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Starting...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
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
                  Our AI is reviewing your document for compliance and
                  structure. This may take a few moments.
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

        {/* Create Workflow Loading Modal */}
        <Modal
          isOpen={isStartingWorkflow}
          onClose={() => {}} // Prevent closing during workflow creation
          title={
            workflowStage === "processing_responses"
              ? "Processing Document Generation"
              : "Preparing Document Creation"
          }
          showCloseButton={false}
          maxWidth="max-w-md"
        >
          <div className="flex flex-col items-center justify-center py-8 px-4">
            {/* Animated creation icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-green-200 rounded-full">
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-600 rounded-full animate-spin"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>

            {/* Loading text */}
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {workflowStage === "processing_responses"
                  ? "Processing Your Responses"
                  : "Setting Up Document Creation"}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <p className="text-gray-600 text-sm">
                  {workflowStage === "processing_responses"
                    ? "Your responses have been submitted and the document is being generated. This may take a few moments."
                    : "Initializing the document creation workflow and preparing form questions. This will only take a moment."}
                </p>
              </div>
            </div>

            {/* Progress indicators */}
            <div className="mt-6 w-full space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    {workflowStage === "processing_responses"
                      ? "Generating document..."
                      : "Starting workflow..."}
                  </span>
                  <span>
                    {workflowStage === "processing_responses" ? "📄" : "🚀"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full animate-pulse"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        {/* Workflow Status Modal */}
        <Modal
          isOpen={showWorkflowStatus}
          onClose={() => setShowWorkflowStatus(false)}
          title="Workflow Status"
          maxWidth="max-w-4xl"
        >
          {renderWorkflowStatusContent()}
        </Modal>

        <Modal
          isOpen={isValidationResultsOpen}
          onClose={() => setIsValidationResultsOpen(false)}
          title="Validation Results"
          maxWidth="max-w-4xl"
        >
          {validationResults && renderValidationResultsContent()}
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
    </div>
  );
};

export default DocPrepAgent;
