export type EnquiryRoles = "trainer" | "member" | "visitor" | "other";

export interface EnquiryForm {
  fullName: string;
  email: string;
  phone: string;
  role: EnquiryRoles;
  subject: string;
  message: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryResponse {
  status: string;
  statusCode: number;
  message: string;
  data: EnquiryData;
}
