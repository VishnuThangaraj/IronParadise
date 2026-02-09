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
    renderCell: (params) => {
      const { row } = params;
      const role = row.role.toUpperCase();
      const isMember = role == "MEMBER";
      return (
        <div
          className={`font-semibold ${isMember ? "text-green-500" : "text-blue-500"}`}
        >
          {role}
        </div>
      );
    },
  },
];
