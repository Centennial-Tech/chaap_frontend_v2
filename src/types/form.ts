export type FormFieldType = 'text' | 'radio button' | 'checkbox' | 'dropdown';

export interface FormFieldProperties {
  max_length: number | null;
  multiline: boolean;
  choices: string[] | null;
  default_value: string | null;
}

export interface FormField {
  type: FormFieldType;
  widget_info: Record<string, any>;
  description: string;
  required: boolean;
  properties: FormFieldProperties;
}

export interface FormQuestion {
  id: string;
  name: string;
  title: string;
  form_id: string;
  data: Record<string, FormField>;
}

export interface FormData {
  [key: string]: string | string[] | boolean | number | null;
}

// Helper type for radio button groups
export interface RadioGroupContext {
  groupName: string;
  options: string[];
  selectedValue: string | null;
}

// Helper function to identify radio button groups
export function getRadioGroupName(fieldId: string): string {
  // Extract base name for radio groups
  // e.g., "ageYrs", "ageMons", "ageWks", "ageDays" -> "age"
  // e.g., "sexM", "sexF" -> "sex"
  // e.g., "abate1Yes", "abate1No", "abate1NA" -> "abate1"
  
  // Common suffixes to remove
  const suffixes = ['Yes', 'No', 'NA', 'Y', 'N', 'U', 'M', 'F', 'Yrs', 'Mons', 'Wks', 'Days'];
  
  let baseName = fieldId;
  for (const suffix of suffixes) {
    if (fieldId.endsWith(suffix)) {
      baseName = fieldId.slice(0, -suffix.length);
      break;
    }
  }
  
  return baseName;
}

// Helper function to get radio button value from field ID
export function getRadioValue(fieldId: string): string {
  // Extract the value part from the field ID
  // e.g., "ageYrs" -> "Yrs", "sexM" -> "M", "abate1Yes" -> "Yes"
  const suffixes = ['Yes', 'No', 'NA', 'Y', 'N', 'U', 'M', 'F', 'Yrs', 'Mons', 'Wks', 'Days'];
  
  for (const suffix of suffixes) {
    if (fieldId.endsWith(suffix)) {
      return suffix;
    }
  }
  
  return fieldId; // fallback
}
