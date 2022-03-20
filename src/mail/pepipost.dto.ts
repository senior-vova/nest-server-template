export enum PepipostEndpoints {
  SEND_MAIL = "https://emailapi.netcorecloud.net/v5.1/mail/send",
  RETRIEVE_TEMPLATES = "https://emailapi.netcorecloud.net/v5.1/templates",
  GET_TEMPLATE = "https://emailapi.netcorecloud.net/v5.1/template",
}

export enum TemplatesNames {
  CODE = "Code",
  AUTH = "Auth",
}

export interface SendEmailBodyI {
  from: {
    email: string;
    name: string;
  };
  subject: string;
  content: [
    {
      type: string;
      value: string;
    },
  ];
  personalizations: [
    {
      attributes: Record<string, any>;
      to: Array<{ email: string }>;
    },
  ];
}

export interface PepipostTemplateI {
  template_id: number;
  template_name: string;
  added: string;
  last_modified: string;
}
