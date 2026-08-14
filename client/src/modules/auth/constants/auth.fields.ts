import { type InitialLoginState } from "../state/initial-login-state";

export interface AuthField {
  label: string;
  name: keyof InitialLoginState;
  type: string;
  placeholder: string;
  size?: number;
}

const authFields: AuthField[] = [
  {
    label: "User ID",
    name: "userId",
    type: "text",
    placeholder: "ADM-00X / TRN-00X",
    size: 100,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "••••••••••••",
    size: 100,
  },
];

export default authFields;
