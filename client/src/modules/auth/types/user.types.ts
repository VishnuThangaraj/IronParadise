export interface User {
  _id: string;
  userId?: string;
  adminId?: string;
  fullName: string;
  profileImage: string;
  gender: string;
  email: string;
  phone: string;
  role: "admin" | "trainer" | "member" | string;
  permissions?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
