export const getInitialMemberState = () => ({
  name: "",
  email: "",
  mobile: "",
  address: "",
  gender: "Male",
  dob: "",
  joinDate: new Date().toISOString().split("T")[0],
  isActive: true,
});

export const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];
