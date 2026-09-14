import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getMembers } from "../api/member.api";
import { memberKeys } from "../member.keys";
import { MemberQueryParams, MemberResponse } from "../types/member.types";

export const useMemberFetch = (
  params?: MemberQueryParams,
  options?: Omit<UseQueryOptions<MemberResponse, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: memberKeys.list(params),
    queryFn: () => getMembers(params),
    ...options,
  });
};

export const useMembers = useMemberFetch;
export default useMemberFetch;
