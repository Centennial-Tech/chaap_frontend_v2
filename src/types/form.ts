export interface FormQuestionField {
  type: 'text' | 'checkbox';
  widget_info: Record<string, any>;
  description: string;
  required: boolean;
  properties: {
    max_length: number | null;
    multiline: boolean;
    choices: string[] | null;
    default_value: any | null;
  };
}

export interface FormQuestion {
  id: string;
  name: string;
  title: string;
  form_id: string;
  data: Record<string, FormQuestionField>;
}

export interface FormData {
  [key: string]: any;
}

export interface FormAnswer {
  form_id: string;
  submission_id: string;
  data: Record<string, any>;
}