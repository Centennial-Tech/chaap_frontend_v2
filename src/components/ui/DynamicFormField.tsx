import type { FormQuestionField } from "../../types/form";

interface DynamicFormFieldProps {
  id: string;
  field: FormQuestionField;
  value: any;
  onChange: (value: any) => void;
  error?: boolean;
}

export function DynamicFormField({ 
  id, 
  field,
  value, 
  onChange, 
  error
}: DynamicFormFieldProps) {
  const baseClasses = "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const errorClasses = error ? "border-red-300 text-red-900 placeholder-red-300" : "border-gray-300";

  switch (field.type) {
    case "text":
      return (
        <div className="space-y-1">
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {field.description} {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.properties.multiline ? (
            <textarea
              id={id}
              className={`${baseClasses} ${errorClasses} min-h-[100px] resize-vertical`}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              maxLength={field.properties.max_length || undefined}
              rows={4}
            />
          ) : (
            <input
              id={id}
              type="text"
              className={`${baseClasses} ${errorClasses}`}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              maxLength={field.properties.max_length || undefined}
            />
          )}
          {error && (
            <p className="mt-1 text-sm text-red-600">This field is required</p>
          )}
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-1">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={id}
                type="checkbox"
                checked={value === true}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={id} className="font-medium text-gray-700">
                {field.description} {field.required && <span className="text-red-500">*</span>}
              </label>
            </div>
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-600">This field is required</p>
          )}
        </div>
      );

    default:
      return null;
  }
} 