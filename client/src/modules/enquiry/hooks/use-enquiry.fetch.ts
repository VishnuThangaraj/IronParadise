import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { fetchAllEnquiries } from "../api/enquiry.api";
import type { EnquiriesListResponse } from "../types/enquiry.types";

export interface UseEnquiriesParams {
  replied?: boolean;
  role?: string;
  search?: string;
}

export const enquiryKeys = {
  all: ["enquiries"] as const,
  lists: () => [...enquiryKeys.all, "list"] as const,
  list: (params?: UseEnquiriesParams) =>
    [...enquiryKeys.lists(), params] as const,
  details: () => [...enquiryKeys.all, "detail"] as const,
  detail: (id: string) => [...enquiryKeys.details(), id] as const,
};

export const useEnquiriesFetch = (
  params?: UseEnquiriesParams,
  options?: Omit<
    UseQueryOptions<EnquiriesListResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: enquiryKeys.list(params),
    queryFn: () => fetchAllEnquiries(params),
    ...options,
  });
};

export default useEnquiriesFetch;
