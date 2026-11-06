import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getAssignedMembersAttendance } from "../api/trainer.api";
import { trainerKeys } from "../trainer.keys";
import type { AssignedMembersAttendanceResponse } from "../types/trainer.types";

export const useAssignedMembersAttendance = (
  params?: {
    memberId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    limit?: number;
  },
  options?: Omit<
    UseQueryOptions<AssignedMembersAttendanceResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: trainerKeys.assignedAttendance(params),
    queryFn: () => getAssignedMembersAttendance(params),
    staleTime: 1000 * 30, // 30 seconds
    refetchOnWindowFocus: true,
    ...options,
  });
};

export default useAssignedMembersAttendance;
