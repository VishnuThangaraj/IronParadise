import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getDashboardOverview } from "../api/dashboard.api";
import { dashboardKeys } from "../dashboard.keys";
import type { DashboardOverviewResponse } from "../types/dashboard.types";

export const useDashboardOverview = (
  options?: Omit<
    UseQueryOptions<DashboardOverviewResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: getDashboardOverview,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};

export default useDashboardOverview;
