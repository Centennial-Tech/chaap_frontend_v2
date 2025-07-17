import { useState, useEffect } from "react";
import { DynamicFormField } from "../components/ui/DynamicFormField";
import { Button } from "../components/ui/Button";
import type { FormQuestion, FormData, FormAnswer } from "../types/form";
import api from "../api";
import { useSubmission } from "../provider/submissionProvider";
import { useNavigate } from "react-router-dom";

export default function FormEditor() {
  const { activeSubmission, submissions, setActiveSubmission } = useSubmission();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [showValidationError, setShowValidationError] = useState(false);
  const [formQuestions, setFormQuestions] = useState<FormQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    if (!activeSubmission) {
      setActiveSubmission(submissions[0]);
    }
  }, [activeSubmission, submissions, setActiveSubmission]);

  useEffect(() => {
    const fetchFormQuestions = async () => {
      if (!activeSubmission) return;
      try {
        setIsLoading(true);
        const response = await api.get(`form/questions/form/${activeSubmission.form_id}`);
        setFormQuestions(response.data);
      } catch (error) {
        console.error("Error fetching form questions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormQuestions();
  }, [activeSubmission]);

  const currentQuestion = formQuestions[currentQuestionIndex];

  const handleInputChange = (fieldId: string, value: any) => {
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

  const handleNext = async () => {
    if (!isCurrentQuestionValid()) {
      setShowValidationError(true);
      return;
    }
    
    if (currentQuestionIndex < formQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowValidationError(false);
    } else {
      setIsSubmitting(true);
      // On last question, prepare submission
      const formAnswer: FormAnswer = {
        form_id: activeSubmission?.form_id || "",
        submission_id: activeSubmission?.id || "",
        data: formData
      };


      const response = await api.post("form/answers", formAnswer);  

      if(response.status === 200) {
        navigate("/document-manager");
      }

      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowValidationError(false);
    }
  };

  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form questions...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-600">
          <p>No form questions available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Main Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Form Editor</h1>
        <p className="text-sm text-gray-600 mt-1">
          Submission: {activeSubmission?.name} | Form: {activeSubmission?.form_id}
        </p>
      </div>

      {/* Question Header */}
      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <div className="mb-2">
          <h2 className="text-xl font-semibold text-gray-800">{currentQuestion.name}</h2>
          <p className="text-base text-gray-600 mt-1">{currentQuestion.title}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Part {currentQuestionIndex + 1} of {formQuestions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / formQuestions.length) * 100)}% Complete</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / formQuestions.length) * 100}%` }}
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
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isSubmitting}
        >
          Previous
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : currentQuestionIndex === formQuestions.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
} 