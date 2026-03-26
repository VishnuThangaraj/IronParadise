import Tooltip from "@mui/joy/Tooltip";
import IconButton from "@mui/joy/IconButton";

export const TrainerPayrollColumns = () => [
  {
    field: "userId",
    headerName: "Trainer ID",
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
    field: "email",
    headerName: "Email",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "salary",
    headerName: "Salary",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "paymentStatus",
    headerName: "Status",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },

  {
    field: "pendingAmount",
    headerName: "Pending Amount",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "action",
    headerName: "Action",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const { row } = params;

      return (
        <div
          className="flex justify-evenly space-x-2 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          hi
        </div>
      );
    },
  },
];
