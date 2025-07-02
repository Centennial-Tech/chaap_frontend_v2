import { CheckCircle, Clock, FileText } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import React, { useEffect } from "react";
import StatsCard from "../components/StatsCard";
import SubmissionModal from "../components/SubmissionModal";
import SubmissionTable from "../components/SubmissionTable";
import api from "../api";
import { useAuth } from "../provider/authProvider";

// Types
interface Submission {
  id: number;
  project: string;
  type: "Device" | "Drug";
  submissionType: string;
  targetSubmission: string;
  status: "draft" | "pending" | "approved";
  progress: number;
  updatedAt: string;
  productDescription: string;
}

interface SubmissionTypeOption {
  value: string;
  label: string;
}

interface Stats {
  drafts: number;
  pending: number;
  approved: number;
  total: number;
  approvalRate: number;
}

// Constants
const SUBMISSION_TYPES = {
  Device: [
    { value: "510k", label: "510k (Premarket Notification)" },
    { value: "PMA", label: "PMA (Premarket Approval)" },
    { value: "De Novo", label: "De Novo Classification Request" },
    { value: "HDE", label: "HDE (Humanitarian Device Exemption)" },
    { value: "IDE", label: "IDE (Investigational Device Exemption)" },
  ] as SubmissionTypeOption[],
  Drug: [
    { value: "IND", label: "IND (Investigational New Drug)" },
    { value: "NDA", label: "NDA (New Drug Application)" },
    { value: "ANDA", label: "ANDA (Abbreviated New Drug Application)" },
    { value: "BLA", label: "BLA (Biologics License Application)" },
  ] as SubmissionTypeOption[],
};

const STATUS_CONFIG = {
  draft: { text: "Draft", color: "bg-blue-500" },
  pending: { text: "Pending", color: "bg-orange-500" },
  approved: { text: "Approved", color: "bg-green-500" },
} as const;

// Utility functions
const getSubmissionTypesForType = (
  selectedType: string
): SubmissionTypeOption[] => {
  return SUBMISSION_TYPES[selectedType as keyof typeof SUBMISSION_TYPES] || [];
};

const getStatusConfig = (status: string) => {
  return (
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
      text: status,
      color: "bg-gray-500",
    }
  );
};

const calculateStats = (submissions: Submission[]): Stats => {
  const drafts = submissions.filter((s) => s.status === "draft").length;
  const pending = submissions.filter((s) => s.status === "pending").length;
  const approved = submissions.filter((s) => s.status === "approved").length;
  const total = submissions.length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  return { drafts, pending, approved, total, approvalRate };
};

const generateNewId = (submissions: Submission[]): number => {
  return submissions.length ? Math.max(...submissions.map((s) => s.id)) + 1 : 1;
};

// Initial data
// const INITIAL_SUBMISSIONS: Submission[] = [
//   {
//     id: 1,
//     project: "CardioSense Monitor",
//     type: "Device",
//     submissionType: "PMA (Premarket Approval)",
//     targetSubmission: "2024-06-01T10:30:00Z",
//     status: "approved",
//     progress: 100,
//     updatedAt: "2024-06-01T10:30:00Z",
//     productDescription: "A monitor for cardiovascular health.",
//   },
//   {
//     id: 2,
//     project: "ThermoScan Pro",
//     type: "Device",
//     submissionType: "510k (Premarket Notification)",
//     targetSubmission: "2024-06-30T14:45:00Z",
//     status: "pending",
//     progress: 80,
//     updatedAt: "2024-06-02T14:45:00Z",
//     productDescription: "A professional-grade thermometer.",
//   },
//   {
//     id: 3,
//     project: "Adestunore",
//     type: "Drug",
//     submissionType: "NDA (New Drug Application)",
//     targetSubmission: "2024-05-28T16:10:00Z",
//     status: "approved",
//     progress: 100,
//     updatedAt: "2024-05-28T16:10:00Z",
//     productDescription: "A new drug for treating conditions.",
//   },
//   {
//     id: 4,
//     project: "PulseOx 2000",
//     type: "Device",
//     submissionType: "510k (Premarket Notification)",
//     targetSubmission: "2024-07-15T09:20:00Z",
//     status: "draft",
//     progress: 40,
//     updatedAt: "2024-06-03T09:20:00Z",
//     productDescription: "A pulse oximeter for measuring blood oxygen.",
//   },
//   {
//     id: 5,
//     project: "Hicesterol",
//     type: "Drug",
//     submissionType: "IND (Investigational New Drug)",
//     targetSubmission: "2024-05-28T16:10:00Z",
//     status: "draft",
//     progress: 0,
//     updatedAt: "2024-05-28T16:10:00Z",
//     productDescription: "An investigational drug for high cholesterol.",
//   },
// ];

