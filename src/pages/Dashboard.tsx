import { CheckCircle, Clock, FileText } from "lucide-react";
import { Card } from "../components/ui/Card";
import React, { useEffect } from "react";
import StatsCard from "../components/StatsCard";
import ApplicationModal from "../components/ApplicationModal";
import ApplicationTable from "../components/ApplicationTable";
import { useAuth } from "../provider/authProvider";
import {
  type Application,
  getStatusConfig,
  calculateStats,
  fetchApplications,
  sortApplicationsByDate,
  createApplication,
} from "../helpers/applicationApiHelper";

const Dashboard = () => {
  // State management
  const [open, setOpen] = React.useState(false);
  const [applications, setApplications] = React.useState<Application[]>([]);
  const { user } = useAuth();

  const fetchApplicationsData = async () => {
    try {
      if (user?.id) {
        const data = await fetchApplications(user.id);
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };
  useEffect(() => {
    fetchApplicationsData();
  }, [user?.id]);

  // Form state (update type to match new fields)
  type FormData = {
    name: string;
    type: string;
    end_time: string;
    productDescription: string;
  };

  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    type: "",
    end_time: "",
    productDescription: "",
  });

  // Add state for generated questions and their answers
  const [questions, setQuestions] = React.useState<string[]>([]);
  const [questionAnswers, setQuestionAnswers] = React.useState<{
    [q: string]: string;
  }>({});
  // Add loading state for API call
  const [loading, setLoading] = React.useState(false);

  // Track if we are in the final create step
  const [readyToCreate, setReadyToCreate] = React.useState(false);

  // Derived state - Sort applications by last updated (most recent first)
  const sortedApplications = React.useMemo(() => {
    return sortApplicationsByDate(applications);
  }, [applications]);

  const stats = React.useMemo(() => calculateStats(applications), [applications]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleDeleteApplication = React.useCallback(async (id: string) => {
    console.log("Delete button clicked for application ID:", id);
    console.log("Delete functionality is currently disabled - no action taken");
    // No API call or state changes - just log that the button was clicked
  }, []);

  const handleOpen = React.useCallback(() => setOpen(true), []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    setFormData({
      name: "",
      type: "",
      end_time: "",
      productDescription: "",
    });
    setQuestions([]);
    setQuestionAnswers({});
    setLoading(false);
    setReadyToCreate(false);
  }, []);

  const handleCreateApplication = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      // TODO: Add your final API calls here before creating the application
      // Example:
      // await api.post('/your/endpoint', { ... });
      // await api.post('/another/endpoint', { ... });
      // Add your API logic below this comment
      const newApplication: Partial<Application> = {
        name: formData.name,
        type: formData.type as "Device" | "Drug",
        end_time: "",
        status: "draft",
        progress: 0,
        updated_at: new Date().toISOString(),
        productDescription: formData.productDescription,
        screening_responses: JSON.stringify(questionAnswers),
      };

      await createApplication(newApplication);
      await fetchApplicationsData();
      // setApplications((prev) => [newApplication, ...prev]);
      setQuestions([]);
      setQuestionAnswers({});
      setReadyToCreate(false);
      setLoading(false);
      handleClose();
    },
    [formData, applications, handleClose]
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
          const responseData = await response.json();
          const qs =
            responseData?.questions
              ?.match(/- (.+?)(?=\n|$)/g)
              ?.map((q: any) => q.replace(/^\-\s*/, "")) || [];
          setQuestions(qs);
        } finally {
          setLoading(false);
        }
        // Don't close modal yet, let user answer questions
        return;
      }
      // Second submit: save application with answers
      await handleCreateApplication(e);
      // Now show the applicationType field with default value from formSuggestion
      return;
    },
    [formData, applications, handleClose, questions]
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
            Manage your applications and compliance documentation
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
          New Application
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <StatsCard
          title="Draft Applications"
          value={stats?.drafts || 0}
          icon={FileText}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="In Progress"
          value={stats?.in_progress || 0}
          icon={Clock}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Completed"
          value={stats?.completed || 0}
          icon={CheckCircle}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Applications Table */}
      <Card>
        <div className="px-6 py-4 border-b border-ms-gray-300">
          <h3 className="text-lg font-medium text-ms-gray-900">
            Your Applications
          </h3>
        </div>
        <ApplicationTable
          applications={sortedApplications}
          onDelete={handleDeleteApplication}
        />
      </Card>

      {/* Modal */}
      <ApplicationModal
        open={open}
        formData={formData}
        onClose={handleClose}
        onSubmit={readyToCreate ? handleCreateApplication : handleFormSubmit}
        onTypeChange={handleTypeChange}
        onInputChange={handleInputChange}
        hideEndTime
        questions={questions}
        questionAnswers={questionAnswers}
        onQuestionAnswerChange={handleQuestionAnswerChange}
        loading={loading}
        readyToCreate={readyToCreate}
      />
    </div>
  );
};

export default Dashboard;
