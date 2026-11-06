import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getTrainerAssignedMembers } from "../api/trainer.api";
import { trainerKeys } from "../trainer.keys";
import type { AssignedMembersResponse } from "../types/trainer.types";

export const useTrainerAssignedMembers = (
  params?: { search?: string; status?: string },
  options?: Omit<
    UseQueryOptions<AssignedMembersResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: trainerKeys.assignedMembers(params),
    queryFn: () => getTrainerAssignedMembers(params),
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
    ...options,
  });
};

export default useTrainerAssignedMembers;
