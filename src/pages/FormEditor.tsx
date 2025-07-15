import { useState, useEffect } from "react";
import { FormSection } from "../components/ui/FormSection";
import { FormField } from "../components/ui/FormField";
import { DynamicFormField } from "../components/ui/DynamicFormField";
import { Button } from "../components/ui/Button";
import type { FormTemplate, FormData, FormQuestion } from "../types/form";

// Mock form template data
const mockFormTemplate: FormTemplate = {
  id: "fda-ind-template",
  name: "FDA IND (Investigational New Drug) Submission",
  sections: [
    {
      id: "FDA 3926", // TODO: UUID
      form_id: "fda-ind-template",
      title: "FDA 3926",
      description: "Individual Patient Expanded Access Investigational New Drug Application",
      order_by: 1
    },
    {
      id: "FDA 3455", // TODO: UUID
      form_id: "fda-ind-template",
      title: "FDA 3455",
      description: "DISCLOSURE: FINANCIAL INTERESTS AND ARRANGEMENTS OF CLINICAL INVESTIGATORS",
      order_by: 2
    },
  ],
};

export default function FormEditor() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [questions, setQuestions] = useState<FormQuestion[]>([]);

  // Sort sections by order_by
  const sortedSections = mockFormTemplate.sections.sort((a, b) => a.order_by - b.order_by);
  const currentSection = sortedSections[currentSectionIndex];


  useEffect(() => {
    fetchQuestions();;
  }, []);

  const fetchQuestions = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/questions`); 
    const data = await response.json();
    setQuestions(data);
  }


  // Get questions for current section (with visibility filtering)
  const currentSectionQuestions = 
    questions.filter(q => q.section_id === currentSection.id) 
    .sort((a, b) => a.label.localeCompare(b.label));

  const handleInputChange = (questionId: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
    // TODO: Implement save functionality
  };

  const calculateProgress = () => {
    return Math.round(((currentSectionIndex + 1) / sortedSections.length) * 100);
  };

  // Form validation
  const isCurrentSectionValid = (): boolean => {
    return currentSectionQuestions.every(question => {
      if (!question.required) return true;
      
      const value = formData[question.id];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && String(value).trim() !== "";
    });
  };

  // Check if a section is completed
  const isSectionCompleted = (sectionId: string): boolean => {
    const sectionQuestions = questions
      .filter(q => q.section_id === sectionId);
    
    return sectionQuestions.every(question => {
      if (!question.required) return true;
      
      const value = formData[question.id];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && String(value).trim() !== "";
    });
  };

  // Check if a section can be accessed (all previous sections completed)
  const canAccessSection = (sectionIndex: number): boolean => {
    for (let i = 0; i < sectionIndex; i++) {
      if (!isSectionCompleted(sortedSections[i].id)) {
        return false;
      }
    }
    return true;
  };

  const handleSectionClick = (sectionIndex: number) => {
    if (canAccessSection(sectionIndex)) {
      setCurrentSectionIndex(sectionIndex);
      setShowValidationErrors(false);
    }
  };

  const getValidationErrors = (): string[] => {
    const errors: string[] = [];
    currentSectionQuestions.forEach(question => {
      if (question.required) {
        const value = formData[question.id];
        if (Array.isArray(value)) {
          if (value.length === 0) {
            errors.push(`${question.label} is required`);
          }
        } else if (!value || String(value).trim() === "") {
          errors.push(`${question.label} is required`);
        }
      }
    });
    return errors;
  };

  const handleNext = () => {
    if (!isCurrentSectionValid()) {
      setShowValidationErrors(true);
      console.log("Validation errors:", getValidationErrors());
      return;
    }
    
    setShowValidationErrors(false);
    if (currentSectionIndex < sortedSections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    } else {
      // On last section, could show summary or submit
      console.log("Form completed, ready to submit:", formData);
    }
  };

  const handleSubmit = () => {
    if (!isCurrentSectionValid()) {
      setShowValidationErrors(true);
      return;
    }
    
    console.log("Submitting form:", formData);
    // TODO: Implement actual submission
  };

  const handlePrevious = () => {
    setShowValidationErrors(false);
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form Editor</h1>
          <p className="text-sm text-gray-600 mt-1">
            {mockFormTemplate.name} - Section {currentSectionIndex + 1} of {sortedSections.length}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => {}}>
            Help
          </Button>
          <Button onClick={handleSaveDraft}>
            Save Draft
          </Button>
        </div>
      </div>

      {/* Form Progress */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-blue-900">Form Progress</h2>
            <p className="text-sm text-blue-700">
              Section {currentSectionIndex + 1} of {sortedSections.length}: {currentSection.title}
            </p>
          </div>
          <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600">
            {calculateProgress()}%
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="bg-blue-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>

        {/* Section Navigation */}
        <div className="flex space-x-2">
          {sortedSections.map((section, index) => {
            const isCompleted = isSectionCompleted(section.id);
            const isCurrent = index === currentSectionIndex;
            const canAccess = canAccessSection(index);
            
            return (
              <button
                key={section.id}
                onClick={() => handleSectionClick(index)}
                disabled={!canAccess}
                className={`
                  flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors
                  ${isCurrent 
                    ? 'bg-blue-600 text-white' 
                    : isCompleted 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : canAccess 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-center justify-center space-x-1">
                  {isCompleted && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{index + 1}</span>
                </div>
                <div className="mt-1 truncate">{section.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Validation Errors */}
        {showValidationErrors && getValidationErrors().length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please complete all required fields
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {getValidationErrors().map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary View for Last Section */}
        {currentSectionIndex === sortedSections.length - 1 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Form Review
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Please review your information before submitting. You can go back to any section to make changes.
                </p>
              </div>
            </div>
          </div>
        )}

        <FormSection 
          title={currentSection.title} 
          description={currentSection.description}
        >
          {currentSectionQuestions.map((question) => (
            <FormField 
              key={question.id}
              label={question.label} 
              required={question.required}
              helpText={question.help_text}
            >
              <DynamicFormField
                question={question}
                value={formData[question.id] || ""}
                onChange={handleInputChange}
              />
            </FormField>
          ))}
        </FormSection>
      </div>

      {/* Form Actions */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentSectionIndex === 0}
        >
          Previous
        </Button>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => {}}>
            Cancel
          </Button>
          <Button onClick={handleSaveDraft}>
            Save Draft
          </Button>
          {currentSectionIndex === sortedSections.length - 1 ? (
            <Button 
              onClick={handleSubmit}
              className={!isCurrentSectionValid() ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}
            >
              Submit Form
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              className={!isCurrentSectionValid() ? "bg-yellow-600 hover:bg-yellow-700" : ""}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 