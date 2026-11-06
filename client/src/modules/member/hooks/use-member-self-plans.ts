import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getMyPlans } from "../api/member.api";
import { memberKeys } from "../member.keys";
import type { MemberSelfPlansResponse } from "../types/member.types";

export const useMemberSelfPlans = (
  options?: Omit<
    UseQueryOptions<MemberSelfPlansResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: memberKeys.selfPlans(),
    queryFn: getMyPlans,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};

export default useMemberSelfPlans;
