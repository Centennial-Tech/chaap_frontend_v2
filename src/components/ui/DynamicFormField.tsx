import React from "react";
import type { FormQuestion } from "../../types/form";

interface DynamicFormFieldProps {
  question: FormQuestion;
  value: string | string[];
  onChange: (questionId: string, value: string | string[]) => void;
  disabled?: boolean;
}

export function DynamicFormField({ question, value, onChange, disabled = false }: DynamicFormFieldProps) {
  const baseClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const disabledClasses = disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "";

  const handleChange = (newValue: string | string[]) => {
    onChange(question.id, newValue);
  };

  switch (question.type) {
    case "Text Box":
      return (
        <input
          type="text"
          className={`${baseClasses} ${disabledClasses}`}
          value={value as string || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${question.label.toLowerCase()}`}
          disabled={disabled}
        />
      );

    case "Textarea":
      return (
        <textarea
          className={`${baseClasses} ${disabledClasses} min-h-[100px] resize-vertical`}
          value={value as string || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${question.label.toLowerCase()}`}
          disabled={disabled}
          rows={4}
        />
      );

    case "Date":
      return (
        <input
          type="date"
          className={`${baseClasses} ${disabledClasses}`}
          value={value as string || ""}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
        />
      );

    case "Select":
      return (
        <select
          className={`${baseClasses} ${disabledClasses}`}
          value={value as string || ""}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">Select {question.label.toLowerCase()}</option>
          {question.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "Radio Btn":
      return (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={value === option}
                onChange={(e) => handleChange(e.target.value)}
                disabled={disabled}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <span className={`text-sm ${disabled ? "text-gray-500" : "text-gray-700"}`}>
                {option}
              </span>
            </label>
          ))}
        </div>
      );

    case "Check Box":
      return (
        <div className="space-y-2">
          {question.options?.map((option) => {
            const currentValues = Array.isArray(value) ? value : [];
            const isChecked = currentValues.includes(option);
            
            return (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={isChecked}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    handleChange(newValues);
                  }}
                  disabled={disabled}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <span className={`text-sm ${disabled ? "text-gray-500" : "text-gray-700"}`}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      );

    default:
      return (
        <input
          type="text"
          className={`${baseClasses} ${disabledClasses}`}
          value={value as string || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Enter ${question.label.toLowerCase()}`}
          disabled={disabled}
        />
      );
  }
} 