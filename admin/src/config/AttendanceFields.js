export const initialAttendanceState = {
  userName: "",
  name: "",
};

export const initialAttendanceSessionState = {
  name: "",
  sessions: [],
};

export const AttendanceFieldGroup = [
  {
    label: "Enter your ID",
    name: "userName",
    placeholder: "MBR-XXX / TRN-XXX",
    size: 100,
  },
  {
    label: "Full Name",
    name: "name",
    placeholder: "Name",
    disabled: true,
    size: 100,
  },
];
