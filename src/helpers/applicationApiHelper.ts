import api from "../api";

// Application interface matching the CouchDB document format
export interface Application {
  // CouchDB metadata fields
  _attachments?: string;
  _etag?: string;
  _rid?: string;
  _self?: string;
  _ts?: number;
  
  // Application data fields
  id: string;
  application_id: string;
  name: string; // Maps to project
  status: "draft" | "in_progress" | "completed";
  progress: number;
  updated_at: string;
  start_time: string;
  end_time?: string | null; // Maps to targetSubmission
  user_id: string;
  username: string;
  screening_responses?: string;
  form_id?: string | null;
  active: boolean;
  submissionType?: string;
  
  // Optional fields for backward compatibility
  productDescription?: string;
  type?: "Device" | "Drug";
}

// Stats interface
export interface Stats {
  drafts: number;
  in_progress: number;
  completed: number;
  total: number;
  completionRate: number;
}

// Status configuration
export const STATUS_CONFIG = {
  draft: { text: "Draft", color: "bg-blue-500" },
  in_progress: { text: "In Progress", color: "bg-orange-500" },
  completed: { text: "Completed", color: "bg-green-500" },
} as const;

// Utility functions
export const getStatusConfig = (status: string) => {
  return (
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
      text: status,
      color: "bg-gray-500",
    }
  );
};

export const calculateStats = (applications: Application[]): Stats => {
  const drafts = applications.filter((s) => s.status === "draft").length;
  const in_progress = applications.filter((s) => s.status === "in_progress").length;
  const completed = applications.filter((s) => s.status === "completed").length;
  const total = applications.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { drafts, in_progress, completed, total, completionRate };
};

export const sortApplicationsByDate = (applications: Application[]): Application[] => {
  return [...applications].sort((a, b) => {
    const dateA = new Date(a.updated_at || "").getTime();
    const dateB = new Date(b.updated_at || "").getTime();
    return dateB - dateA;
  });
};

// API functions
export const fetchApplications = async (userId: string): Promise<Application[]> => {
  try {
    const response = await api.get(`/applications/userId?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};

export const createApplication = async (applicationData: Partial<Application>): Promise<Application> => {
  try {
    const response = await api.post("/applications/", applicationData);
    return response.data;
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
};

export const updateApplication = async (applicationId: string, applicationData: Partial<Application>): Promise<Application> => {
  try {
    const response = await api.put(`/applications/${applicationId}`, applicationData);
    return response.data;
  } catch (error) {
    console.error("Error updating application:", error);
    throw error;
  }
};

export const deleteApplication = async (applicationId: string): Promise<void> => {
  try {
    await api.delete(`/applications/${applicationId}`);
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
};

export const getApplicationById = async (applicationId: string): Promise<Application> => {
  try {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching application by ID:", error);
    throw error;
  }
};

// Legacy exports for backward compatibility
export type Submission = Application;
export const fetchSubmissions = fetchApplications;
export const createSubmission = createApplication;
export const updateSubmission = updateApplication;
export const deleteSubmission = deleteApplication;
export const getSubmissionById = getApplicationById;
export const sortSubmissionsByDate = sortApplicationsByDate; 