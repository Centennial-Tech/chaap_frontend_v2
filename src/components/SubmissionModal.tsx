import { CheckCircle } from "lucide-react";
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
  productDescription: string;
}

interface SubmissionModalProps {
  open: boolean;
  formData: FormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onInputChange: (field: keyof FormData, value: string) => void;
  getSubmissionTypesForType: (type: string) => SubmissionTypeOption[];
  hideTargetDate?: boolean;
  questions?: string[];
  questionAnswers?: { [q: string]: string };
  onQuestionAnswerChange?: (q: string, value: string) => void;
  loading?: boolean;
  showSubmissionType?: boolean;
  formSuggestion?: string;
  readyToCreate?: boolean;
  suggestionError?: string;
  allowManualCreate?: boolean;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  open,
  formData,
  onClose,
  onSubmit,
  onTypeChange,
  onInputChange,
  getSubmissionTypesForType,
  hideTargetDate,
  questions = [],
  questionAnswers = {},
  onQuestionAnswerChange,
  loading = false,
  showSubmissionType = true,
  formSuggestion = "",
  readyToCreate = false,
  suggestionError = "",
  allowManualCreate = false,
}) => {
  const [hideQuestions, setHideQuestions] = React.useState(false);
  // Add local state to control hiding of questions after suggestion error
  const [forceHideQuestions, setForceHideQuestions] = React.useState(false);

  React.useEffect(() => {
    if (showSubmissionType && formSuggestion) {
      const timeout = setTimeout(() => setHideQuestions(true), 400);
      return () => clearTimeout(timeout);
    } else {
      setHideQuestions(false);
    }
  }, [showSubmissionType, formSuggestion]);

  React.useEffect(() => {
    if (suggestionError) {
      setForceHideQuestions(true);
    } else {
      setForceHideQuestions(false);
    }
  }, [suggestionError]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
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
        <form
          onSubmit={onSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
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
                onChange={(e) => onInputChange("projectTitle", e.target.value)}
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
            {/* Product Description */}
            <div>
              <label
                htmlFor="productDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Description
              </label>
              <textarea
                id="productDescription"
                value={formData.productDescription}
                onChange={(e) =>
                  onInputChange("productDescription", e.target.value)
                }
                required
                rows={3}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm resize-none"
                placeholder="Explain your product in a few lines... (e.g. 'This is a drug for hypertension', 'This is a wearable device for heart rate monitoring')"
              />
            </div>
            {/* Render questions if present and not hidden or forced hidden by error */}
            {questions.length > 0 && !hideQuestions && !forceHideQuestions && (
              <div className="space-y-4 transition-opacity duration-300 opacity-100">
                <h3 className="text-md font-semibold text-gray-900 mb-2">
                  Additional Questions
                </h3>
                {questions.map((q, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {q}
                    </label>
                    <input
                      type="text"
                      value={questionAnswers[q] || ""}
                      onChange={(e) =>
                        onQuestionAnswerChange &&
                        onQuestionAnswerChange(q, e.target.value)
                      }
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm"
                      placeholder="Your answer..."
                    />
                  </div>
                ))}
              </div>
            )}
            {/* Submission Type - always show if showSubmissionType or suggestionError is set */}
            {(showSubmissionType || suggestionError) && (
              <div className="pt-4">
                {formSuggestion && !suggestionError && (
                  // <div className="mb-2 p-2 rounded bg-blue-50 border border-blue-200 text-blue-800 text-sm font-medium">
                  //   Our suggestion:{" "}
                  //   <span className="font-semibold">{}</span>
                  // </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-2">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">
                          Recommended Form Type
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                          <b>{formSuggestion}</b> - Typically required for
                          products in this category based on their
                          characteristics and stage of development.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <label
                  htmlFor="submissionType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Submission Type
                </label>
                <select
                  id="submissionType"
                  value={formData.submissionType}
                  onChange={(e) =>
                    onInputChange("submissionType", e.target.value)
                  }
                  required
                  disabled={!formData.type}
                  className={`block w-full rounded-md border px-3 py-2 text-sm ${
                    !formData.type
                      ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                >
                  <option value="" disabled>
                    {"Select submission type"}
                  </option>
                  {formSuggestion && !suggestionError && (
                    <option value={formSuggestion}>
                      {formSuggestion || "Select submission type"}
                    </option>
                  )}
                  {getSubmissionTypesForType(formData.type).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Show error if suggestionError is set */}
            {suggestionError && (
              <div className="mt-4 p-2 rounded bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
                {suggestionError}
              </div>
            )}
            {!hideTargetDate && (
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
                  onChange={(e) =>
                    onInputChange("targetSubmission", e.target.value)
                  }
                  required
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
            )}
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
              className="rounded-md bg-[#2094f3] px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 flex items-center justify-center min-w-[90px]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : readyToCreate || allowManualCreate ? (
                "Create"
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionModal;
