import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { deleteMember, deleteMemberPermanently } from "../api/member.api";
import { memberKeys } from "../member.keys";
import { SingleMemberResponse } from "../types/member.types";

export interface DeleteMemberVariables {
  id: string;
  permanent?: boolean;
}

export const useMemberDelete = (
  options?: UseMutationOptions<
    SingleMemberResponse,
    Error,
    DeleteMemberVariables | string
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (variables: DeleteMemberVariables | string) => {
      const id = typeof variables === "string" ? variables : variables.id;
      const isPermanent =
        typeof variables === "string" ? false : Boolean(variables.permanent);

      return isPermanent ? deleteMemberPermanently(id) : deleteMember(id);
    },
    onSuccess: (...args) => {
      const [, variables] = args;
      const id = typeof variables === "string" ? variables : variables.id;
      queryClient.invalidateQueries({ queryKey: memberKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteMember = useMemberDelete;
export default useMemberDelete;
