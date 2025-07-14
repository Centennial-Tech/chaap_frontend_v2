import { useState } from "react";
import { FormSection } from "../components/ui/FormSection";
import { FormField } from "../components/ui/FormField";
import { DynamicFormField } from "../components/ui/DynamicFormField";
import { Button } from "../components/ui/Button";
import { useSubmission } from "../provider/submissionProvider";
import type { FormTemplate, FormQuestion, FormData } from "../types/form";

// Mock form template data
const mockFormTemplate: FormTemplate = {
  id: "fda-ind-template",
  name: "FDA IND (Investigational New Drug) Application Form",
  sections: [
    {
      id: "basic-info",
      title: "Basic Information",
      description: "Enter the basic details about your IND application",
      order_by: 1
    },
    {
      id: "drug-details",
      title: "Drug Details",
      description: "Provide detailed information about your investigational drug",
      order_by: 2
    },
    {
      id: "clinical-protocol",
      title: "Clinical Protocol",
      description: "Clinical study design and protocol information",
      order_by: 3
    },
    {
      id: "manufacturing",
      title: "Manufacturing Information",
      description: "Drug manufacturing and quality control details",
      order_by: 4
    },
    {
      id: "safety-data",
      title: "Safety Data",
      description: "Preclinical safety and toxicology information",
      order_by: 5
    }
  ],
  questions: [
    // Section 1: Basic Information
    {
      id: "ind-title",
      section_id: "basic-info",
      label: "IND Application Title",
      type: "Text Box",
      required: true
    },
    {
      id: "sponsor-name",
      section_id: "basic-info",
      label: "Sponsor Name",
      type: "Text Box",
      required: true
    },
    {
      id: "ind-type",
      section_id: "basic-info",
      label: "IND Type",
      type: "Select",
      required: true,
      options: ["Commercial IND", "Research IND", "Emergency Use IND", "Treatment IND"]
    },
    {
      id: "submission-date",
      section_id: "basic-info",
      label: "Target Submission Date",
      type: "Date",
      required: true
    },
    {
      id: "description",
      section_id: "basic-info",
      label: "Drug Description",
      type: "Textarea",
      required: false,
      help_text: "Provide a detailed description of your investigational drug"
    },
    
    // Section 2: Drug Details
    {
      id: "drug-name",
      section_id: "drug-details",
      label: "Drug Name",
      type: "Text Box",
      required: true
    },
    {
      id: "chemical-name",
      section_id: "drug-details",
      label: "Chemical Name",
      type: "Text Box",
      required: true
    },
    {
      id: "drug-class",
      section_id: "drug-details",
      label: "Drug Classification",
      type: "Radio Btn",
      required: true,
      options: ["Small Molecule", "Biologic", "Gene Therapy", "Cell Therapy", "Other"]
    },
    {
      id: "indication",
      section_id: "drug-details",
      label: "Proposed Indication",
      type: "Textarea",
      required: true
    },
    {
      id: "mechanism-action",
      section_id: "drug-details",
      label: "Mechanism of Action",
      type: "Textarea",
      required: true
    },
    
    // Section 3: Clinical Protocol
    {
      id: "study-title",
      section_id: "clinical-protocol",
      label: "Study Title",
      type: "Text Box",
      required: true
    },
    {
      id: "study-phase",
      section_id: "clinical-protocol",
      label: "Study Phase",
      type: "Select",
      required: true,
      options: ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 1/2", "Phase 2/3"]
    },
    {
      id: "study-design",
      section_id: "clinical-protocol",
      label: "Study Design",
      type: "Radio Btn",
      required: true,
      options: ["Single Arm", "Randomized", "Double-Blind", "Open Label", "Crossover"]
    },
    {
      id: "primary-endpoint",
      section_id: "clinical-protocol",
      label: "Primary Endpoint",
      type: "Textarea",
      required: true
    },
    {
      id: "secondary-endpoints",
      section_id: "clinical-protocol",
      label: "Secondary Endpoints",
      type: "Textarea",
      required: false
    },
    {
      id: "sample-size",
      section_id: "clinical-protocol",
      label: "Planned Sample Size",
      type: "Text Box",
      required: true
    },
    
    // Section 4: Manufacturing
    {
      id: "manufacturing-site",
      section_id: "manufacturing",
      label: "Manufacturing Site",
      type: "Text Box",
      required: true
    },
    {
      id: "manufacturing-process",
      section_id: "manufacturing",
      label: "Manufacturing Process",
      type: "Textarea",
      required: true
    },
    {
      id: "quality-control",
      section_id: "manufacturing",
      label: "Quality Control Methods",
      type: "Textarea",
      required: true
    },
    {
      id: "stability-data",
      section_id: "manufacturing",
      label: "Stability Data Available",
      type: "Check Box",
      required: false,
      options: ["Yes", "No"]
    },
    {
      id: "batch-size",
      section_id: "manufacturing",
      label: "Planned Batch Size",
      type: "Text Box",
      required: true
    },
    
    // Section 5: Safety Data
    {
      id: "preclinical-studies",
      section_id: "safety-data",
      label: "Preclinical Studies Completed",
      type: "Check Box",
      required: false,
      options: ["Toxicology", "Pharmacokinetics", "Pharmacodynamics", "Carcinogenicity", "Genotoxicity"]
    },
    {
      id: "safety-profile",
      section_id: "safety-data",
      label: "Safety Profile Summary",
      type: "Textarea",
      required: true
    },
    {
      id: "adverse-events",
      section_id: "safety-data",
      label: "Known Adverse Events",
      type: "Textarea",
      required: false
    },
    {
      id: "risk-assessment",
      section_id: "safety-data",
      label: "Risk Assessment",
      type: "Textarea",
      required: true
    }
  ]
};

export default function FormEditor() {
  const { activeSubmission } = useSubmission();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Sort sections by order_by
  const sortedSections = mockFormTemplate.sections.sort((a, b) => a.order_by - b.order_by);
  const currentSection = sortedSections[currentSectionIndex];
  
  // Get questions for current section (with visibility filtering)
  const currentSectionQuestions = mockFormTemplate.questions
    .filter(q => q.section_id === currentSection.id)
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
    const sectionQuestions = mockFormTemplate.questions
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