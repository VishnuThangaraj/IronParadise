import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getMyDetails } from "../api/member.api";
import { memberKeys } from "../member.keys";
import type { MemberSelfDetailsResponse } from "../types/member.types";

export const useMemberSelfDetails = (
  options?: Omit<
    UseQueryOptions<MemberSelfDetailsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: memberKeys.selfDetails(),
    queryFn: getMyDetails,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};

export default useMemberSelfDetails;
