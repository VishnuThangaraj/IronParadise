import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getTrainerDashboardOverview } from "../api/trainer.api";
import { dashboardKeys } from "@/modules/dashboard/dashboard.keys";
import type { TrainerDashboardResponse } from "@/modules/dashboard/types/dashboard.types";

export const useTrainerDashboard = (
  options?: Omit<
    UseQueryOptions<TrainerDashboardResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: dashboardKeys.trainer(),
    queryFn: getTrainerDashboardOverview,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};

export default useTrainerDashboard;
