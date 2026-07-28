export interface RegisterInput {
  userId: string;
  userType: "admin" | "trainer" | "member";
  password: string;
}

export interface LoginInput {
  userId: string;
  password: string;
}
