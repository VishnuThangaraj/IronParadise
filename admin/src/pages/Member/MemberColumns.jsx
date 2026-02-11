import Tooltip from "@mui/joy/Tooltip";
import IconButton from "@mui/joy/IconButton";

export const MemberColumns = ({ navigate, setDeleteId, setOpenDelete }) => [
  {
    field: "memberId",
    headerName: "Member ID",
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
    field: "membershipName",
    headerName: "Subscription Plan",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "trainerName",
    headerName: "Trainer",
    flex: 1,
    headerAlign: "center",
    align: "center",
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
          {/* Mail */}
          <Tooltip title="Change Fitness Plan" arrow>
            <IconButton
              onClick={() => {
                console.log("Member");
                return;
              }}
            >
              <i className="fa-sharp-duotone fa-solid fa-arrows-rotate-reverse text-blue-600 text-[20px]" />
            </IconButton>
          </Tooltip>

          {/* Edit */}
          <Tooltip title="Edit" arrow>
            <IconButton
              onClick={() =>
                navigate(`/member/details/${row._id}`, {
                  state: { edit: true },
                })
              }
            >
              <i className="fa-duotone fa-solid fa-pencil text-green-600 text-[20px]" />
            </IconButton>
          </Tooltip>

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
