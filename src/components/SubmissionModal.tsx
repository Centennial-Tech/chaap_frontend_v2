import React from "react";

interface SubmissionTypeOption {
  value: string;
  label: string;
}

interface FormData {
  projectTitle: string;
  type: string;
  submissionType: string;
  targetSubmission: string;
}

interface SubmissionModalProps {
  open: boolean;
  formData: FormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onInputChange: (field: keyof FormData, value: string) => void;
  getSubmissionTypesForType: (type: string) => SubmissionTypeOption[];
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  open,
  formData,
  onClose,
  onSubmit,
  onTypeChange,
  onInputChange,
  getSubmissionTypesForType,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            New Submission
          </h2>
          <button
            className="text-gray-400 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="projectTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Project Title
              </label>
              <input
                id="projectTitle"
                type="text"
                value={formData.projectTitle}
                onChange={(e) => onInputChange('projectTitle', e.target.value)}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm"
                placeholder="Enter project title: "
              />
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={onTypeChange}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="Device">Device</option>
                <option value="Drug">Drug</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="submissionType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Submission Type
              </label>
              <select
                id="submissionType"
                value={formData.submissionType}
                onChange={(e) => onInputChange('submissionType', e.target.value)}
                required
                disabled={!formData.type}
                className={`block w-full rounded-md border px-3 py-2 text-sm ${
                  !formData.type 
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                }`}
              >
                <option value="" disabled>
                  {!formData.type ? "Please select a type first" : "Select submission type"}
                </option>
                {getSubmissionTypesForType(formData.type).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="targetSubmission"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Target Submission Date
              </label>
              <input
                id="targetSubmission"
                type="date"
                value={formData.targetSubmission}
                onChange={(e) => onInputChange('targetSubmission', e.target.value)}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 px-6 py-4 border-t">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#2094f3] px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionModal; 