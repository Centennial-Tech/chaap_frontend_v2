import React from 'react';
import type { FormField } from '../../types/form';
import { HelpCircle } from 'lucide-react';

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

  // Use label field if available, otherwise fall back to description
  const fieldLabel = field.label || field.description;

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 flex-1">
                {fieldLabel} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.description && (
                <div className="relative ml-2 flex-shrink-0">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help mt-0.5" />
                  <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs break-words shadow-xl" style={{ minWidth: '200px' }}>
                    {field.description}
                    <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
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

      case 'date':
        return (
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 flex-1">
                {fieldLabel} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.description && (
                <div className="relative ml-2 flex-shrink-0">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help mt-0.5" />
                  <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs break-words shadow-xl" style={{ minWidth: '200px' }}>
                    {field.description}
                    <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
            <input
              type="date"
              id={id}
              className={`${baseClasses} ${errorClasses}`}
              value={value || ''}
              onChange={handleChange}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">This field is required</p>
            )}
          </div>
        );

      case 'display':
        return (
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <label className="block text-sm font-medium text-gray-700 flex-1">
                {fieldLabel}
              </label>
              {field.description && (
                <div className="relative ml-2 flex-shrink-0">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help mt-0.5" />
                  <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs break-words shadow-xl" style={{ minWidth: '200px' }}>
                    {field.description}
                    <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
              {value || field.properties.default_value || 'No content to display'}
            </div>
          </div>
        );

      case 'dropdown':
        return (
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 flex-1">
                {fieldLabel} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.description && (
                <div className="relative ml-2 flex-shrink-0">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help mt-0.5" />
                  <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs break-words shadow-xl" style={{ minWidth: '200px' }}>
                    {field.description}
                    <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
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
                type="checkbox"
                id={id}
                checked={!!value}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-start justify-between flex-1">
              <label htmlFor={id} className="text-sm text-gray-700 flex-1">
                {fieldLabel}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.description && (
                <div className="relative ml-2 flex-shrink-0">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help mt-0.5" />
                  <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs break-words shadow-xl" style={{ minWidth: '200px' }}>
                    {field.description}
                    <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
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
            <div className="flex items-start justify-between flex-1">
              <label htmlFor={id} className="text-sm text-gray-700 flex-1">
                {fieldLabel}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.description && (
                <div className="relative ml-2 flex-shrink-0">
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help mt-0.5" />
                  <div className="absolute bottom-full right-0 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 max-w-xs break-words shadow-xl" style={{ minWidth: '200px' }}>
                    {field.description}
                    <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div>Unknown field type: {field.type}</div>;
    }
  };

  return (
    <div className="relative group">
      {renderField()}
    </div>
  );
}; 