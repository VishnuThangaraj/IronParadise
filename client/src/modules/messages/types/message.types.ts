export type UserRole = "admin" | "trainer" | "member";

export interface UserDetails {
  _id: string;

  userId: string;
  fullName: string;
  profileImage: string;

  email: string;

  role: UserRole;
}

export interface UserDetailsResponse {
  success: boolean;
  message: string;
  data: UserDetails[];
}
