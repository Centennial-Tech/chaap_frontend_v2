import { useState, useEffect, useCallback } from "react";
import { DynamicFormField } from "../components/ui/DynamicFormField";
import { Button } from "../components/ui/Button";
import type { FormQuestion, FormData} from "../types/form";
import api from "../api";
import { useSubmission } from "../provider/submissionProvider";

export default function FormEditor() {
  const { activeSubmission, submissions, setActiveSubmission, refreshSubmissions } = useSubmission();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [showValidationError, setShowValidationError] = useState(false);
  const [formQuestions, setFormQuestions] = useState<FormQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedFields, setCompletedFields] = useState(0);
  const [totalFields, setTotalFields] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingSubmission, setIsChangingSubmission] = useState(false);

  const countFields = useCallback(() => {
    let totalCount = 0;
    let completedCount = 0;

    if (formQuestions.length > 0 && formQuestions[currentQuestionIndex]?.data) {
      totalCount = Object.keys(formQuestions[currentQuestionIndex].data).length;
      for(const key in formQuestions[currentQuestionIndex].data) {
        if(formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          completedCount++;
        }
      }
    }
    
    setTotalFields(totalCount);
    setCompletedFields(completedCount);
  }, [formQuestions, formData, currentQuestionIndex]);

  // Update counts whenever form data or questions change
  useEffect(() => {
    countFields();
  }, [formData, formQuestions, currentQuestionIndex, countFields]);

  useEffect(() => {
    const fetchFormQuestions = async () => {
      if (!activeSubmission && submissions.length > 0) {
        setActiveSubmission(submissions[0]);
        return;
      }
      if(!activeSubmission) return;

      try {
        setIsLoading(true);
        const response = await api.get(`/form/questions/?form_id=${activeSubmission.form_id}`);
        setFormQuestions(response.data);
        countFields();
      } catch (error) {
        console.error("Error fetching form questions:", error);
        setFormQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormQuestions();
    
  }, [activeSubmission]);

  const currentQuestion = formQuestions[currentQuestionIndex];

  useEffect(() => {
    const fetchQuestionAnswers = async () => {
      if(!activeSubmission || !currentQuestion) return;
      try {
        // Clear previous question's data before fetching new question
        setFormData({});
        
        const response = await api.get(`/form/answers/${activeSubmission.id}/${currentQuestion.id}`);
        if(response.status === 200) {
          // Set only this question's data
          setFormData(response.data.data || {});
        }
      } catch (error) {
        console.error("Error fetching question answers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestionAnswers();
  }, [currentQuestion]);


  const handleInputChange = (fieldId: string, value: string | string[] | boolean | number | null) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    setShowValidationError(false);
  };

  const isCurrentQuestionValid = (): boolean => {
    if (!currentQuestion) return true;
    
    return Object.entries(currentQuestion.data).every(([fieldId, field]) => {
      if (!field.required) return true;
      
      const value = formData[fieldId];
      if (field.type === 'checkbox') {
        return value === true;
      }
      return value && String(value).trim() !== "";
    });

  };

  const updateSubmissionProgress = async () => { 
    if (!activeSubmission) return;
    if (activeSubmission.progress === calculateProgress()) return;

    await api.put(`/applications/${activeSubmission.id}`, {
      ...activeSubmission,
      progress: calculateProgress()
    });
    refreshSubmissions();
  }

  const calculateProgress = useCallback(() => {
    const currentQuestionProgress = (completedFields / totalFields)
    const rawProgress =  (currentQuestionIndex + currentQuestionProgress) / formQuestions.length;
    return Math.round(rawProgress * 100);
  }, [completedFields, totalFields, currentQuestionIndex, formQuestions.length]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.put(`/form/answers/${activeSubmission?.id}/${currentQuestion?.id}`, 
        formData);
      await updateSubmissionProgress();
    } catch (error) {
      console.error("Error saving answer:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadZip = async (downloadLink: string) => {
    try {
  
      const a = document.createElement('a');
      a.href = downloadLink;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      // window.URL.revokeObjectURL(do); // Clean up
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  
  const handleNext = async () => {
    if (!isCurrentQuestionValid()) {
      setShowValidationError(true);
      return;
    }
    
    if (currentQuestionIndex < formQuestions.length - 1) { //TODO: fix this
      // Save current question's data
      await api.put(`/form/answers/${activeSubmission?.id}/${currentQuestion?.id}`, 
        formData);
      await updateSubmissionProgress();
      
      // Move to next question (this will trigger fetchQuestionAnswers)
      setCurrentQuestionIndex(prev => prev + 1);
      setShowValidationError(false);
    } else {
      await api.put(`/form/answers/${activeSubmission?.id}/${currentQuestion?.id}`, 
        formData);
      
      setIsSubmitting(true);
      const response = await api.post(`/pdf_fill/application/${activeSubmission?.id}`)
      const downloadLink = response.data.pdf_url

      await downloadZip(downloadLink)
      setIsSubmitting(false);
    }
  };

  const handlePrevious = async () => {
    if (currentQuestionIndex > 0) {
      // Save current question's data before moving
      await api.put(`/form/answers/${activeSubmission?.id}/${currentQuestion?.id}`, 
        formData);
      await updateSubmissionProgress();
      
      // Move to previous question (this will trigger fetchQuestionAnswers)
      setCurrentQuestionIndex(prev => prev - 1);
      setShowValidationError(false);
    }
  };

  const handleSubmissionChange = async (submissionId: string) => {
    const newSubmission = submissions.find(s => s.id === submissionId);
    if (newSubmission) {
      setIsChangingSubmission(true);
      try {
        // Save current form data if any
        if (activeSubmission && currentQuestion) {
          await api.put(`/form/answers/${activeSubmission.id}/${currentQuestion.id}`, formData);
          await updateSubmissionProgress();
        }
        
        // Reset states
        setCurrentQuestionIndex(0);
        setFormData({});
        setShowValidationError(false);
        
        // Set new submission
        setActiveSubmission(newSubmission);
      } catch (error) {
        console.error("Error changing submission:", error);
      } finally {
        setIsChangingSubmission(false);
      }
    }
  };

  // Extract the header component for reuse
  const FormHeader = () => (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Form Editor</h1>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-4">
          <select
            value={activeSubmission?.id || ''}
            onChange={(e) => handleSubmissionChange(e.target.value)}
            disabled={isChangingSubmission || isSubmitting || isSaving}
            className="block w-64 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="" disabled>Select a submission</option>
            {submissions.map((submission) => (
              <option key={submission.id} value={submission.id}>
                {submission.name} ({submission.submission_type})
              </option>
            ))}
          </select>
          {isChangingSubmission && (
            <span className="text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 inline-block mr-2"></div>
              Changing submission...
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="flex gap-6 max-w-[1200px] w-full">
          <div className="flex-1 min-w-0">
            <div className="px-4 py-8">
              <FormHeader />
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading form questions...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion || formQuestions.length === 0) {
    return (
      <div className="flex justify-center">
        <div className="flex gap-6 max-w-[1200px] w-full">
          <div className="flex-1 min-w-0">
            <div className="px-4 py-8">
              <FormHeader />
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-600">
                  <p className="mb-2">No form questions available for this submission.</p>
                  <p className="text-sm">Please select a different submission or contact support if you believe this is an error.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="flex gap-6 max-w-[1200px] w-full">
        {/* Main Form Content */}
        <div className="flex-1 min-w-0">
          <div className="px-4 py-8">
            <FormHeader />

            {/* Question Header */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <div className="mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{currentQuestion.name}</h2>
                <p className="text-base text-gray-600 mt-1">{currentQuestion.title}</p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Part {currentQuestionIndex + 1} of {formQuestions.length}</span>
                <span>{calculateProgress()}% Complete</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="space-y-6">
                {Object.entries(currentQuestion.data).map(([fieldId, field]) => (
                  <DynamicFormField
                    key={fieldId}
                    id={fieldId}
                    field={field}
                    value={formData[fieldId] || ''}
                    onChange={(value) => handleInputChange(fieldId, value)}
                    error={showValidationError && field.required && !formData[fieldId]}
                  />
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || isSubmitting || isSaving}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={isSubmitting || isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                
                <Button 
                  onClick={handleNext}
                  disabled={isSubmitting || isSaving}
                >
                  {isSubmitting ? 'Saving...' : currentQuestionIndex === formQuestions.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Menu - Fixed Width */}
        <div className="w-44 shrink-0">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg shadow-lg border border-gray-100">
              <div className="p-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Form Sections</h3>
                <div className="space-y-1">
                  {formQuestions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors
                        ${currentQuestionIndex === index 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px]
                          ${currentQuestionIndex === index 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-600'}`}
                        >
                          {index + 1}
                        </span>
                        <span className="truncate text-xs">{question.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 