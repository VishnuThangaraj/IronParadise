import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectUser } from "@/modules/auth/redux/auth.selector";
import { getDashboardOverview } from "../api/dashboard.api";
import { dashboardKeys } from "../dashboard.keys";
import type { DashboardOverviewResponse } from "../types/dashboard.types";

export const useDashboardOverview = (
  options?: Omit<
    UseQueryOptions<DashboardOverviewResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const user = useSelector(selectUser);

  return useQuery({
    queryKey: [...dashboardKeys.overview(), user?.role, user?.userId],
    queryFn: getDashboardOverview,
    enabled: Boolean(user?.userId && user?.role),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
    ...options,
  });
};

export default useDashboardOverview;
