export const MessageColumns = () => [
  {
    field: "userIdentifier",
    headerName: "User Id",
    flex: 1,
    headerAlign: "center",
    align: "center",
    valueGetter: (value, row) => {
      return row?.memberId || row?.userId || "-";
    },
  },
  {
    field: "name",
    headerName: "Full Name",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "phone",
    headerName: "Phone",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "address",
    headerName: "Address",
    flex: 2,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "role",
    headerName: "Role",
    flex: 1,
    headerAlign: "center",
    align: "center",
    valueFormatter: (value) => {
      return value.toUpperCase();
    },
  },
];
