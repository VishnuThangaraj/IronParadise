import Tooltip from "@mui/joy/Tooltip";
import IconButton from "@mui/joy/IconButton";

export const MembershipColumns = () => [
  {
    field: "memberId",
    headerName: "Member ID",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return (
        <div
          className={`font-semibold ${params.row?.status == "active" ? "text-green-600" : "text-red-600"}`}
        >
          {params.row?.memberId?.memberId ?? "ID Error"}
        </div>
      );
    },
  },
  {
    field: "memberName",
    headerName: "Name",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return <div>{params.row?.memberId?.name ?? "Name Error"}</div>;
    },
  },
  {
    field: "planName",
    headerName: "Plan Name",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return <div>{params.row?.planId?.name ?? "-"}</div>;
    },
  },
  {
    field: "startDate",
    headerName: "Start Date",
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
    field: "endDate",
    headerName: "End Date",
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
    field: "status",
    headerName: "Status",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "action",
    headerName: "Action",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const { row } = params;

      return (
        <div
          className="flex justify-evenly space-x-2 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mail */}
          <Tooltip title="Mail" arrow>
            <IconButton>
              <i className="fa-duotone fa-thin fa-envelope text-blue-600 text-[20px]" />
            </IconButton>
          </Tooltip>

          {/* Subscription History */}
          <Tooltip title="Subscription History" arrow>
            <IconButton>
              <i className="fa-sharp-duotone fa-regular fa-clock-rotate-left text-yellow-600 text-[20px]" />
            </IconButton>
          </Tooltip>

          {/* Make Payment */}
          <Tooltip title="Make Payment" arrow>
            <IconButton>
              <i className="fa-duotone fa-thin fa-credit-card text-green-600 text-[20px]" />
            </IconButton>
          </Tooltip>

          {/* Payment History */}
          <Tooltip title="Payment History" arrow>
            <IconButton>
              <i className="fa-sharp-duotone fa-regular fa-clock-rotate-left text-yellow-600 text-[20px]" />
            </IconButton>
          </Tooltip>

          {/* Change Membership */}
          <Tooltip title="Change Membership" arrow>
            <IconButton>
              <i className="fa-duotone fa-solid fa-pencil text-blue-600 text-[20px]" />
            </IconButton>
          </Tooltip>
        </div>
      );
    },
  },
];
