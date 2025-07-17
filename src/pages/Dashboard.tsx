import { CheckCircle, Clock, FileText, Plus } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import React, { useEffect, useRef } from "react";
import StatsCard from "../components/StatsCard";
import SubmissionModal from "../components/SubmissionModal";
import SubmissionTable from "../components/SubmissionTable";
import { useSubmission } from "../provider/submissionProvider";
import { useLocation } from "react-router-dom";
import {
  createSubmission,
  deleteSubmission,
  type Submission,
} from "../helpers/submissionApiHelper";
import api from "../api";
import Modal from "../components/ui/Modal";

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
  const in_progress = submissions.filter(
    (s) => s.status === "in_progress"
  ).length;
  const completed = submissions.filter((s) => s.status === "completed").length;
  const total = submissions.length;
  const approvalRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  return {
    drafts,
    pending: in_progress,
    approved: completed,
    total,
    approvalRate,
  };
};

const Dashboard = () => {
  const location = useLocation();
  const [showMessage, setShowMessage] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const { submissions, refreshSubmissions } = useSubmission();

  // Check for redirect message
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setShowMessage(true);
      // Clear the message from location state after showing it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // State management
  const [open, setOpen] = React.useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirmDelete = async () => {
    if (confirmDeleteId) {
      setIsDeleting(true);
      try {
        await deleteSubmission(confirmDeleteId);
        await refreshSubmissions();
      } catch (error) {
        console.error("Error deleting submission:", error);
      } finally {
        setIsDeleting(false);
        setConfirmDeleteOpen(false);
        setConfirmDeleteId(null);
      }
    }
  };

  // Form state (update type to match new fields)
  type SubmissionFormData = {
    name: string;
    type: string;
    submissionType: string;
    end_time: string;
    productDescription: string;
  };

  const [formData, setFormData] = React.useState<SubmissionFormData>({
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
      await refreshSubmissions();
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
      try {
        const newSubmission: Partial<Submission> = {
          name: formData.name,
          submission_type: formData.submissionType,
          end_time: formData.end_time,
          intended_use: formData.productDescription,
          product_type: formData.type,
          form_id: '9ed3855e-c972-458c-bd51-dd9bafad8d7d', //TODO: currenlty hardcoded to 'ind', have a map or api to get the form_id from the submissionType
        };

        await createSubmission(newSubmission);
        await refreshSubmissions();
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

  const handleInputChange = React.useCallback(
    (field: keyof SubmissionFormData, value: string) => {
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
    <div className="overflow-x-hidden">
      {/* Message Alert */}
      {showMessage && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">{message}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setShowMessage(false)}
                  className="inline-flex rounded-md p-1.5 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* TODO: Refactor to use global overlay provider for confirm dialog */}
      {confirmDeleteOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40"></div>
          <Modal
            isOpen={confirmDeleteOpen}
            onClose={() => {
              setConfirmDeleteOpen(false);
              setConfirmDeleteId(null);
            }}
            title="Confirm Deletion"
            maxWidth="max-w-md"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete this submission? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setConfirmDeleteOpen(false);
                    setConfirmDeleteId(null);
                  }}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
      <div className="space-y-8 flex flex-col flex-1 p-8 transition-all duration-500 ease-in-out">
        <div className="flex items-center justify-between transition-transform duration-500 ease-in-out">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-1">
              Manage your submissions and compliance documentation
            </p>
          </div>
          <Button onClick={handleOpen}>
            <Plus className="w-4 h-4" />
            New Submission
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 transition-all duration-500 ease-in-out transform-gpu">
          <StatsCard
            title="Drafts"
            value={stats?.drafts || 0}
            icon={FileText}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            className="transition-transform duration-500 ease-in-out"
          />
          <StatsCard
            title="Pending Review"
            value={stats?.pending || 0}
            icon={Clock}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-500"
            className="transition-transform duration-500 ease-in-out"
          />
          <StatsCard
            title="Approved"
            value={stats?.approved || 0}
            icon={CheckCircle}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
            className="transition-transform duration-500 ease-in-out"
          />
        </div>

        {/* Submissions Table */}
        <Card className="transition-all duration-500 ease-in-out transform-gpu">
          <div className="px-6 py-4 border-b border-ms-gray-300 transition-colors duration-300 ease-in-out">
            <h3 className="text-lg font-medium text-ms-gray-900">
              Recent Submissions
            </h3>
          </div>
          <SubmissionTable
            onDelete={handleDeleteSubmission}
            setConfirmDeleteOpen={setConfirmDeleteOpen}
            setConfirmDeleteId={setConfirmDeleteId}
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
    </div>
  );
};

export default Dashboard;
