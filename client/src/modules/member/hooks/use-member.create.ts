import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { createMember } from "../api/member.api";
import { memberKeys } from "../member.keys";
import { MemberFormData, SingleMemberResponse } from "../types/member.types";

export const useMemberCreate = (
  options?: UseMutationOptions<SingleMemberResponse, Error, MemberFormData>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: MemberFormData) => createMember(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
};

export const useCreateMember = useMemberCreate;
export default useMemberCreate;
