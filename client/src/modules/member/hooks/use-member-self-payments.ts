import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getMyPayments } from "../api/member.api";
import { memberKeys } from "../member.keys";
import type { MemberSelfPaymentsResponse } from "../types/member.types";

export const useMemberSelfPayments = (
  options?: Omit<
    UseQueryOptions<MemberSelfPaymentsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: memberKeys.selfPayments(),
    queryFn: getMyPayments,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};

export default useMemberSelfPayments;
