import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getUserDetails } from "../api/message.api";
import { type UserDetailsResponse } from "../types/message.types";

export const useUserDetailsFetch = (
  options?: Omit<
    UseQueryOptions<UserDetailsResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ["users", "details"],
    queryFn: getUserDetails,
    ...options,
  });
};

export default useUserDetailsFetch;
