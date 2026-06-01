export const getInitialTrainerState = () => ({
  name: "",
  email: "",
  mobile: "",
  address: "",
  gender: "Male",
  specialization: "",
  experience: 0,
  shiftTime: "Morning",
  salary: 0,
  dob: "",
  joinDate: new Date().toISOString().split("T")[0],
  isWorking: true,
});

export const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export const shiftOptions = [
  { value: "Morning", label: "Morning" },
  { value: "Afternoon", label: "Afternoon" },
  { value: "Evening", label: "Evening" },
  { value: "Night", label: "Night" },
];
