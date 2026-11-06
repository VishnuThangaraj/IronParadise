import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getTrainerSelfPayroll } from "../api/trainer.api";
import { trainerKeys } from "../trainer.keys";
import type { TrainerPayrollResponse } from "../types/trainer.types";

export const useTrainerSelfPayroll = (
  options?: Omit<
    UseQueryOptions<TrainerPayrollResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: trainerKeys.payroll(),
    queryFn: getTrainerSelfPayroll,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};

export default useTrainerSelfPayroll;
