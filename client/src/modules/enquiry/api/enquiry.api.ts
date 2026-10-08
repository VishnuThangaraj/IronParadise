import api from "@/shared/service/api";
import type { EnquiryForm, EnquiryResponse } from "../types/enquiry.types";

export const createEnquiry = async (
  formData: EnquiryForm,
): Promise<EnquiryResponse> => {
  const response = await api.post<EnquiryResponse>("/api/enquiry", formData);
  return response.data;
};

export const fetchAllEnquiries = async (
  params?: { replied?: boolean; role?: string; search?: string },
): Promise<{ status: string; statusCode: number; message: string; data: EnquiryResponse["data"][] }> => {
  const response = await api.get("/api/enquiry", { params });
  return response.data;
};

export const getEnquiryById = async (
  id: string,
): Promise<EnquiryResponse> => {
  const response = await api.get<EnquiryResponse>(`/api/enquiry/${id}`);
  return response.data;
};

export const replyToEnquiry = async (
  id: string,
  replyData: { subject: string; message: string },
): Promise<EnquiryResponse> => {
  const response = await api.post<EnquiryResponse>(`/api/enquiry/${id}/reply`, replyData);
  return response.data;
};

export const deleteEnquiry = async (
  id: string,
): Promise<EnquiryResponse> => {
  const response = await api.delete<EnquiryResponse>(`/api/enquiry/${id}`);
  return response.data;
};
