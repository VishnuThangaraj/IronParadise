import Button from "@mui/joy/Button";
import Tooltip from "@mui/joy/Tooltip";
import IconButton from "@mui/joy/IconButton";

export const AttendanceCalendarColumns = ({
  navigate,
  setSessionUser,
  setOpenSession,
}) => [
  {
    field: "userId",
    headerName: "User ID",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "userName",
    headerName: "Name",
    flex: 1,
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
      const role = row.userType.toUpperCase();
      return (
        <div className={`font-semibold `}>
          {`${role == "MEMBER" ? "MEMBER" : "TRAINER"}`}
        </div>
      );
    },
  },
  {
    field: "viewSessions",
    headerName: "View Sessions",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const { row } = params;
      const role = row.userType;
      const path = `/${role == "Member" ? "member" : "trainer"}/details/${row.user_id}`;

      return (
        <div
          className="flex flex-row gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <Tooltip title="View User" arrow>
              <IconButton
                color="success"
                onClick={() => {
                  navigate(path, {
                    state: { edit: false },
                  });
                }}
              >
                <i className="fa-duotone fa-light fa-user text-green-400 text-[20px]" />
              </IconButton>
            </Tooltip>
          </div>
          <div>
            <Tooltip title="View Sessions" arrow>
              <Button
                color="neutral"
                variant="outlined"
                onClick={() => {
                  setSessionUser({
                    name: row.userName,
                    sessions: row.sessions,
                  });
                  setOpenSession(true);
                }}
              >
                <i className="fa-light fa-clock text-gray-600 text-[20px] me-2" />{" "}
                Sessions
              </Button>
            </Tooltip>
          </div>
        </div>
      );
    },
  },
];
