import React from 'react';
import type { FormField } from '../../types/form';

interface DynamicFormFieldProps {
  id: string;
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: boolean;
}

export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  id,
  field,
  value,
  onChange,
  error = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = field.type === 'checkbox' ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    onChange(newValue);
  };

  const baseClasses = "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const errorClasses = error ? "border-red-300 text-red-900 placeholder-red-300" : "border-gray-300";

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
              {field.description} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.properties.multiline ? (
              <textarea
                id={id}
                className={`${baseClasses} ${errorClasses} min-h-[100px] resize-vertical`}
                value={value || ''}
                onChange={handleChange}
                rows={4}
              />
            ) : (
              <input
                type="text"
                id={id}
                className={`${baseClasses} ${errorClasses}`}
                value={value || ''}
                onChange={handleChange}
              />
            )}
            {error && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>
        );

      case 'dropdown':
        return (
          <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
              {field.description} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              id={id}
              className={`${baseClasses} ${errorClasses}`}
              value={value || ''}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              {field.properties.choices?.map((choice) => (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
            {error && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>
        );

      case 'radio button':
        return (
          <div className="flex items-start space-x-2">
            <div className="flex items-center h-5">
              <input
                type="radio"
                id={id}
                name={id}
                checked={!!value}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
            </div>
            <label htmlFor={id} className="text-sm text-gray-700">
              {field.description}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-start space-x-2">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id={id}
                checked={!!value}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <label htmlFor={id} className="text-sm text-gray-700">
              {field.description}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return renderField();
}; 