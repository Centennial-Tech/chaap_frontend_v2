// Constants for the application
export const Config = {
  API: import.meta.env.VITE_API_URL,
};

export interface SubmissionTypeOption {
  value: string;
  label: string;
}

export const SUBMISSION_TYPES = {
  Device: [
    { value: "510k", label: "510(k) - Premarket Notification" },
    { value: "PMA", label: "PMA - Premarket Approval" },
    { value: "DeNovo", label: "De Novo - Novel Device Classification" },
  ] as SubmissionTypeOption[],
  Drug: [
    { value: "IND", label: "IND - Investigational New Drug" },
    { value: "NDA", label: "NDA - New Drug Application" },
    { value: "ANDA", label: "ANDA - Abbreviated New Drug Application" },
    { value: "BLA", label: "BLA - Biologics License Application" },
  ] as SubmissionTypeOption[],
};

export const getSubmissionTypesForType = (type: string): SubmissionTypeOption[] => {
  return SUBMISSION_TYPES[type as keyof typeof SUBMISSION_TYPES] || [];
};
