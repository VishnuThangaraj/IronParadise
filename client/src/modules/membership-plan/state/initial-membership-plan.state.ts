export interface MembershipPlanFormState {
  planName: string;
  durationMonths: number | string;
  price: number | string;
  features: string[];
  isActive: boolean;
}

export const initialMembershipPlanState: MembershipPlanFormState = {
  planName: "",
  durationMonths: "",
  price: "",
  features: [],
  isActive: true,
};

export default initialMembershipPlanState;
