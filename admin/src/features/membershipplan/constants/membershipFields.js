export const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

export const getInitialMembershipPlanState = () => ({
  name: "",
  duration: "",
  amount: 0,
  description: "",
  status: "Active",
});
