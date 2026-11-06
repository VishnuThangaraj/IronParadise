export const trainerKeys = {
  all: ["trainer"] as const,
  lists: () => [...trainerKeys.all, "list"] as const,
  detail: (id: string) => [...trainerKeys.all, "detail", id] as const,
  assignedMembers: (params?: Record<string, any>) =>
    [...trainerKeys.all, "assigned-members", params] as const,
  assignedAttendance: (params?: Record<string, any>) =>
    [...trainerKeys.all, "assigned-attendance", params] as const,
  payroll: () => [...trainerKeys.all, "payroll"] as const,
};
