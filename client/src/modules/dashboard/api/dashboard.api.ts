import api from "@/shared/service/api";
import type { DashboardOverviewResponse } from "../types/dashboard.types";

export const getDashboardOverview = async (): Promise<DashboardOverviewResponse> => {
  const response = await api.get<DashboardOverviewResponse>("/api/dashboard/overview");
  return response.data;
};
