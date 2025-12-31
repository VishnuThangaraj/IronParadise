export const TrainerColumns = () => [
  {
    field: "userId",
    headerName: "Trainer ID",
    width: 100,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "name",
    headerName: "Full Name",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "phone",
    headerName: "Contact",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "gender",
    headerName: "Gender",
    width: 80,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => {
      if (!value) return "-";

      return value.slice(0, 1).toUpperCase() + value.slice(1);
    },
  },
  {
    field: "dob",
    headerName: "DOB",
    flex: 1,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => {
      if (!value) return "-";

      const date = new Date(value);
      if (isNaN(date.getTime())) return "-";

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    },
  },
  {
    field: "specialization",
    headerName: "Specialization",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "bmi",
    headerName: "BMI",
    width: 80,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "action",
    headerName: "Action",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
];
