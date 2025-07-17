import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import {
  Plus,
  Activity,
  Calendar,
  FileText,
  Info,
  Lightbulb,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Wand2,
  HelpCircle,
  ChevronDown,
  CalendarDays,
  Loader2,
  Download,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import api from "../../api";
import { productTypes } from "../../constants";
import { useSubmission } from "../../provider/submissionProvider";
import jsPDF from "jspdf";
import remarkGfm from "remark-gfm";
import supersub from "remark-supersub";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../../provider/authProvider";
const FdaMeetingPrepAgent = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<"main" | "product-info">("main");
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [formData, setFormData] = useState({
    productType: "",
    developmentStage: "",
    productName: "",
    regulatoryObjective: "",
  });
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetings, setMeetings] = useState<any[]>([]);
  const [editingSubmissionId, setEditingSubmissionId] = useState<string | null>(
    null
  );
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [openHelpId, setOpenHelpId] = useState<string | null>(null);
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [isPolling, setIsPolling] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState<any>(null);
  const [additionalQuestions, setAdditionalQuestions] = useState<string[]>([]);
  const [questionResponses, setQuestionResponses] = useState<
    Record<string, string>
  >({});
  const [showQuestions, setShowQuestions] = useState(false);
  const [isSubmittingResponses, setIsSubmittingResponses] = useState(false);
  const [finalDocument, setFinalDocument] = useState<string>("");
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [wizardData, setWizardData] = useState({
    productName: "",
    companyName: "",
    indication: "",
    primaryObjective: "",
    specificQuestions: "",
    preferredMeetingDate: "",
    questions: {}, // Object to be populated by AI later
  });

  const resetForm = () => {
    setFormData({
      productType: activeSubmission?.product_type || "",
      developmentStage: "",
      productName: activeSubmission?.name || "",
      regulatoryObjective: "",
    });
    setAiRecommendation(null);
    setMeetingDate("");
    setShowRecommendation(false);
    setIsLoadingRecommendation(false);
    setIsLoadingDocuments(false);
    setEditingSubmissionId(null);
    setSessionId(null);
    setOpenHelpId(null);
    setShowWizardModal(false);
    setWizardStep(1);
    setIsPolling(false);
    setWorkflowStatus(null);
    setAdditionalQuestions([]);
    setQuestionResponses({});
    setShowQuestions(false);
    setIsSubmittingResponses(false);
    setFinalDocument("");
    setShowDocumentPreview(false);
    setWizardData({
      productName: "",
      companyName: "",
      indication: "",
      primaryObjective: "",
      specificQuestions: "",
      preferredMeetingDate: "",
      questions: {},
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getMeetings = async () => {
    try {
      const response = await api.get("/agents/meeting_prep/meetings", {
        params: { user_id: user?.id },
      });
      console.log("Meetings response:", response?.data?.data);
      setMeetings(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const getRecommendation = async () => {
    const response = await api.post("/agents/meeting_prep/get-meeting-type", {
      ProductType: formData.productType,
      DevelopmentStage: formData.developmentStage,
      ProductName: formData.productName,
      RegulatoryObjective: formData.regulatoryObjective,
    });

    return response?.data?.meeting_type?.messages[0] || {};
  };

  const predictMeetings = async () => {
    const response: any = await api.post(
      "/agents/meeting_prep/predict_meetings",
      {
        ProductType: formData.productType,
        DevelopmentStage: formData.developmentStage,
        ProductName: formData.productName,
        RegulatoryObjective: formData.regulatoryObjective,
      }
    );

    return response?.data?.doclist.messages[0]?.recommendedDocuments || {};
  };

  // Poll workflow status
  const pollWorkflowStatus = async (sessionId: string) => {
    try {
      setIsPolling(true);
      const response = await api.get(
        `/agents/meeting_prep/workflow-status/${sessionId}`
      );
      console.log("Workflow status:", response.data);

      setWorkflowStatus(response.data);

      if (response.data.status === "processing") {
        // Continue polling after a delay
        setTimeout(() => pollWorkflowStatus(sessionId), 3000);
      } else if (response.data.status === "awaiting_user_input") {
        // Show additional questions
        setAdditionalQuestions(response.data.additional_questions || []);

        // Initialize question responses
        const initialResponses: Record<string, string> = {};
        (response.data.additional_questions || []).forEach(
          (question: string) => {
            initialResponses[question] = "";
          }
        );
        setQuestionResponses(initialResponses);

        setIsPolling(false);
        setShowQuestions(true);
      } else if (response.data.status === "completed") {
        // Show final document
        setFinalDocument(response.data.final_document || "");
        setIsPolling(false);
        setShowDocumentPreview(true);
        setShowWizardModal(false);
      } else if (response.data.status === "error") {
        console.error("Workflow error:", response.data.error);
        setIsPolling(false);
        alert(
          "Workflow encountered an error: " +
            (response.data.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error polling workflow status:", error);
      setIsPolling(false);
      alert("Failed to check workflow status. Please try again.");
    }
  };

  // Submit additional user responses
  const submitAdditionalInfo = async () => {
    if (!sessionId) return;

    setIsSubmittingResponses(true);
    try {
      await api.post("/agents/meeting_prep/submit-additional-info", {
        session_id: sessionId,
        user_responses: questionResponses,
      });

      setShowQuestions(false);
      setIsSubmittingResponses(false);

      // Continue polling
      await pollWorkflowStatus(sessionId);
    } catch (error) {
      console.error("Error submitting additional info:", error);
      setIsSubmittingResponses(false);
      alert("Failed to submit responses. Please try again.");
    }
  };

  // Handle question response change
  const handleQuestionResponseChange = (question: string, value: string) => {
    setQuestionResponses((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  // Check if all questions are answered
  const areAllQuestionsAnswered = () => {
    return additionalQuestions.every(
      (question) =>
        questionResponses[question] && questionResponses[question].trim() !== ""
    );
  };

  // Helper function to convert markdown to plain text with formatting
  const markdownToPlainText = (markdown: string): string => {
    let text = markdown;

    // Convert headers (preserve hierarchy with indentation)
    text = text.replace(/^### (.+)$/gm, "   $1");
    text = text.replace(/^## (.+)$/gm, "  $1");
    text = text.replace(/^# (.+)$/gm, "$1");

    // Convert bold and italic (remove markdown syntax but keep content)
    text = text.replace(/\*\*(.+?)\*\*/g, "$1");
    text = text.replace(/\*(.+?)\*/g, "$1");

    // Convert lists (improve bullet point formatting)
    text = text.replace(/^[\s]*[-*+] (.+)$/gm, "• $1");
    text = text.replace(/^[\s]*\d+\. (.+)$/gm, "1. $1");

    // Convert code blocks (remove code block markers)
    text = text.replace(/```[\w]*\n/g, "");
    text = text.replace(/```/g, "");

    // Convert inline code (remove backticks)
    text = text.replace(/`(.+?)`/g, "$1");

    // Clean up extra whitespace and normalize line breaks
    text = text.replace(/\n{3,}/g, "\n\n");
    text = text.replace(/^\s+|\s+$/g, "");

    return text;
  };

  // Helper function to convert markdown to HTML
  const markdownToHTML = (markdown: string): string => {
    let html = markdown;

    // Convert headers
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

    // Convert bold and italic (be more specific to avoid conflicts)
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    // Convert code blocks
    html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

    // Convert inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Convert lists (improved pattern)
    const lines = html.split("\n");
    let inList = false;
    let result = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const listMatch = line.match(/^[\s]*[-*+] (.+)$/);

      if (listMatch) {
        if (!inList) {
          result.push("<ul>");
          inList = true;
        }
        result.push(`<li>${listMatch[1]}</li>`);
      } else {
        if (inList) {
          result.push("</ul>");
          inList = false;
        }
        result.push(line);
      }
    }

    if (inList) {
      result.push("</ul>");
    }

    html = result.join("\n");

    // Convert line breaks to paragraphs (but preserve existing HTML tags)
    html = html.replace(/\n\n+/g, "</p><p>");

    // Only wrap in paragraphs if not already wrapped in HTML tags
    if (
      !html.includes("<h1>") &&
      !html.includes("<h2>") &&
      !html.includes("<h3>") &&
      !html.includes("<ul>") &&
      !html.includes("<pre>")
    ) {
      html = "<p>" + html + "</p>";
    } else {
      // Clean up empty paragraphs
      html = html.replace(/<p><\/p>/g, "");
      html = html.replace(/^<p>/, "").replace(/<\/p>$/, "");
    }

    return html;
  };

  // Enhanced download document functions with proper formatting
  const downloadDocument = (format: "pdf" | "doc" | "txt") => {
    if (!finalDocument) return;

    let blob: Blob;
    let filename = `FDA_Meeting_Document.${format}`;

    if (format === "pdf") {
      // Generate PDF using jsPDF with proper formatting
      const doc = new jsPDF();
      const plainText = markdownToPlainText(finalDocument);
      const lines = plainText.split("\n");

      let yPosition = 20;

      lines.forEach((line) => {
        if (yPosition > 280) {
          // Start new page if needed
          doc.addPage();
          yPosition = 20;
        }

        // Determine text style based on content and indentation
        let fontSize = 12;
        let fontStyle: "normal" | "bold" = "normal";

        // Check if it's a header (no leading spaces and content)
        if (line.trim() && !line.startsWith(" ")) {
          // Main header
          fontSize = 16;
          fontStyle = "bold";
        } else if (line.startsWith("  ") && !line.startsWith("   ")) {
          // Secondary header
          fontSize = 14;
          fontStyle = "bold";
        } else if (line.startsWith("   ")) {
          // Tertiary header
          fontSize = 13;
          fontStyle = "bold";
        } else {
          // Regular text
          fontSize = 12;
          fontStyle = "normal";
        }

        // Apply font settings
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", fontStyle);

        // Handle empty lines
        if (!line.trim()) {
          yPosition += 5;
          return;
        }

        // Split long lines to fit page width
        const splitText = doc.splitTextToSize(line, 180);
        splitText.forEach((textLine: string) => {
          doc.text(textLine, 10, yPosition);
          yPosition += fontSize === 16 ? 8 : fontSize === 14 ? 7 : 6;
        });

        // Add extra space after headers
        if (fontStyle === "bold") {
          yPosition += 4;
        }
      });

      doc.save(filename);
      return;
    } else if (format === "doc") {
      const htmlContent = markdownToHTML(finalDocument);
      const docContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>FDA Meeting Document</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #666; margin-top: 30px; }
            h3 { color: #888; margin-top: 20px; }
            ul { margin: 10px 0; padding-left: 20px; }
            li { margin: 5px 0; }
            code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
            pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
            strong { font-weight: bold; }
            em { font-style: italic; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;
      blob = new Blob([docContent], { type: "application/msword" });
    } else {
      // For TXT format, use plain text with basic formatting
      const plainText = markdownToPlainText(finalDocument);
      blob = new Blob([plainText], { type: "text/plain" });
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleGetAIRecommendation = async () => {
    setIsLoadingRecommendation(true);
    try {
      const recommendation = await getRecommendation();

      const recommendationTemp = {
        recommendedMeetingType: recommendation?.MeetingType,
        icon: "E",
        subtitle: recommendation?.MeetingDescription,
        matchPercentage: "90%",
        timeline: recommendation?.Timeline || "N/A",
        justification: recommendation?.Justification || [],
        typicalQuestions: recommendation?.CommonQuestions || [],
        meetingCategory: recommendation?.MeetingCategory || "N/A",
      };
      setAiRecommendation(recommendationTemp);
      setShowRecommendation(true);
      setIsLoadingRecommendation(false);

      // Start loading documents
      setIsLoadingDocuments(true);
      const predictedMeetings = await predictMeetings();
      setAiRecommendation((prev: any) => ({
        ...prev,
        recommendedDocuments: predictedMeetings,
      }));
      setIsLoadingDocuments(false);
    } catch (error) {
      console.error("Error getting AI recommendation:", error);
      setIsLoadingRecommendation(false);
      setIsLoadingDocuments(false);
    }
  };

  const handleSubmitMeetingRequest = async () => {
    try {
      setIsLoadingDocuments(true);

      // Prepare API payload
      const apiPayload = {
        user_id: user?.id, // Get user_id from localStorage or default
        productType: formData.productType,
        developmentStage: formData.developmentStage,
        productName: formData.productName || "Drug",
        regulatoryObjective: formData.regulatoryObjective,
        meetingType:
          aiRecommendation?.recommendedMeetingType || "End of Phase 1",
        recommendedDocuments: aiRecommendation?.recommendedDocuments || [],
        preferredDate: meetingDate || "",
      };

      // Call the API to save meeting prep data
      await api.post(
        "/agents/meeting_prep/save_meetingprep_data",
        {
          ...apiPayload,
        }
      );

      // Create submission data for local state
      const submissionData = {
        id: editingSubmissionId || Date.now().toString(),
        productName: formData.productName || "Drug",
        productType: formData.productType,
        meetingType:
          aiRecommendation?.recommendedMeetingType
            ?.toLowerCase()
            .replace(/\s+/g, "_") || "end_of_phase1",
        developmentStage: formData.developmentStage,
        submittedDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        lastUpdated: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        timestamp: new Date().toISOString(), // Add timestamp for proper sorting
        formData,
        aiRecommendation,
        meetingDate,
      };

      // Update local state
      if (editingSubmissionId) {
        setMeetings((prev) =>
          prev.map((sub) =>
            sub.id === editingSubmissionId ? submissionData : sub
          )
        );
      } else {
        setMeetings((prev) => [submissionData, ...prev]);
      }

      setCurrentTab("main");
      resetForm();

      // Show success message
      alert("Meeting request submitted successfully! You can view it in the Recent Meetings section.");
    } catch (error) {
      console.error("Error saving meeting prep data:", error);
      // Show error message to user (you can add error handling UI here)
      alert("Failed to save meeting request. Please try again.");
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const components: any = {
    code({ node, ...props }: { node: any; [key: string]: any }) {
      let language;
      if (props.className) {
        const match = props.className.match(/language-(\w+)/);
        language = match ? match[1] : undefined;
      }
      const codeString = node.children[0].value ?? "";
      return (
        <SyntaxHighlighter
          style={nord}
          language={language}
          PreTag="div"
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      );
    },
  };

  const handleViewDetails = (submission: any) => {
    setFormData(submission.formData);
    setAiRecommendation(submission.aiRecommendation);
    setMeetingDate(submission.meetingDate);
    setShowRecommendation(true);
    setCurrentTab("product-info");
    setEditingSubmissionId(submission.id);
  };
  const { activeSubmission } = useSubmission();
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      productType: activeSubmission?.product_type || "",
      productName: activeSubmission?.name || "",
    }));
  }, [activeSubmission]);

  // Call getMeetings when switching to main tab
  useEffect(() => {
    if (currentTab === "main") {
      getMeetings();
    }
  }, [currentTab, user?.id]);

  const handleCreateWithAIWizard = async (_document: any) => {
    // setShowWizardModal(true);
    const uuid = crypto.randomUUID();
    setSessionId(uuid);

    try {
      await api.post("/agents/meeting_prep/start-workflow", {
        fda_document_type: _document?.title,
        meeting_type: aiRecommendation?.recommendedMeetingType,
        session_id: uuid,
      });
      // Start polling for workflow status
      await pollWorkflowStatus(uuid);
    } catch (error) {
      console.error("Error starting workflow:", error);
      alert("Failed to start workflow. Please try again.");
    }

    setWizardStep(1);
    // setWizardData({
    //   productName: formData.productName || "",
    //   companyName: "",
    //   indication: activeSubmission?.intended_use || "",
    //   primaryObjective: "",
    //   specificQuestions: "",
    //   preferredMeetingDate: "",
    //   questions: {},
    // });
  };

  const handleWizardInputChange = (field: string, value: string) => {
    setWizardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWizardNext = () => {
    if (wizardStep < 2) {
      setWizardStep(wizardStep + 1);
    }
  };

  const handleWizardPrevious = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const handleWizardClose = () => {
    setShowWizardModal(false);
    setWizardStep(1);
    setWizardData({
      productName: "",
      companyName: "",
      indication: "",
      primaryObjective: "",
      specificQuestions: "",
      preferredMeetingDate: "",
      questions: {},
    });
  };

  const isWizardStepComplete = () => {
    if (wizardStep === 1) {
      return (
        wizardData.productName &&
        wizardData.companyName &&
        wizardData.indication
      );
    }
    return true;
  };

  const handleGenerateDocument = () => {
    // TODO: Implement document generation
    console.log("Generate document with data:", wizardData);
  };

  const EmptyState = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="text-center py-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 mb-4">{description}</p>
        </div>
      </CardContent>
    </Card>
  );

  const MeetingCard = ({
    meeting,
    onViewDetails,
  }: {
    meeting: any;
    onViewDetails: (meeting: any) => void;
  }) => (
    <Card key={meeting.id}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">
                {meeting.product_name}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                <CalendarDays className="w-3 h-3" />
                Submitted
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p>Product Type: {meeting.product_type}</p>
                <p>Meeting Type: {meeting.meeting_type}</p>
              </div>
              <div>
                <p>Development Stage: {meeting.development_stage}</p>
                <p>
                  {meeting.submittedDate
                    ? `Submitted: ${new Date(
                        meeting.submittedDate
                      ).toLocaleDateString()}`
                    : `Last Updated: ${new Date(
                        meeting.timestamp
                      ).toLocaleDateString()}`}
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(meeting)}
            className="ml-4"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (currentTab === "main") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#0b0080] mb-2">
              FDA Meeting Preparation
            </h1>
            <p className="text-gray-600">
              Streamline your FDA meeting process with AI-powered assistance
            </p>
          </div>
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              setCurrentTab("product-info");
              resetForm();
            }}
          >
            <Plus className="w-5 h-5" />
            New Meeting Request
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Meetings
            </h2>
          </div>
          {meetings.length === 0 ? (
            <EmptyState
              title="No recent meetings"
              description="Create your first meeting request to get started"
            />
          ) : (
            <div className="space-y-4">
              {meetings
                .sort((a, b) => new Date(b.timestamp || b.lastUpdated || 0).getTime() - new Date(a.timestamp || a.lastUpdated || 0).getTime())
                .slice(0, 3)
                .map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onViewDetails={handleViewDetails}
                  />
                ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              All Meeting Requests
            </h2>
          </div>
          {meetings.length === 0 ? (
            <EmptyState
              title="No meeting requests yet"
              description="Create your first meeting request to get started"
            />
          ) : (
            <div className="space-y-4">
              {meetings
                .sort((a, b) => new Date(b.timestamp || b.lastUpdated || 0).getTime() - new Date(a.timestamp || a.lastUpdated || 0).getTime())
                .map((request) => (
                  <MeetingCard
                    key={request.id}
                    meeting={request}
                    onViewDetails={handleViewDetails}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#0b0080] mb-2">
            Meeting Type Identification
          </h1>
          <p className="text-gray-600">
            Recommend the appropriate FDA meeting type based on your product and
            development stage
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            setCurrentTab("main");
            resetForm();
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to FDA Meeting Preparation Agent
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-6">
              <Info className="w-5 h-5 text-blue-500" />
              <h3>Product Information</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Product Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                    value={formData.productType}
                    onChange={(e) =>
                      handleInputChange("productType", e.target.value)
                    }
                  >
                    <option value="">Select product type...</option>
                    {productTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Development Stage
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                    value={formData.developmentStage}
                    onChange={(e) =>
                      handleInputChange("developmentStage", e.target.value)
                    }
                  >
                    <option value="">Select development stage...</option>
                    <option value="preclinical">Preclinical</option>
                    <option value="phase1">Phase 1</option>
                    <option value="phase2">Phase 2</option>
                    <option value="phase3">Phase 3</option>
                    <option value="pre-market">Pre-market</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                  placeholder="Enter product name"
                  value={formData.productName}
                  onChange={(e) =>
                    handleInputChange("productName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Regulatory Objective
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                  rows={4}
                  placeholder="Describe your regulatory objective (e.g., IND readiness, EOP2 design alignment)"
                  value={formData.regulatoryObjective}
                  onChange={(e) =>
                    handleInputChange("regulatoryObjective", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button
                className={`flex items-center gap-2 ${
                  !Object.values(formData).every(Boolean) ||
                  isLoadingRecommendation
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleGetAIRecommendation}
                disabled={
                  !Object.values(formData).every(Boolean) ||
                  isLoadingRecommendation
                }
              >
                {isLoadingRecommendation ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Lightbulb className="w-5 h-5" />
                )}
                {isLoadingRecommendation
                  ? "Getting Recommendation..."
                  : "Get AI Recommendation"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showRecommendation && aiRecommendation && (
        <>
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-7 h-7 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Recommended Meeting Type
                </h2>
              </div>
              <div className="space-y-6 p-8 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {aiRecommendation?.meetingCategory
                          ? aiRecommendation?.meetingCategory[0]
                          : "E"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {aiRecommendation?.recommendedMeetingType} (
                        {aiRecommendation?.meetingCategory})
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {aiRecommendation.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-green-600 font-semibold text-sm mb-1">
                      {aiRecommendation.matchPercentage} Match
                    </span>
                    <span className="text-gray-400 text-xs">
                      Confidence Score
                    </span>
                    <span className="text-gray-400 text-xs">
                      {aiRecommendation.timeline}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Justification
                    </h5>
                    <ul className="space-y-2 text-sm">
                      {aiRecommendation.justification?.map(
                        (item: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-700"
                          >
                            <span className="inline-block w-2 h-2 mt-2 bg-green-500 rounded-full"></span>
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Typical Questions
                    </h5>
                    <ul className="space-y-2 text-sm">
                      {aiRecommendation.typicalQuestions?.map(
                        (item: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-700"
                          >
                            <span className="inline-block w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full"></span>
                            <span>{item}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-7 h-7 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Recommended Documents
                </h2>
              </div>
              <p className="text-gray-600 mb-6">
                Documents recommended for your{" "}
                <span className="font-semibold">
                  {aiRecommendation?.recommendedMeetingType || "FDA Meeting"}
                </span>{" "}
                meeting
              </p>

              <div className="space-y-4">
                {isLoadingDocuments ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                      <span className="text-gray-600">
                        Loading recommended documents...
                      </span>
                    </div>
                  </div>
                ) : aiRecommendation?.recommendedDocuments?.length > 0 ? (
                  aiRecommendation.recommendedDocuments.map(
                    (document: any, index: number) => (
                      <div
                        key={document.id}
                        className={`flex items-center justify-between py-4 ${
                          index <
                          aiRecommendation.recommendedDocuments.length - 1
                            ? "border-b border-gray-200"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              document.status === "completed"
                                ? "bg-green-500"
                                : document.status === "required"
                                ? "bg-red-500"
                                : document.status === "recommended"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                            }`}
                          >
                            {document.status === "completed" ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {document.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {document.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
                            onClick={() => handleCreateWithAIWizard(document)}
                          >
                            <Wand2 className="w-4 h-4" />
                            Create with AI Wizard
                          </Button>
                          <div className="relative">
                            <div
                              className="flex items-center gap-1 text-gray-500 cursor-pointer"
                              onClick={() =>
                                setOpenHelpId(
                                  openHelpId === document.id
                                    ? null
                                    : document.id
                                )
                              }
                            >
                              <span className="text-sm">Need Help?</span>
                              <HelpCircle className="w-4 h-4" />
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${
                                  openHelpId === document.id ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                            {openHelpId === document.id &&
                              document.helpContent && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4 z-10">
                                  <div className="mb-3">
                                    <h5 className="font-semibold text-blue-900">
                                      Need Help?
                                    </h5>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <h6 className="font-semibold text-blue-800 mb-2">
                                        What to Include:
                                      </h6>
                                      <ul className="space-y-1">
                                        {document.helpContent.whatToInclude.map(
                                          (item: string, idx: number) => (
                                            <li
                                              key={idx}
                                              className="flex items-start gap-2 text-sm text-blue-700"
                                            >
                                              <span className="inline-block w-1.5 h-1.5 mt-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                              <span>{item}</span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>

                                    <div>
                                      <h6 className="font-semibold text-blue-800 mb-2">
                                        Tips:
                                      </h6>
                                      <ul className="space-y-1">
                                        {document.helpContent.tips.map(
                                          (item: string, idx: number) => (
                                            <li
                                              key={idx}
                                              className="flex items-start gap-2 text-sm text-blue-700"
                                            >
                                              <Lightbulb className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                                              <span>{item}</span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No documents available for this meeting type.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-3 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    General Submission Tips:
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full"></span>
                      <span>
                        Submit documents at least 30 days before your requested
                        meeting date
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full"></span>
                      <span>
                        Use clear, concise language and avoid unnecessary jargon
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full"></span>
                      <span>
                        Include page numbers and a table of contents for longer
                        documents
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full"></span>
                      <span>
                        Provide electronic copies in searchable PDF format
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 mt-2 bg-gray-400 rounded-full"></span>
                      <span>
                        Consider FDA's current workload and plan accordingly
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Meeting Details
              </h2>

              <div className="w-full bg-blue-50 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {aiRecommendation?.icon || "M"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {aiRecommendation?.recommendedMeetingType ||
                        "FDA Meeting"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {aiRecommendation?.subtitle ||
                        "Meeting to discuss regulatory objectives"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="meetingDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Preferred Meeting Date:
                  </label>
                  <input
                    type="date"
                    id="meetingDate"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b0080] focus:border-[#0b0080]"
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    className={`flex items-center gap-2 ${
                      !meetingDate ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleSubmitMeetingRequest}
                    disabled={!meetingDate}
                  >
                    <Calendar className="w-5 h-5" />
                    Submit Meeting Request
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* AI Document Wizard Modal */}
      {showWizardModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          style={{ top: "80px" }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  AI Document Wizard: Meeting Request Letter
                </h2>
              </div>
              <button
                onClick={handleWizardClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Progress Section */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {wizardStep} of 2
                </span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {wizardStep === 1 ? "50%" : "100%"} Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${wizardStep === 1 ? "50%" : "100%"}` }}
                ></div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                {wizardStep === 1 ? (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Basic Information
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Let's start with some basic details about your product and
                      meeting.
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter your product name"
                          value={wizardData.productName}
                          onChange={(e) =>
                            handleWizardInputChange(
                              "productName",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Your company name"
                          value={wizardData.companyName}
                          onChange={(e) =>
                            handleWizardInputChange(
                              "companyName",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Indication/Intended Use{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          rows={3}
                          placeholder="Describe the intended use or indication for your product"
                          value={wizardData.indication}
                          onChange={(e) =>
                            handleWizardInputChange(
                              "indication",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Meeting Objectives
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      What do you hope to achieve from this FDA meeting?
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Primary Objective{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          rows={3}
                          placeholder="What is the main goal of this meeting?"
                          value={wizardData.primaryObjective}
                          onChange={(e) =>
                            handleWizardInputChange(
                              "primaryObjective",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Specific Questions{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          rows={3}
                          placeholder="List specific questions you want to discuss with FDA"
                          value={wizardData.specificQuestions}
                          onChange={(e) =>
                            handleWizardInputChange(
                              "specificQuestions",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Preferred Meeting Date
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="When would you like to meet?"
                          value={wizardData.preferredMeetingDate}
                          onChange={(e) =>
                            handleWizardInputChange(
                              "preferredMeetingDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleWizardPrevious}
                disabled={wizardStep === 1}
                className="flex items-center gap-2"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </Button>
              {wizardStep === 1 ? (
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
                  onClick={handleWizardNext}
                  disabled={!isWizardStepComplete()}
                >
                  Next
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
              ) : (
                <Button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-2"
                  onClick={handleGenerateDocument}
                >
                  <Wand2 className="w-4 h-4" />
                  Generate Document
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional Questions Modal */}
      {showQuestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Additional Information Required
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Please provide the following information to complete your
                document:
              </p>

              <div className="space-y-4">
                {additionalQuestions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {question} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Please provide your answer here..."
                      value={questionResponses[question] || ""}
                      onChange={(e) =>
                        handleQuestionResponseChange(question, e.target.value)
                      }
                      disabled={isSubmittingResponses}
                    />
                  </div>
                ))}
              </div>

              {isSubmittingResponses && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="text-gray-600">
                      Submitting responses...
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200">
              <Button
                onClick={submitAdditionalInfo}
                disabled={!areAllQuestionsAnswered() || isSubmittingResponses}
                className="flex items-center gap-2"
              >
                {isSubmittingResponses ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Submit Responses
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {showDocumentPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                FDA Meeting Document Ready
              </h2>
              <button
                onClick={() => setShowDocumentPreview(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Document Preview
                </h3>
                <p className="text-gray-600 text-sm">
                  Your FDA meeting document has been generated successfully. You
                  can preview it below and download it in your preferred format.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                {/* <MarkD className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {finalDocument}
                </MarkD> */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, supersub]}
                  children={finalDocument}
                  components={components}
                />
              </div>
            </div>

            <div className="flex justify-between items-center p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowDocumentPreview(false)}
              >
                Close
              </Button>

              <div className="flex gap-2">
                <Button
                  onClick={() => downloadDocument("txt")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download TXT
                </Button>
                <Button
                  onClick={() => downloadDocument("doc")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download DOC
                </Button>
                <Button
                  onClick={() => downloadDocument("pdf")}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Polling Status Loader */}
      {isPolling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              {/* Animated AI Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Wand2 className="w-10 h-10 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-purple-200 rounded-full animate-spin border-t-purple-500"></div>
              </div>

              {/* Status Text */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                AI Document Generation
              </h3>
              <p className="text-gray-600 mb-6">
                {workflowStatus?.status === "processing"
                  ? "Our AI is crafting your FDA meeting document..."
                  : "Preparing your personalized meeting request..."}
              </p>

              {/* Progress Animation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Analyzing requirements</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Generating content</span>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>Finalizing document</span>
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This usually takes 30-60 seconds
                </p>
              </div>

              {/* Floating particles animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0s", animationDuration: "2s" }}
                ></div>
                <div
                  className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
                ></div>
                <div
                  className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-bounce"
                  style={{ animationDelay: "1s", animationDuration: "1.8s" }}
                ></div>
                <div
                  className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-purple-200 rounded-full animate-bounce"
                  style={{ animationDelay: "1.5s", animationDuration: "2.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FdaMeetingPrepAgent;
