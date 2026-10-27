import {
  EmergencyContact,
  UserGender,
  UserPermission,
  UserRole,
} from "@/shared/types/User.types";

export interface MemberFormState {
  // Personal Details
  fullName: string;
  dob: string;
  profileImage: string;
  gender: UserGender;
  email: string;
  phone: string;
  address: string;
  permissions: UserPermission[];
  role: UserRole;
  isActive: boolean;
  emergencyContact: EmergencyContact | null;

  // Plan & Trainer Assignment
  membershipPlanId: string;
  dietPlanId: string;
  workoutPlanId: string;
  trainerId: string;
  startDate: string;
  endDate: string;
}

export const getTodayFormattedDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const initialMemberState: MemberFormState = {
  fullName: "",
  dob: "",
  profileImage: "",
  gender: "male",
  email: "",
  phone: "",
  address: "",
  permissions: ["members"],
  role: "member",
  isActive: true,
  emergencyContact: {
    fullName: "",
    phone: "",
    relation: "",
  },

  membershipPlanId: "",
  dietPlanId: "",
  workoutPlanId: "",
  trainerId: "",
  startDate: getTodayFormattedDate(),
  endDate: "",
};

export default initialMemberState;
