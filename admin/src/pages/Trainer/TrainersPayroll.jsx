import { toast } from "sonner";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  Card,
  Modal,
  Input,
  Table,
  Button,
  Divider,
  Tooltip,
  FormLabel,
  IconButton,
  FormControl,
  CardContent,
  DialogTitle,
  ModalDialog,
  DialogContent,
  DialogActions,
  Select,
  Option,
  Chip,
} from "@mui/joy";

import { TrainerContext } from "../../context/TrainerContext";

import { PageLocation } from "../../components/PageLocation";

const TrainersPayroll = () => {
  const navigate = useNavigate();
  const { trainers, findTrainerByID, customSalary, trainerSalaryHistory } =
    useContext(TrainerContext);

  const [salaryHis, setSalaryHis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [trainerRows, setTrainerRows] = useState([]);
  const [openSalary, setOpenSalary] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [openPayment, setOpenPayment] = useState(false);
  const [openCPayment, setOpenCPayment] = useState(false);
  const [payment, setPayment] = useState({
    trainer: null,
    amount: "",
    trainerName: "",
    salary: "",
    pending: 0,
    due: 0,
    paymentMethod: "cash",
  });

  useEffect(() => {
    const convertToRowFormat = (data) => {
      let index = 0;
      const rows = data.map((trainer) => ({
        id: `${trainer.username.toUpperCase()}`,
        name: trainer.name,
        email: trainer.email,
        salary: `₹ ${trainer.salary.toFixed(1)}`,
        month: `Failed`,
        status: `Failed`,
        index: index++,
        pending: trainer.pending,
        full_id: trainer._id,
      }));
      return rows;
    };

    const rows = convertToRowFormat(trainers);
    setTrainerRows(rows);
  }, [trainers]);

  const convertToRowFormat = (data) => {
    let index = 0;
    const rows = data.map((trainer) => ({
      id: `${trainer.username.toUpperCase()}`,
      name: trainer.name,
      email: trainer.email,
      salary: `₹ ${trainer.salary.toFixed(1)}`,
      status: `Failed`,
      index: index++,
      pending: trainer.pending,
      full_id: trainer._id,
    }));
    return rows;
  };

  const filteredRows = convertToRowFormat(trainers).filter(
    (row) =>
      row.id.toLowerCase().includes(searchTerm) ||
      row.name.toLowerCase().includes(searchTerm) ||
      row.email.toLowerCase().includes(searchTerm) ||
      row.salary.toLowerCase().includes(searchTerm)
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

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
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Chip
          color={params.row.pending == 0 ? "success" : "warning"}
          style={{ paddingTop: "2px" }}
          className="shadow-md"
          variant="soft"
        >
          {params.row.pending == 0 ? "Fully Paid" : "Pending"}
        </Chip>
      ),
    },
    {
      field: "pending",
      headerName: "Pending Amount",
      align: "center",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => <div>₹ {`${params.row.pending.toFixed(1)}`}</div>,
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
          <Tooltip title="Salary Payment" placement="top" arrow>
            <IconButton
              aria-label="salary payment"
              onClick={() => {
                if (params.row.pending === 0)
                  return toast.info("Trainer Salary is Already Paid");

                customPayment(params.row.full_id);
              }}
            >
              <i
                className="fa-duotone fa-solid fa-credit-card text-green-600"
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
    setOpenPayment(true);
  };

  const trainerSalaryConfirmation = async () => {
    if (!payment.amount)
      return toast.info("Amount should not be empty or Zero.");
    await customSalary(payment);
    setOpenPayment(false);
    setPayment({
      trainer: null,
      trainerName: "",
      amount: "",
      pending: "",
      due: "",
      salary: "",
      paymentMethod: "cash",
    });
    setOpenCPayment(false);
  };

  const customPayment = async (trainerId) => {
    const trainer = await findTrainerByID(trainerId);
    setPayment({
      trainer: trainerId,
      trainerName: trainer.name,
      amount: 0,
      pending: trainer.pending,
      due: trainer.pending,
      salary: trainer.salary,
      paymentMethod: "cash",
    });
    setOpenCPayment(true);
  };

  const handlePaymentChange = (event, newValue) => {
    setPayment({ ...payment, ["paymentMethod"]: newValue });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (isNaN(Number(value)) || payment.due - value < 0) {
      return;
    }

    setPayment({
      ...payment,
      pending: payment.due - value,
      [name]: value,
    });
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
          <div className="flex justify-between gap-4">
            <div>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: "350px" }}
              />
            </div>
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
              rows={filteredRows}
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

      {/* Payment Confirmation */}
      <Modal open={openPayment} onClose={() => setOpenPayment(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "510px" }}
        >
          <DialogTitle>
            <i className="fa-duotone fa-thin fa-wallet text-green-600 mt-1 me-1"></i>
            Salary Payment Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className=" my-4">
              Are you sure to make payment for the selected{" "}
              <span className="font-semibold"> {selectedUser.length} </span>{" "}
              Trainers?
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className="rounded-full py-1"
              variant="solid"
              color="success"
              // onClick={trainerSalaryConfirmation}
            >
              Confirm
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpenPayment(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* Custom Salary Payment  */}
      <Modal open={openCPayment} onClose={() => setOpenCPayment(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "700px" }}
        >
          <DialogTitle>
            <i className="fa-duotone fa-solid fa-credit-card mt-1 me-1"></i>
            Salary Payment
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="flex justify-between my-4">
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Trainer Name</FormLabel>
                <Input
                  placeholder="Trainer Name"
                  value={payment.trainerName}
                  name="trainerName"
                  variant="outlined"
                  size="md"
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  disabled
                  required
                />
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Trainer Salary</FormLabel>
                <Input
                  placeholder="Trainer Salary"
                  value={payment.salary}
                  name="trainerSalary"
                  variant="outlined"
                  size="md"
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  disabled
                  required
                />
              </FormControl>
            </div>
            <div className="flex justify-between mt-4">
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Mode of Payment</FormLabel>
                <Select
                  onChange={handlePaymentChange}
                  value={payment.paymentMethod}
                  name="paymentMethod"
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    height: "42px",
                  }}
                  required
                >
                  <Option value="cash">Cash</Option>
                  <Option value="upi">UPI</Option>
                  <Option value="creditcard">Credit Card</Option>
                  <Option value="debitcard">Debit Card</Option>
                  <Option value="banktransfer">Bank Transfer</Option>
                </Select>
              </FormControl>
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Due Amount</FormLabel>
                <Input
                  placeholder="₹ 00.00"
                  value={payment.pending}
                  variant="outlined"
                  name="amount"
                  size="md"
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  disabled
                  required
                />
              </FormControl>
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Payment Amount</FormLabel>
                <Input
                  placeholder="₹ 00.00"
                  onChange={handleChange}
                  value={payment.amount}
                  variant="outlined"
                  name="amount"
                  size="md"
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  required
                />
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className="rounded-full py-1"
              variant="solid"
              color="success"
              onClick={trainerSalaryConfirmation}
            >
              Make Payment
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpenCPayment(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* Salary History */}
      <Modal open={openSalary} onClose={() => setOpenSalary(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "700px" }}
        >
          <DialogTitle>
            <i className="fa-sharp-duotone fa-solid fa-clock-rotate-left text-green-600 mt-1 me-1"></i>
            Salary History
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className=" my-4">
              <Table
                sx={{ "& tr > *:not(:first-child)": { textAlign: "right" } }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "20%", textAlign: "Center" }}>
                      Payment ID
                    </th>
                    <th style={{ textAlign: "Center" }}>Salary</th>
                    <th style={{ textAlign: "Center" }}>Paid</th>
                    <th style={{ textAlign: "Center" }}>Pending</th>
                    <th style={{ textAlign: "Center" }}>Mode</th>
                    <th style={{ textAlign: "Center" }}>Date</th>
                  </tr>
                </thead>
              </Table>
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                <Table
                  sx={{ "& tr > *:not(:first-child)": { textAlign: "right" } }}
                >
                  <tbody>
                    {salaryHis.length > 0 ? (
                      salaryHis.map((row, index) => (
                        <tr key={`pay-${index}`}>
                          <td style={{ textAlign: "center" }}>
                            {row._id.slice(17).toUpperCase()}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            ₹ {row.salary.toFixed(1)}
                          </td>
                          <td
                            className="text-green-600"
                            style={{ textAlign: "center" }}
                          >
                            ₹ {row.amount.toFixed(1)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            ₹ {row.pending.toFixed(1)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {row.paymentMethod.toUpperCase()}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {row.createdAt.slice(0, 10)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="fa-fade"
                          style={{ textAlign: "center", height: "100px" }}
                        >
                          NO HISTORY FOUND
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default TrainersPayroll;
