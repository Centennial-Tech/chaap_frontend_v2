import {
  CheckCircle,
  Clock,
  FileText,
  Lock,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import React from "react";
import StatsCard from "../components/StatsCard";
import SubmissionModal from "../components/SubmissionModal";
import SubmissionTable from "../components/SubmissionTable";

// Types
interface Submission {
  id: number;
  project: string;
  type: "Device" | "Drug";
  submissionType: string;
  targetSubmission: string;
  status: "draft" | "pending" | "approved" | "rejected";
  progress: number;
  updatedAt: string;
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
  draft: { text: "Draft", color: "bg-blue-100 text-blue-800" },
  pending: { text: "Pending", color: "bg-orange-100 text-orange-800" },
  approved: { text: "Approved", color: "bg-green-100 text-green-800" },
  rejected: { text: "Rejected", color: "bg-red-100 text-red-800" },
} as const;


// Utility functions
const getSubmissionTypesForType = (selectedType: string): SubmissionTypeOption[] => {
  return SUBMISSION_TYPES[selectedType as keyof typeof SUBMISSION_TYPES] || [];
};

const getStatusConfig = (status: string) => {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || 
    { text: status, color: "bg-gray-100 text-gray-800" };
};

const calculateStats = (submissions: Submission[]): Stats => {
  const drafts = submissions.filter(s => s.status === "draft").length;
  const pending = submissions.filter(s => s.status === "pending").length;
  const approved = submissions.filter(s => s.status === "approved").length;
  const total = submissions.length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
  
  return { drafts, pending, approved, total, approvalRate };
};

const generateNewId = (submissions: Submission[]): number => {
  return submissions.length ? Math.max(...submissions.map(s => s.id)) + 1 : 1;
};

// Initial data
const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 1,
    project: "CardioSense Monitor",
    type: "Device",
    submissionType: "PMA (Premarket Approval)",
    targetSubmission: "2024-06-01T10:30:00Z",
    status: "approved",
    progress: 100,
    updatedAt: "2024-06-01T10:30:00Z",
  },
  {
    id: 2,
    project: "ThermoScan Pro",
    type: "Device",
    submissionType: "510k (Premarket Notification)",
    targetSubmission: "2024-06-30T14:45:00Z",
    status: "pending",
    progress: 80,
    updatedAt: "2024-06-02T14:45:00Z",
  },
  {
    id: 3,
    project: "Adestunore",
    type: "Drug",
    submissionType: "NDA (New Drug Application)",
    targetSubmission: "2024-05-28T16:10:00Z",
    status: "approved",
    progress: 100,
    updatedAt: "2024-05-28T16:10:00Z",
  },
  {
    id: 4,
    project: "PulseOx 2000",
    type: "Device",
    submissionType: "510k (Premarket Notification)",
    targetSubmission: "2024-07-15T09:20:00Z",
    status: "draft",
    progress: 40,
    updatedAt: "2024-06-03T09:20:00Z",
  },
  {
    id: 5,
    project: "Hicesterol",
    type: "Drug",
    submissionType: "IND (Investigational New Drug)",
    targetSubmission: "2024-05-28T16:10:00Z",
    status: "draft",
    progress: 0,
    updatedAt: "2024-05-28T16:10:00Z",
  },
];

const Dashboard = () => {
  // State management
  const [open, setOpen] = React.useState(false);
  const [submissions, setSubmissions] = React.useState<Submission[]>(INITIAL_SUBMISSIONS);
  
  // Form state
  const [formData, setFormData] = React.useState({
    projectTitle: "",
    type: "",
    submissionType: "",
    targetSubmission: "",
  });

  // Derived state
  const stats = React.useMemo(() => calculateStats(submissions), [submissions]);

  // Event handlers
  const handleDeleteSubmission = React.useCallback((id: number) => {
    setSubmissions(prev => prev.filter(s => s.id !== id));
  }, []);

  const handleOpen = React.useCallback(() => setOpen(true), []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    setFormData({
      projectTitle: "",
      type: "",
      submissionType: "",
      targetSubmission: "",
    });
  }, []);

  const handleFormSubmit = React.useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newSubmission: Submission = {
      id: generateNewId(submissions),
      project: formData.projectTitle,
      type: formData.type as "Device" | "Drug",
      submissionType: formData.submissionType,
      targetSubmission: formData.targetSubmission,
      status: "draft",
      progress: 0,
      updatedAt: new Date().toISOString(),
    };

    setSubmissions(prev => [newSubmission, ...prev]);
    handleClose();
  }, [formData, submissions, handleClose]);

  const handleTypeChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setFormData(prev => ({
      ...prev,
      type: newType,
      submissionType: "", // Reset submission type when type changes
    }));
  }, []);

  const handleInputChange = React.useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="space-y-8 flex flex-col flex-1 p-6 min-h-screen bg-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
          <p className="text-gray-700 mt-1">
            Manage your submissions and compliance documentation
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-[#2094f3] hover:bg-blue-800 text-white font-medium"
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
          title="Active Submissions"
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
          submissions={submissions}
          onDelete={handleDeleteSubmission}
          getStatusConfig={getStatusConfig}
        />
      </Card>

      {/* Security & Compliance Panel */}
      <Card>
        <div className="px-6 py-4 border-b border-ms-gray-300">
          <h3 className="text-lg font-medium text-ms-gray-900">Security & Compliance</h3>
          <p className="text-sm text-ms-gray-700 mt-1">Enterprise-grade security features and compliance monitoring</p>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* SSO Status */}
            <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">SSO Authentication</h4>
                <p className="text-sm text-green-600">Active & Secured</p>
                <p className="text-xs text-gray-700 mt-1">Azure AD Integration</p>
              </div>
            </div>

            {/* Data Encryption */}
            <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Data Encryption</h4>
                <p className="text-sm text-blue-600">AES-256 Enabled</p>
                <p className="text-xs text-gray-700 mt-1">End-to-end encrypted</p>
              </div>
            </div>

            {/* Audit Logging */}
            <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Audit Logging</h4>
                <p className="text-sm text-orange-600">All Actions Logged</p>
                <p className="text-xs text-gray-700 mt-1">
                  Last entry: N/A
                </p>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Modal */}
      <SubmissionModal
        open={open}
        formData={formData}
        onClose={handleClose}
        onSubmit={handleFormSubmit}
        onTypeChange={handleTypeChange}
        onInputChange={handleInputChange}
        getSubmissionTypesForType={getSubmissionTypesForType}
      />
    </div>
  );
};

export default Dashboard;
