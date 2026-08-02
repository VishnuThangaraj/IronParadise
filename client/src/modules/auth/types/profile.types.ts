import { type User } from "./user.types";

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}
