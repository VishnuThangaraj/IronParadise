export type EnquiryRoles = "trainer" | "member" | "visitor" | "other";

export interface EnquiryForm {
  fullName: string;
  email: string;
  phone: string;
  role: EnquiryRoles;
  subject: string;
  message: string;
}

export interface EnquiryReplyMessage {
  subject?: string;
  message?: string;
  repliedAt?: string;
}

export interface EnquiryData {
  _id: string;
  enquiryId: string;
  fullName: string;
  email: string;
  phone: string;
  role: EnquiryRoles;
  subject: string;
  message: string;
  replied: boolean;
  replyMessage?: EnquiryReplyMessage;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryResponse {
  status: string;
  statusCode: number;
  message: string;
  data: EnquiryData;
}

export interface EnquiriesListResponse {
  status: string;
  statusCode: number;
  message: string;
  data: EnquiryData[];
}
