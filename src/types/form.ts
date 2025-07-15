export interface FormQuestion {
  id: string;
  form_id: string;
  section_id: string;
  label: string;
  type: "Text Box" | "Radio Btn" | "Check Box" | "Textarea" | "Select" | "Date"; // TODO:
  required: boolean;
  options?: string[];
  help_text?: string;
}

export interface FormSection {
  id: string;
  form_id: string;
  title: string;
  description?: string;
  order_by: number;
}

export interface FormTemplate { // TODO: rename to Form/Remove
  id: string;
  name: string;
  sections: FormSection[];
}

export interface FormData {
  [questionId: string]: string | string[];
} 

export interface FormAnswer {
  id: string;
  form_id: string;
  value: FormData;
  application_id: string;
  question_id: string;
}