export interface MembershipPlan {
  _id: string;
  membershipPlanId: string;
  planName: string;
  durationMonths: number;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export type MembershipPlanFormData = Omit<
  MembershipPlan,
  "_id" | "createdAt" | "updatedAt" | "__v"
>;

export type UpdateMembershipPlanRequest = Partial<MembershipPlanFormData>;

export interface MembershipPlanResponse {
  success: boolean;
  message: string;
  data: MembershipPlan[];
}

export interface SingleMembershipPlanResponse {
  success: boolean;
  message: string;
  data: MembershipPlan;
}
