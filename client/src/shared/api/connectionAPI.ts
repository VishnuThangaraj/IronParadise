import api from "@/shared/service/api";
import type { PingResponse } from "../types/pingResponse";

export const ping = async (): Promise<PingResponse> => {
  const response = await api.get<PingResponse>("/");
  return response.data;
};
