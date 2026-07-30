export interface AuthField {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  size?: number;
}

const authFields: AuthField[] = [
  {
    label: "User ID",
    name: "userId",
    type: "text",
    placeholder: "Enter your User ID",
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
