export const initialAttendanceReportState = {
  startDate: null,
  endDate: null,
};

export const initialIndividualAttendanceState = {
  userId: "",
  name: "",
  startDate: null,
  endDate: null,
};

export const AttendanceReportFieldGroup = [
  { label: "Start Date", name: "startDate", type: "date", size: 50 },
  { label: "End Date", name: "endDate", type: "date", size: 50 },
];

export const IndividualReportFieldGroup = [
  {
    label: "User ID",
    name: "userId",
    placeholder: "MBR-XXX / TRN-XXX",
    size: 50,
  },
  {
    label: "Full Name",
    name: "name",
    placeholder: "",
    size: 50,
    disabled: true,
  },
  { label: "Start Date", name: "startDate", type: "date", size: 50 },
  { label: "End Date", name: "endDate", type: "date", size: 50 },
];
