import { CheckCircle } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Modal from "./ui/Modal";
import { Button } from "./ui/Button";
import { productTypes } from "../constants";
import api from "../api";
import { useSubmission } from "../provider/submissionProvider";
import { createSubmission, type Submission } from "../helpers/submissionApiHelper";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  type: string;
  submissionType: string;
  end_time: string;
  productDescription: string;
}

interface SubmissionModalProps {
  open: boolean;
  onClose: () => void;
}

const SubmissionModal: React.FC<SubmissionModalProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();
  const { refreshSubmissions, setActiveSubmission } = useSubmission();
  const [hideQuestions, setHideQuestions] = React.useState(false);
  const [forceHideQuestions, setForceHideQuestions] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [formSuggestion, setFormSuggestion] = useState<string>("");
  const [suggestionError, setSuggestionError] = useState("");
  const [readyToCreate, setReadyToCreate] = useState(false);
  const [allowManualCreate, setAllowManualCreate] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<{[q: string]: string}>({});
  const questionAnswersRef = useRef<{ [q: string]: string }>({});
  const [createdSubmission, setCreatedSubmission] = useState<Submission | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "",
    submissionType: "",
    end_time: "",
    productDescription: "",
  });

  // Compute showSubmissionType internally
  const showSubmissionType = !!formSuggestion || !!suggestionError;
  const canCreate = readyToCreate || allowManualCreate;

  const resetForm = () => {
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
    setFormSuggestion("");
    setSuggestionError("");
    setReadyToCreate(false);
    setAllowManualCreate(false);
    setCreatedSubmission(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSaveAndClose = () => {
    if (createdSubmission) {
      setActiveSubmission(createdSubmission);
      handleClose();
    }
  };

  const handleSaveAndContinue = () => {
    if (createdSubmission) {
      setActiveSubmission(createdSubmission);
      handleClose();
      navigate('/form-editor');
    }
  };

  const handleCreateSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formId = (await api.get(`form/name/${formData.submissionType}`)).data.id;

      const newSubmission: Partial<Submission> = {
        name: formData.name.trim(),
        submission_type: formData.submissionType,
        end_time: formData.end_time,
        intended_use: formData.productDescription,
        product_type: formData.type,
        form_id: formId,
      };

      const submission = await createSubmission(newSubmission);
      await refreshSubmissions();
      setCreatedSubmission(submission);
    } catch (error) {
      console.error("Error creating submission:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formSuggestion) {
      setReadyToCreate(true);
    } else {
      setReadyToCreate(false);
    }
  }, [formSuggestion]);

  useEffect(() => {
    questionAnswersRef.current = questionAnswers;
  }, [questionAnswers]);

  useEffect(() => {
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

  useEffect(() => {
    if (showSubmissionType && formSuggestion) {
      const timeout = setTimeout(() => setHideQuestions(true), 400);
      return () => clearTimeout(timeout);
    } else {
      setHideQuestions(false);
    }
  }, [showSubmissionType, formSuggestion]);

  useEffect(() => {
    if (suggestionError) {
      setForceHideQuestions(true);
    } else {
      setForceHideQuestions(false);
    }
  }, [suggestionError]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "type") {
        updated.submissionType = "";
      }
      return updated;
    });
  };

  const handleQuestionAnswerChange = (q: string, value: string) => {
    setQuestionAnswers((prev) => {
      const updated = { ...prev, [q]: value };
      return updated;
    });
  };

  const handleAdditionalQuestionsSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuggestionError("");
    let suggestion = "";
    let response;
    let attempts = 0;
    try {
      do {
        const answers = { ...questionAnswersRef.current };
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
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (questions.length === 0) {
      setLoading(true);
      try {
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
      return;
    }
    await handleAdditionalQuestionsSubmission(e);
    return;
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title="New Submission"
      maxWidth="max-w-2xl"
      maxHeight="max-h-[90vh]"
      showCloseButton={!createdSubmission}
    >
      <form
        onSubmit={!canCreate ? handleFormSubmit : handleCreateSubmission}
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
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              disabled={!!createdSubmission}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500"
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
              onChange={(e) => handleInputChange("type", e.target.value)}
              required
              disabled={!!createdSubmission}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500"
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
                handleInputChange("productDescription", e.target.value)
              }
              required
              rows={3}
              disabled={!!createdSubmission}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm resize-none disabled:bg-gray-100 disabled:text-gray-500"
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
                      handleQuestionAnswerChange(q, e.target.value)
                    }
                    disabled={!!createdSubmission}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500"
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
                  handleInputChange("submissionType", e.target.value)
                }
                required
                disabled={!formData.type || !!createdSubmission}
                className={`block w-full rounded-md border px-3 py-2 text-sm ${
                  !formData.type || !!createdSubmission
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
                onChange={(e) => handleInputChange("end_time", e.target.value)}
                required
                disabled={!!createdSubmission}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          )}
        </div>
        <div className="flex justify-between gap-2 pt-4 border-t mt-4">
          {!createdSubmission ? (
            <>
              <Button type="button" variant="outline" onClick={handleClose}>
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
                ) : !canCreate ? (
                  "Continue"
                ) : (
                  "Create Submission"
                )}
              </Button>
            </>
          ) : (
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveAndClose}
                className="min-w-[120px]"
              >
                Save & Close
              </Button>
              <Button
                type="button"
                onClick={handleSaveAndContinue}
                className="bg-[#2094f3] hover:bg-blue-800 text-white min-w-[120px]"
              >
                Save & Continue
              </Button>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default SubmissionModal;
