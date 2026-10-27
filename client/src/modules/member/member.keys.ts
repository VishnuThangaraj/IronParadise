import { MemberQueryParams } from "./types/member.types";

export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  list: (params?: MemberQueryParams) =>
    params ? ([...memberKeys.lists(), params] as const) : ([...memberKeys.lists()] as const),
  details: () => [...memberKeys.all, "detail"] as const,
  detail: (id: string) => [...memberKeys.details(), id] as const,
  payments: (params?: Record<string, any>) =>
    params
      ? (["member-payments", params] as const)
      : (["member-payments"] as const),
  receipts: (params?: Record<string, any>) =>
    params
      ? (["member-receipts", params] as const)
      : (["member-receipts"] as const),
  receiptsByUser: (userId: string) =>
    ["member-receipts", "user", userId] as const,
};
