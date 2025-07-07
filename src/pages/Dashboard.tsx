import React, { useState, useRef } from "react";
import { Plus, CheckCircle, Clock, FileText } from "lucide-react";
import { useAuth } from "../provider/authProvider";
import SubmissionModal from "../components/SubmissionModal";
import SubmissionTable from "../components/SubmissionTable";
import StatsCard from "../components/StatsCard";
import {
  type Submission,
  fetchSubmissions,
  sortSubmissionsByDate,
  createSubmission,
  deleteSubmission,
  calculateStats,
  getFormSuggestion,
} from "../helpers/submissionApiHelper";
import { getSubmissionTypesForType } from "../constants";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import Modal from "../components/ui/Modal";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [submissionToDelete, setSubmissionToDelete] = React.useState<string | null>(null);

  const fetchSubmissionsData = async () => {
    if (!user) return;
    try {
      const data = await fetchSubmissions(user.id);
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  React.useEffect(() => {
    fetchSubmissionsData();
  }, []);

  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    type: "",
    submissionType: "",
    end_time: "",
    productDescription: "",
  });

  const [questions, setQuestions] = React.useState<string[]>([]);
  const [questionAnswers, setQuestionAnswers] = React.useState<{
    [q: string]: string;
  }>({});
  // Add ref to track latest questionAnswers for async operations
  const questionAnswersRef = useRef<{ [q: string]: string }>({});
  const [formSuggestion, setFormSuggestion] = React.useState("");
  const [suggestionError, setSuggestionError] = useState("");
  const [readyToCreate, setReadyToCreate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  // Track if user can skip suggestion and go to create after error
  const [allowManualCreate, setAllowManualCreate] = React.useState(false);

  // Derived state - Sort submissions by last updated (most recent first)
  const sortedSubmissions = React.useMemo(() => {
    return sortSubmissionsByDate(submissions);
  }, [submissions]);

  const stats = React.useMemo(() => calculateStats(submissions), [submissions]);

  // Sync questionAnswersRef with questionAnswers state
  React.useEffect(() => {
    questionAnswersRef.current = questionAnswers;
  }, [questionAnswers]);

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

  const handleDeleteSubmission = React.useCallback(async (id: string) => {
    try {
      await deleteSubmission(id);
      await fetchSubmissionsData();
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      type: "",
      submissionType: "",
      end_time: "",
      productDescription: "",
    });
    setQuestions([]);
    setQuestionAnswers({});
    setFormSuggestion("");
    setSuggestionError("");
    setReadyToCreate(false);
    setAllowManualCreate(false);
    setLoading(false);
  };

  const handleDeleteClick = (id: string) => {
    setSubmissionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (submissionToDelete) {
      await handleDeleteSubmission(submissionToDelete);
      setIsDeleteModalOpen(false);
      setSubmissionToDelete(null);
    }
  };

  const handleCreateSubmission = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      try {
        // TODO: Add your final API calls here before creating the submission
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
          questionAnswers: questionAnswersRef.current, // Use ref for latest answers
        };

        await createSubmission(newSubmission);
        await fetchSubmissionsData();
        // setSubmissions((prev) => [newSubmission, ...prev]);
        handleClose();
      } catch (error) {
        console.error("Error creating submission:", error);
      } finally {
        setLoading(false);
      }
    },
    [formData, handleClose] // Remove questionAnswers from deps, use ref instead
  );

  const handleFormSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (questions.length === 0) {
        setLoading(true);
        try {
          // First submit: get questions from API
          const data = await getFormSuggestion(formData.type, formData.productDescription);
          
          setQuestions(data.questions || []);
          setFormSuggestion(data.suggestion || "");
          setSuggestionError("");
          setReadyToCreate(true);
        } catch (error) {
          console.error("Error getting form suggestion:", error);
          setSuggestionError("Failed to get form suggestion");
          setReadyToCreate(false);
        } finally {
          setLoading(false);
        }
        // Don't close modal yet, let user answer questions
        return;
      }
      // Second submit: save submission with answers
      await handleCreateSubmission(e);
      // Now show the submissionType field with default value from formSuggestion
      return;
    },
    [formData, questions, handleCreateSubmission] // Remove questionAnswers from deps, use ref instead
  );

  const handleQuestionAnswerChange = React.useCallback(
    (question: string, value: string) => {
      setQuestionAnswers((prev) => {
        const updated = { ...prev, [question]: value };
        console.log("handleQuestionAnswerChange", updated);
        return updated;
      });
    },
    []
  );

  const handleInputChange = React.useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
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
      setFormSuggestion("");
      setSuggestionError("");
      setReadyToCreate(false);
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your submissions and compliance documentation
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Submissions"
            value={stats.total}
            icon={FileText}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Draft Submissions"
            value={stats.drafts}
            icon={FileText}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatsCard
            title="In Progress"
            value={stats.in_progress}
            icon={Clock}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Submission
          </Button>
        </div>

        {/* Submissions Table */}
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Submissions
            </h2>
          </div>
          <SubmissionTable
            submissions={sortedSubmissions}
            onDelete={handleDeleteClick}
            onView={(submission) => {
              // TODO: Implement view functionality
              console.log("View submission:", submission);
            }}
            onEdit={(submission) => {
              // TODO: Implement edit functionality
              console.log("Edit submission:", submission);
            }}
          />
        </Card>

        {/* Submission Modal */}
        <SubmissionModal
          open={isModalOpen}
          formData={formData}
          onClose={handleClose}
          onSubmit={readyToCreate ? handleCreateSubmission : handleFormSubmit}
          onTypeChange={handleTypeChange}
          onInputChange={handleInputChange}
          questions={questions}
          questionAnswers={questionAnswers}
          onQuestionAnswerChange={handleQuestionAnswerChange}
          loading={loading}
          readyToCreate={readyToCreate}
          formSuggestion={formSuggestion}
          suggestionError={suggestionError}
          allowManualCreate={allowManualCreate}
          getSubmissionTypesForType={getSubmissionTypesForType}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete"
          maxWidth="max-w-md"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this submission? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
