import Chip from "@mui/joy/Chip";
import Tooltip from "@mui/joy/Tooltip";
import IconButton from "@mui/joy/IconButton";

export const EnquiryColumns = ({
  setDeleteId,
  setOpenDelete,
  setMailData,
  setOpenMail,
  fetchCurrentEnquiry,
}) => [
  {
    field: "name",
    headerName: "Full Name",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const { row } = params;
      return `${row.firstName} ${row.lastName}`;
    },
  },
  {
    field: "createdAt",
    headerName: "Date",
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
    field: "mobile",
    headerName: "Contact",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "subject",
    headerName: "Subject",
    flex: 2,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "replied",
    headerName: "Status",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const { replied } = params.row;

      return (
        <div>
          <Chip
            color={replied ? "success" : "danger"}
            variant="soft"
            sx={{
              px: 2,
              boxShadow: "sm",
            }}
          >
            {`${replied ? "Resolved" : "Unresolved"}`}
          </Chip>
        </div>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const { row } = params;

      return (
        <div
          className="flex justify-evenly space-x-2 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* View Message */}
          <Tooltip title="View Message" arrow>
            <IconButton
              onClick={() => {
                fetchCurrentEnquiry(row);
              }}
            >
              <i className="fa-duotone fa-solid fa-messages text-green-600 text-[20px] me-2" />
              {row.replied && <span className="text-sm">View</span>}
            </IconButton>
          </Tooltip>

          {/* Mail */}
          {!row.replied && (
            <Tooltip title="Send Replay Mail" arrow>
              <IconButton
                onClick={() => {
                  setMailData({
                    to: row.email,
                    name: row.name,
                  });
                  setOpenMail(true);
                }}
              >
                <i className="fa-duotone fa-solid fa-envelopes text-blue-600 text-[20px]" />
              </IconButton>
            </Tooltip>
          )}

          {/* Delete */}
          <Tooltip title="Delete" arrow>
            <IconButton
              color="error"
              onClick={() => {
                setDeleteId(row._id);
                setOpenDelete(true);
              }}
            >
              <i className="fa-duotone fa-solid fa-trash-can text-red-600 text-[20px]" />
            </IconButton>
          </Tooltip>
        </div>
      );
    },
  },
];
