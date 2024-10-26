import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Modal,
  Button,
  Divider,
  Tooltip,
  IconButton,
  CardContent,
  DialogTitle,
  ModalDialog,
  DialogActions,
  DialogContent,
} from "@mui/joy";

import { PlanContext } from "../../context/PlanContext";

import { PageLocation } from "../../components/PageLocation";

const DietplanList = () => {
  const navigate = useNavigate();

  const { dietplans, deleteDietplan } = useContext(PlanContext);

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const convertToRowFormat = (data) => {
    let index = 0;
    return data.map((dietplan) => ({
      id: dietplan.planId.toUpperCase(),
      name: dietplan.dietPlanName,
      index: index++,
      full_id: dietplan._id,
    }));
  };

  const deleteDietplanWithId = async () => {
    await deleteDietplan(deleteId);
    setOpen(false);
  };

  const dietplanRows = convertToRowFormat(dietplans);
  const columns = [
    {
      field: "id",
      headerName: "Plan Id",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Plan Name",
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
      renderCell: (params) => (
        <div className="flex justify-center space-x-2 mt-2">
          <Tooltip title="View" placement="top" arrow>
            <IconButton
              aria-label="view"
              onClick={() => {
                navigate("/plan/diet/view", { state: params.row.full_id });
              }}
            >
              <i
                className="fa-duotone fa-solid fa-eye "
                style={{ fontSize: "22px" }}
              ></i>
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton
              aria-label="edit"
              onClick={() => {
                navigate("/plan/diet/edit", { state: params.row.full_id });
              }}
            >
              <i
                className="fa-duotone fa-solid fa-pencil"
                style={{ fontSize: "20px" }}
              ></i>
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" placement="top" arrow>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => {
                setDeleteId(params.row.full_id);
                setOpen(true);
              }}
            >
              <i
                className="fa-duotone fa-solid fa-trash-can"
                style={{ fontSize: "20px" }}
              ></i>
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div id="dietplanlist">
      <PageLocation
        pageTitle="Diet Plans List"
        parentPath="Fitness Plans"
        currentPath="Diet Plans List"
      />

      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 4 }}>
        <CardContent>
          <div className="flex justify-between flex-row-reverse">
            <div>
              <Button
                className="transition-all duration-300"
                variant="solid"
                onClick={() => navigate("/member/add")}
                size="md"
                sx={{
                  px: 4,
                  borderRadius: 20,
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "#222222",
                  },
                }}
              >
                Add New Member
              </Button>
            </div>
            <div>
              <Button
                className="transition-all duration-300"
                variant="solid"
                onClick={() => navigate("/plan/diet/add")}
                size="md"
                sx={{
                  px: 4,
                  borderRadius: 20,
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "#222222",
                  },
                }}
              >
                Add Diet Plan
              </Button>
            </div>
          </div>
          <Paper
            id="subscription-table"
            sx={{
              height: 400,
              my: 2,
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <DataGrid
              rows={dietplanRows}
              columns={columns}
              initialState={{ pagination: { page: 0, pageSize: 5 } }}
              sx={{
                border: 0,
                borderRadius: 2,
                backgroundColor: "rgba(187, 221, 218, 0.048)",
                backdropFilter: "blur(10px)",
              }}
              className="shadow-md"
            />
          </Paper>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <i className="fa-regular fa-trash-clock mt-1 me-1"></i>
            Delete Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to delete the Plan from the list ?
          </DialogContent>
          <DialogActions>
            <Button
              className="rounded-full py-1"
              variant="solid"
              color="danger"
              onClick={deleteDietplanWithId}
            >
              Delete Plan
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default DietplanList;
