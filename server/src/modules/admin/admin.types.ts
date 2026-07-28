export interface CreateAdminInput {
  fullName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  phone?: string;
  profileImage?: string;
}
