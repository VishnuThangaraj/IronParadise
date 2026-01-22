import Tooltip from "@mui/joy/Tooltip";
import IconButton from "@mui/joy/IconButton";

export const WorkoutPlanColumns = ({
  navigate,
  setDeleteId,
  setOpenDelete,
}) => [
  {
    field: "workoutPlanId",
    headerName: " Plan Id",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "workoutPlanName",
    headerName: "Plan Name",
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "goal",
    headerName: "Plan Goal",
    flex: 2,
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
          {/* Mail */}
          <Tooltip title="View" arrow>
            <IconButton
              onClick={() =>
                navigate(`/plan/workout/details/${row._id}`, {
                  state: { edit: false },
                })
              }
            >
              <i
                className="fa-duotone fa-solid fa-eye text-blue-600"
                style={{ fontSize: "22px" }}
              ></i>
            </IconButton>
          </Tooltip>

          {/* Edit */}
          <Tooltip title="Edit" arrow>
            <IconButton
              onClick={() =>
                navigate(`/plan/workout/details/${row._id}`, {
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
