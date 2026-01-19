export const initialEventState = {
  title: "",
  start: null,
  end: null,
  allDay: null,
  type: null,
  trainerId: "",
  memberId: "",
  visibility: "private",
  allowedRoles: null,
  color: "",
  createdBy: "",
};

export const dropdownOptions = {
  type: ["Trainer", "Member", "Workout", "Diet", "System"],
  visibility: ["Private", "Role-based", "Public"],
  allowedRoles: ["Admin", "Trainer", "Member"],
};

export const EventFieldGroup = [];
