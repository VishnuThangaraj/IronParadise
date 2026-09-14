import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { updateMember } from "../api/member.api";
import { memberKeys } from "../member.keys";
import { SingleMemberResponse, UpdateMemberRequest } from "../types/member.types";

export interface UpdateMemberVariables {
  id: string;
  data: UpdateMemberRequest;
}

export const useMemberUpdate = (
  options?: UseMutationOptions<
    SingleMemberResponse,
    Error,
    UpdateMemberVariables
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, data }: UpdateMemberVariables) => updateMember(id, data),
    onSuccess: (...args) => {
      const [, variables] = args;
      queryClient.invalidateQueries({
        queryKey: memberKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateMember = useMemberUpdate;
export default useMemberUpdate;
