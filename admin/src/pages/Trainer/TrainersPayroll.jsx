import { toast } from "sonner";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  Card,
  Chip,
  Modal,
  Input,
  Table,
  Button,
  Option,
  Select,
  Divider,
  Tooltip,
  FormLabel,
  IconButton,
  FormControl,
  CardContent,
  DialogTitle,
  ModalDialog,
  DialogActions,
  DialogContent,
} from "@mui/joy";

import { TrainerContext } from "../../context/TrainerContext";

import { PageLocation } from "../../components/PageLocation";

const TrainersPayroll = () => {
  const navigate = useNavigate();
  const { trainers, trainerSalaryHistory } = useContext(TrainerContext);

  const [salaryHis, setSalaryHis] = useState([]);
  const [trainerRows, setTrainerRows] = useState([]);
  const [openSalary, setOpenSalary] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);

  useEffect(() => {
    const convertToRowFormat = (data) => {
      let index = 0;
      const rows = data.map((trainer) => ({
        id: `${trainer.username.toUpperCase()}`,
        name: trainer.name,
        email: trainer.email,
        salary: `₹ ${trainer.salary.toFixed(1)}`,
        month: ``,
        index: index++,
        full_id: trainer._id,
      }));
      return rows;
    };

    const rows = convertToRowFormat(trainers);
    setTrainerRows(rows);
  }, [trainers]);

  const columns = [
    {
      field: "id",
      headerName: "Trainer ID",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email Address",
      flex: 2,
      headerAlign: "center",
    },
    {
      field: "salary",
      headerName: "Salary",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "pending",
      headerName: "Pending Month",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex justify-center space-x-1 mt-2">
          <Tooltip title="Salary History" placement="top" arrow>
            <IconButton
              aria-label="salary history"
              onClick={() => getSalaryHistory(params.row.full_id)}
            >
              <i
                className="fa-sharp-duotone fa-solid fa-clock-rotate-left text-green-600"
                style={{ fontSize: "20px" }}
              ></i>
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Trainer" placement="top" arrow>
            <IconButton
              aria-label="edit"
              onClick={() => {
                navigate("/trainer/edit", { state: params.row.full_id });
              }}
            >
              <i
                className="fa-duotone fa-solid fa-pencil  text-green-600"
                style={{ fontSize: "20px" }}
              ></i>
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const getSalaryHistory = async (trainerId) => {
    const history = await trainerSalaryHistory(trainerId);
    setSalaryHis(history.reverse());
    setOpenSalary(true);
  };

  const makePayment = async () => {
    if (!selectedUser || selectedUser.length === 0) {
      return toast.info("No Trainers Selected !");
    }
    // await
  };

  return (
    <div id="trianerspayroll">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Trainers"
        currentPath="Trainers Payroll"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 4 }}>
        <CardContent>
          <div className="flex justify-end gap-4">
            <div>
              <Button
                className="transition-all duration-300"
                variant="solid"
                onClick={makePayment}
                size="md"
                sx={{
                  px: 2,
                  borderRadius: 20,
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "#222222",
                  },
                }}
              >
                <i className="fa-regular fa-money-check-dollar me-2"></i>
                Make Payment
              </Button>
            </div>
          </div>
          <Paper
            id="pdf-table"
            sx={{
              height: 400,
              my: 2,
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <DataGrid
              rows={trainerRows}
              columns={columns}
              initialState={{ pagination: { page: 0, pageSize: 5 } }}
              pageSize={5}
              rowsPerPageOptions={[10]}
              checkboxSelection
              onRowSelectionModelChange={(newSelection) => {
                const selectedData = trainerRows.filter((row) =>
                  newSelection.includes(row.id)
                );
                const email = selectedData.map((row) => row.full_id);
                setSelectedUser(email);
              }}
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

      {/* Salary History */}
      <Modal open={openSalary} onClose={() => setOpenSalary(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "600px" }}
        >
          <DialogTitle>
            <i className="fa-sharp-duotone fa-solid fa-clock-rotate-left text-green-600 mt-1 me-1"></i>
            Salary History
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="flex justify-between my-4">
              <Table
                sx={{ "& tr > *:not(:first-child)": { textAlign: "right" } }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Payment ID</th>
                    <th style={{ textAlign: "Center" }}> Salary</th>
                    <th style={{ textAlign: "Center" }}>Amount Paid</th>
                    <th style={{ textAlign: "Center" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryHis.length > 0 ? (
                    salaryHis.map((row, index) => (
                      <tr key={`pay-${index}`}>
                        <td>{row._id.slice(17).toUpperCase()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="fa-fade "
                        style={{ textAlign: "center", height: "100px" }}
                      >
                        NO HISTORY FOUND
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default TrainersPayroll;
