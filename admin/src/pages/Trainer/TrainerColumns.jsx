import Tooltip from "@mui/joy/Tooltip";
import IconButton from "@mui/joy/IconButton";

export const TrainerColumns = ({
  navigate,
  setMailData,
  setOpenMail,
  setDeleteId,
  setOpenDelete,
}) => [
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

      let date = new Date(value);

      if (isNaN(date.getTime()) && typeof value === "string") {
        const [day, month, year] = value.split("-");
        date = new Date(`${year}-${month}-${day}T00:00:00`);
      }

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
    renderCell: (params) => {
      const { row } = params;

      return (
        <div
          className="flex justify-evenly space-x-2 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mail */}
          <Tooltip title="Mail" arrow>
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

          {/* Edit */}
          <Tooltip title="Edit" arrow>
            <IconButton
              onClick={() =>
                navigate(`/trainer/details/${row._id}`, {
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
