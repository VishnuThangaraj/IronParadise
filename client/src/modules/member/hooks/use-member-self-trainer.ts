import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getMyTrainer } from "../api/member.api";
import { memberKeys } from "../member.keys";
import type { MemberSelfTrainerResponse } from "../types/member.types";

export const useMemberSelfTrainer = (
  options?: Omit<
    UseQueryOptions<MemberSelfTrainerResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: memberKeys.selfTrainer(),
    queryFn: getMyTrainer,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};

export default useMemberSelfTrainer;
