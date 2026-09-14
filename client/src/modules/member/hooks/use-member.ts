import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getMemberById } from "../api/member.api";
import { memberKeys } from "../member.keys";
import { SingleMemberResponse } from "../types/member.types";

export const useMember = (
  memberId: string,
  options?: Omit<
    UseQueryOptions<SingleMemberResponse, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: memberKeys.detail(memberId),
    queryFn: () => getMemberById(memberId),
    enabled: Boolean(memberId),
    ...options,
  });
};

export default useMember;
