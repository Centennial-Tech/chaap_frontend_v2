export type FormFieldType = 'text' | 'radio button' | 'checkbox' | 'dropdown' | 'date' | 'display';

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
  label?: string; // Optional label field
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
