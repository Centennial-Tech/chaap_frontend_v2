export interface FormQuestion {
  id: string;
  section_id: string;
  label: string;
  type: "Text Box" | "Radio Btn" | "Check Box" | "Textarea" | "Select" | "Date";
  required: boolean;
  options?: string[];
  help_text?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  order_by: number;
}

export interface FormTemplate {
  id: string;
  name: string;
  sections: FormSection[];
  questions: FormQuestion[];
}

export interface FormData {
  [questionId: string]: string | string[];
} 