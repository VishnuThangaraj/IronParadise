export interface EmergencyContact {
  fullName: string;
  phone: string;
  relation: string;
}

export type UserRole = "admin" | "trainer" | "member";
export type UserGender = "male" | "female" | "other";
export type UserPermission =
  | "admins"
  | "events"
  | "members"
  | "trainers"
  | "dietplans"
  | "memberships"
  | "workoutplans"
  | "enquiry";

export interface User {
  _id: string;

  userId: string;
  fullName: string;
  dob?: string;
  profileImage: string;
  gender: UserGender;
  email: string;
  phone?: string;
  address?: string;
  permissions: UserPermission[];
  role: UserRole;
  emergencyContact: EmergencyContact | null;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
