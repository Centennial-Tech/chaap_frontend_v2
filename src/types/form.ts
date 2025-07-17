export interface FormQuestionField {
  type: 'text' | 'checkbox' | 'dropdown';
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
  [key: string]: string | string[] | boolean | number | null;
}

export interface FormAnswer {
  question_id: string;
  application_id: string;
  data: Record<string, any>;
}