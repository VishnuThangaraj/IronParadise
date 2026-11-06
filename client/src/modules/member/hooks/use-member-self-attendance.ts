import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getMyAttendance } from "../api/member.api";
import { memberKeys } from "../member.keys";
import type { MemberSelfAttendanceResponse } from "../types/member.types";

export const useMemberSelfAttendance = (
  params?: { month?: number; year?: number; limit?: number },
  options?: Omit<
    UseQueryOptions<MemberSelfAttendanceResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: memberKeys.selfAttendance(params),
    queryFn: () => getMyAttendance(params),
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
    ...options,
  });
};

export default useMemberSelfAttendance;
