import { CheckCircle, Clock, FileText } from "lucide-react";
import { Card } from "../components/ui/Card";
import React, { useEffect, useRef } from "react";
import StatsCard from "../components/StatsCard";
import SubmissionModal from "../components/SubmissionModal";
import SubmissionTable from "../components/SubmissionTable";
import { useAuth } from "../provider/authProvider";
import {
  fetchSubmissions,
  createSubmission,
  deleteSubmission,
  type Submission,
} from "../helpers/submissionApiHelper";


interface Stats {
  drafts: number;
  pending: number;
  approved: number;
  total: number;
  approvalRate: number;
}

// Constants
// Utility functions

const calculateStats = (submissions: Submission[]): Stats => {
  const drafts = submissions.filter((s) => s.status === "draft").length;
  const in_progress = submissions.filter((s) => s.status === "in_progress").length;
  const completed = submissions.filter((s) => s.status === "completed").length;
  const total = submissions.length;
  const approvalRate = total > 0 ? Math.round((completed / total) * 100) : 0
  return { drafts, pending: in_progress, approved: completed, total, approvalRate };
};

const Dashboard = () => {
  // State management
  const [open, setOpen] = React.useState(false);
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);
  const { user } = useAuth();

  const fetchSubmissionsData = async () => {
    if (!user) return;
    try {
      const data = await fetchSubmissions(user.id);
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  useEffect(() => {
    fetchSubmissionsData();
  }, [user]);

  // Form state (update type to match new fields)
  type FormData = {
    name: string;
    type: string;
    submissionType: string;
    end_time: string;
    productDescription: string;
  };

  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    type: "",
    submissionType: "",
    end_time: "",
    productDescription: "",
  });

  // Add state for generated questions and their answers
  const [questions, setQuestions] = React.useState<string[]>([]);
  const [questionAnswers, setQuestionAnswers] = React.useState<{
    [q: string]: string;
  }>({});
  // Add ref to track latest questionAnswers for async operations
  const questionAnswersRef = useRef<{ [q: string]: string }>({});
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
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
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

  // Sync questionAnswersRef with questionAnswers state
  React.useEffect(() => {
    questionAnswersRef.current = questionAnswers;
  }, [questionAnswers]);

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

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleDeleteSubmission = React.useCallback(async (id: string) => {
    try {
      await deleteSubmission(id);
      await fetchSubmissionsData();
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  }, []);

  const handleOpen = React.useCallback(() => setOpen(true), []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    setFormData({
      name: "",
      type: "",
      submissionType: "",
      end_time: "",
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
          response = await fetch("/agent/suggested_form", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_answers: JSON.stringify(answers),
            }),
          });
          const data = await response.json();
          suggestion = data?.suggested_form || "";
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
      try {
        const newSubmission: Partial<Submission> = {
          name: formData.name,
          type: formData.type,
          submissionType: formData.submissionType,
          end_time: formData.end_time,
          productDescription: formData.productDescription,
          status: "draft",
          progress: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          questionAnswers: questionAnswersRef.current,
        };

        await createSubmission(newSubmission);
        await fetchSubmissionsData();
        handleClose();
      } catch (error) {
        console.error("Error creating submission:", error);
      } finally {
        setLoading(false);
      }
    },
    [formData, handleClose]
  );

  const handleFormSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (questions.length === 0) {
        setLoading(true);
        try {
          // First submit: get questions from API
          const response = await fetch("/agent/form_questions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_input: formData.productDescription,
            }),
          });
          const data = await response.json();
          const qs =
            data?.questions
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
    [formData, questions, handleAdditionalQuestionsSubmission]
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



  const handleInputChange = React.useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };
        // Reset submission type when type changes
        if (field === "type") {
          updated.submissionType = "";
        }
        return updated;
      });
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
            Recent Submissions
          </h3>
        </div>
        <SubmissionTable
          submissions={sortedSubmissions}
          onDelete={handleDeleteSubmission}
        />
      </Card>

      {/* Modal */}
      <SubmissionModal
        open={open}
        formData={formData}
        onClose={handleClose}
        onSubmit={readyToCreate ? handleCreateSubmission : handleFormSubmit}
        onInputChange={handleInputChange}
        questions={questions}
        questionAnswers={questionAnswers}
        onQuestionAnswerChange={handleQuestionAnswerChange}
        loading={loading}
        formSuggestion={formSuggestion}
        canCreate={readyToCreate || allowManualCreate}
        suggestionError={suggestionError}
      />
    </div>
  );
};

export default Dashboard;
