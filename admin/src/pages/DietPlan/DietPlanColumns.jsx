import Tooltip from "@mui/joy/Tooltip";
import IconButton from "@mui/joy/IconButton";

export const DietPlanColumns = ({navigate, setDeleteId, setOpenDelete}) => [
    {
        field: "dietPlanId",
        headerName: "Plan ID",
        flex: 1,
        headerAlign: "center",
        align: "center",
    },
    {
        field: "dietPlanName",
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
        renderCell: ({row}) => (
            <div
                className="flex justify-evenly space-x-2 mt-2"
                onClick={(e) => e.stopPropagation()}
            >
                <Tooltip title="View" arrow>
                    <IconButton
                        onClick={() =>
                            navigate(`/plan/diet/details/${row._id}`, {state: {edit: false}})
                        }
                    >
                        <i className="fa-duotone fa-eye text-blue-600 text-[22px]"/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Edit" arrow>
                    <IconButton
                        onClick={() =>
                            navigate(`/plan/diet/details/${row._id}`, {state: {edit: true}})
                        }
                    >
                        <i className="fa-duotone fa-pencil text-green-600 text-[20px]"/>
                    </IconButton>
                </Tooltip>

                <Tooltip title="Delete" arrow>
                    <IconButton
                        color="error"
                        onClick={() => {
                            setDeleteId(row._id);
                            setOpenDelete(true);
                        }}
                    >
                        <i className="fa-duotone fa-trash-can text-red-600 text-[20px]"/>
                    </IconButton>
                </Tooltip>
            </div>
        ),
    },
];