const Dashboard = () => {
  // State management
  const [open, setOpen] = React.useState(false);
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);
  const { user } = useAuth();

  const fetchSubmissions = async () => {
      try {
        const response = await api.get(
          `/applications/userId?user_id=${user?.id}`
        );
        const data: Submission[] = response.data;
        setSubmissions(data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
  useEffect(() => {
    console.log("Fetching submissions for user:", user?.id);
    
    fetchSubmissions();
  }, []);

  // Form state (update type to match new fields)
  type FormData = {
    projectTitle: string;
    type: string;
    submissionType: string;
    targetSubmission: string;
    productDescription: string;
  };

  const [formData, setFormData] = React.useState<FormData>({
    projectTitle: "",
    type: "",
    submissionType: "",
    targetSubmission: "",
    productDescription: "",
  });

  // Add state for generated questions and their answers
  const [questions, setQuestions] = React.useState<string[]>([]);
  const [questionAnswers, setQuestionAnswers] = React.useState<{
    [q: string]: string;
  }>({});
  // Add loading state for API call
  const [loading, setLoading] = React.useState(false);
  // Add state for form suggestion
  const [formSuggestion, setFormSuggestion] = React.useState<string>("");
  const [suggestionError, setSuggestionError] = React.useState("");

  // Track if we are in the final create step
  const [readyToCreate, setReadyToCreate] = React.useState(false);
  // Track if user can skip suggestion and go to create after error
  const [allowManualCreate, setAllowManualCreate] = React.useState(false);

  // Derived state - Sort submissions by last updated (most recent first)
  const sortedSubmissions = React.useMemo(() => {
    return [...submissions].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [submissions]);

  const stats = React.useMemo(() => calculateStats(submissions), [submissions]);

  // Update readyToCreate when formSuggestion is set
  React.useEffect(() => {
    if (formSuggestion) {
      setReadyToCreate(true);
    } else {
      setReadyToCreate(false);
    }
  }, [formSuggestion]);

  React.useEffect(() => {
    if (suggestionError) {
      setAllowManualCreate(true);
      setReadyToCreate(true);
    } else if (formSuggestion) {
      setAllowManualCreate(false);
      setReadyToCreate(true);
    } else {
      setAllowManualCreate(false);
      setReadyToCreate(false);
    }
  }, [formSuggestion, suggestionError]);

  // Add a ref to always have the latest questionAnswers
  const questionAnswersRef = React.useRef(questionAnswers);
  React.useEffect(() => {
    questionAnswersRef.current = questionAnswers;
  }, [questionAnswers]);

  // Event handlers
  const handleDeleteSubmission = React.useCallback((id: number) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleOpen = React.useCallback(() => setOpen(true), []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    setFormData({
      projectTitle: "",
      type: "",
      submissionType: "",
      targetSubmission: "",
      productDescription: "",
    });
    setQuestions([]);
    setQuestionAnswers({});
    setLoading(false);
  }, []);

  const handleAdditionalQuestionsSubmission = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setSuggestionError("");
      let suggestion = "";
      let response;
      let attempts = 0;
      try {
        do {
          // Use the ref to get the latest answers
          const answers = { ...questionAnswersRef.current };
          console.log("API will send answers:", answers);
          response = await api.post("/agent/suggested_form", {
            user_answers: JSON.stringify(answers),
          });
          suggestion = response.data?.suggested_form || "";
          attempts++;
        } while (suggestion.length > 10 && attempts < 2);
        if (suggestion.length > 10) {
          setSuggestionError(
            "We are not able to get a suggestion based on your inputs. Please select the submission type manually."
          );
          setFormSuggestion("");
          setFormData((prev) => ({ ...prev, submissionType: "" }));
        } else {
          setFormSuggestion(suggestion);
          setFormData((prev) => ({ ...prev, submissionType: suggestion }));
        }
      } finally {
        setLoading(false);
      }
    },
    [] // Remove questionAnswers from deps, use ref instead
  );

  const handleCreateSubmission = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      // TODO: Add your final API calls here before creating the submission
      // Example:
      // await api.post('/your/endpoint', { ... });
      // await api.post('/another/endpoint', { ... });
      // Add your API logic below this comment
      const newSubmission: any = {
        // id: generateNewId(submissions),
        name: formData.projectTitle,
        type: formData.type as "Device" | "Drug",
        submissionType: formData.submissionType,
        targetSubmission: "",
        status: "draft",
        progress: 0,
        updatedAt: new Date().toISOString(),
        productDescription: formData.productDescription,
        screening_responses: JSON.stringify(questionAnswersRef.current),
      };

      // console.log("Creating new submission:", newSubmission);
      await api.post("/applications", newSubmission);
      await fetchSubmissions();
      // setSubmissions((prev) => [newSubmission, ...prev]);
      setQuestions([]);
      setQuestionAnswers({});
      setFormSuggestion("");
      setReadyToCreate(false);
      setLoading(false);
      handleClose();
    },
    [formData, submissions, handleClose]
  );

  const handleFormSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (questions.length === 0) {
        setLoading(true);
        try {
          // First submit: get questions from API
          const response = await api.post("/agent/form_questions", {
            user_input: formData.productDescription,
          });
          const qs =
            response.data?.questions
              ?.match(/- (.+?)(?=\n|$)/g)
              ?.map((q: any) => q.replace(/^\-\s*/, "")) || [];
          setQuestions(qs);
        } finally {
          setLoading(false);
        }
        // Don't close modal yet, let user answer questions
        return;
      }
      // Second submit: save submission with answers
      await handleAdditionalQuestionsSubmission(e);
      // Now show the submissionType field with default value from formSuggestion
      return;
    },
    [formData, submissions, handleClose, questions]
  );

  // Handler for question answers
  const handleQuestionAnswerChange = React.useCallback(
    (q: string, value: string) => {
      setQuestionAnswers((prev) => {
        const updated = { ...prev, [q]: value };
        console.log("handleQuestionAnswerChange", updated);
        return updated;
      });
    },
    []
  );

  const handleTypeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value;
      setFormData((prev) => ({
        ...prev,
        type: newType,
        submissionType: "", // Reset submission type when type changes
      }));
    },
    []
  );

  const handleInputChange = React.useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return (
    <div className="space-y-8 flex flex-col flex-1 p-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Manage your submissions and compliance documentation
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          onClick={handleOpen}
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
          New Submission
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <StatsCard
          title="Draft Submissions"
          value={stats?.drafts || 0}
          icon={FileText}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Pending Review"
          value={stats?.pending || 0}
          icon={Clock}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Approved"
          value={stats?.approved || 0}
          icon={CheckCircle}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Submissions Table */}
      <Card>
        <div className="px-6 py-4 border-b border-ms-gray-300">
          <h3 className="text-lg font-medium text-ms-gray-900">
            Your Submissions
          </h3>
        </div>
        <SubmissionTable
          submissions={sortedSubmissions}
          onDelete={handleDeleteSubmission}
          getStatusConfig={getStatusConfig}
        />
      </Card>

      {/* Modal */}
      <SubmissionModal
        open={open}
        formData={formData}
        onClose={handleClose}
        onSubmit={readyToCreate ? handleCreateSubmission : handleFormSubmit}
        onTypeChange={handleTypeChange}
        onInputChange={handleInputChange}
        getSubmissionTypesForType={getSubmissionTypesForType}
        hideTargetDate
        questions={questions}
        questionAnswers={questionAnswers}
        onQuestionAnswerChange={handleQuestionAnswerChange}
        loading={loading}
        showSubmissionType={!!formSuggestion || !!suggestionError}
        formSuggestion={formSuggestion}
        readyToCreate={readyToCreate}
        suggestionError={suggestionError}
        allowManualCreate={allowManualCreate}
      />
    </div>
  );
};

export default Dashboard;
