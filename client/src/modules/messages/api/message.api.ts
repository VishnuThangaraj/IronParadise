import api from "@/shared/service/api";
import { UserDetailsResponse } from "../types/message.types";

// get all user details
export const getUserDetails = async (): Promise<UserDetailsResponse> => {
  const response = await api.get<UserDetailsResponse>("/api/message");
  return response.data;
};
