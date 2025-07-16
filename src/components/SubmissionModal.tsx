import { CheckCircle } from "lucide-react";
import React from "react";
import Modal from "./ui/Modal";
import { Button } from "./ui/Button";
import { productTypes } from "../constants";

interface FormData {
  name: string;
  type: string;
  submissionType: string;
  end_time: string;
  productDescription: string;
}

interface SubmissionModalProps {
  open: boolean;
  formData: FormData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onInputChange: (field: keyof FormData, value: string) => void;
  questions?: string[];
  questionAnswers?: { [q: string]: string };
  onQuestionAnswerChange?: (q: string, value: string) => void;
  loading?: boolean;
  formSuggestion?: string;
  canCreate?: boolean;
  suggestionError?: string;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  open,
  formData,
  onClose,
  onSubmit,
  onInputChange,
  questions = [],
  questionAnswers = {},
  onQuestionAnswerChange,
  loading = false,
  formSuggestion = "",
  canCreate = false,
  suggestionError = "",
}) => {
  const [hideQuestions, setHideQuestions] = React.useState(false);
  // Add local state to control hiding of questions after suggestion error
  const [forceHideQuestions, setForceHideQuestions] = React.useState(false);

  // Compute showSubmissionType internally
  const showSubmissionType = !!formSuggestion || !!suggestionError;

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

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="New Submission"
      maxWidth="max-w-2xl"
      maxHeight="max-h-[90vh]"
      showCloseButton={true}
    >
      <form
        onSubmit={onSubmit}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="space-y-4 flex-1 overflow-y-auto">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder="Enter drug/device name: "
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
              onChange={(e) => onInputChange("type", e.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="" disabled>
                Select type
              </option>
              {productTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
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
                        products in this category based on their characteristics
                        and stage of development.
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
                  <option value={formSuggestion}>{formSuggestion}</option>
                )}
                {suggestionError && (
                  <option value="">Please select manually</option>
                )}
              </select>
            </div>
          )}
          {/* Show error if suggestionError is set */}
          {suggestionError && (
            <div className="mt-4 p-2 rounded bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
              {suggestionError}
            </div>
          )}
          {canCreate && (
            <div>
              <label
                htmlFor="end_time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Target Submission Date
              </label>
              <input
                id="end_time"
                type="date"
                value={formData.end_time}
                onChange={(e) => onInputChange("end_time", e.target.value)}
                required
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#2094f3] hover:bg-blue-800 text-white min-w-[90px]"
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
            ) : canCreate ? (
              "Create"
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SubmissionModal;
