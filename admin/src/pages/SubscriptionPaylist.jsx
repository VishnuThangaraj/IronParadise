import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { DatePicker } from "antd";
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
  Textarea,
} from "@mui/joy";

import { AuthContext } from "../context/AuthContext";
import { MemberContext } from "../context/MemberContext";
import { GeneralContext } from "../context/GeneralContext";
import { SubscriptionContext } from "../context/SubscriptionContext";

import { PageLocation } from "../components/PageLocation";

function convertToIST(timestamp) {
  const date = new Date(timestamp);

  date.setHours(date.getUTCHours() + 5);
  date.setMinutes(date.getUTCMinutes() + 30);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
}

const SubscriptionPaylist = () => {
  const navigate = useNavigate();

  const { currentDate } = useContext(AuthContext);
  const { subscriptionMail, subscriptionMailIndividual } =
    useContext(GeneralContext);
  const { members, findMember, makePayment, updateSubscription } =
    useContext(MemberContext);
  const {
    subscriptions,
    subscriptionName,
    memberPaymentHistory,
    findSubscriptionByID,
    memberSubscriptionHistory,
  } = useContext(SubscriptionContext);

  const [editId, setEditid] = useState(null);
  const [openpay, setOpenpay] = useState(false);
  const [opensub, setOpensub] = useState(false);
  const [notifyId, setNotifyId] = useState(null);
  const [openedit, setOpenedit] = useState(false);
  const [memberRows, setMemberRows] = useState([]);
  const [openNotify, setOpenNotify] = useState(false);
  const [openpayhis, setOpenpayhis] = useState(false);
  const [openIndividual, setOpenIndividual] = useState(false);
  const [notificationCategory, setNotificationCategory] = useState("");
  const [payment, setPayment] = useState({
    amount: "",
    paymentMethod: "cash",
    dueAmount: 0,
    remarks: "",
  });
  const [subscription, setSubscription] = useState({
    membershipPlan: null,
    startDate: currentDate,
    planDuration: "",
    planCost: "",
    endDate: "",
    pending: 0,
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);

  useEffect(() => {
    const convertToRowFormat = async (data) => {
      let index = 0;
      const rows = await Promise.all(
        data.map(async (member) => ({
          id: `${member.username.toUpperCase()} - ${member.name}`,
          plan: await subscriptionName(member.subscription.membershipPlan),
          price: member.subscription.planCost,
          status: member.subscription.planCost,
          duration: member.subscription.planDuration,
          enddate: member.subscription.endDate.slice(0, 10),
          startdate: member.subscription.startDate.slice(0, 10),
          received: member.subscription.planCost - member.subscription.pending,
          subscription:
            member.subscription.pending < member.subscription.planCost,
          index: index++,
          full_id: member._id,
        }))
      );
      return rows;
    };

    const fetchRows = async () => {
      const rows = await convertToRowFormat(members);
      setMemberRows(rows);
    };

    fetchRows();
  }, [members, subscriptionName]);

  const exportToExcel = () => {
    if (paymentHistory.length === 0)
      return toast.info("Payment History is Empty to Export.");

    const worksheet = XLSX.utils.json_to_sheet(paymentHistory);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PaymentHistory");
    XLSX.writeFile(workbook, "paymenthistory.xlsx");

    toast.success("Payment History exported to Excel 📃");
  };

  const editPlan = async (memberId, edit = true) => {
    setEditid(memberId);
    const member = await findMember(memberId);
    setSubscription({ ...member.subscription });
    if (edit) {
      setOpenedit(true);
    } else {
      setOpenpay(true);
      setPayment({
        member: memberId,
        subscription: member.subscription.membershipPlan,
        amount: "",
        dueAmount: member.subscription.pending || 0,
        paymentMethod: "cash",
      });
    }
  };

  const handlePaymentChange = (event, newValue) => {
    setPayment({ ...payment, ["paymentMethod"]: newValue });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "amount" && isNaN(Number(value))) ||
      subscription.pending - value < 0
    ) {
      return;
    }
    if (name === "amount")
      setPayment({
        ...payment,
        dueAmount: subscription.pending - value,
        [name]: value,
      });
    else
      setPayment({
        ...payment,
        [name]: value,
      });
  };

  const handleCategoryChange = (event, newValue) => {
    setNotificationCategory(newValue);
  };

  const getPaymentHistory = async (memberId) => {
    const history = await memberPaymentHistory(memberId);
    setPaymentHistory(history.reverse());
    setOpenpayhis(true);
  };

  const getSubscriptionHistory = async (memberId) => {
    const history = await memberSubscriptionHistory(memberId);
    setSubscriptionHistory(history);
    console.log(history);
    setOpensub(true);
  };

  const paymentReminder = (memberId) => {
    setNotifyId(memberId);
    setOpenIndividual(true);
  };

  const notifyConfirmation = async () => {
    setOpenIndividual(false);
    toast.success("Mail Sent Successfully 📨✔️");
    await subscriptionMailIndividual(notifyId);
    setNotifyId(null);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID - Name",
      flex: 2,
      headerAlign: "center",
    },
    {
      field: "plan",
      headerName: "Plan",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "startdate",
      headerName: "Start Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "enddate",
      headerName: "End Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "subscription",
      headerName: "Subscription",
      width: 110,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          color={params.row.subscription ? "success" : "danger"}
          style={{ paddingTop: "2px" }}
          className="shadow-md"
          variant="soft"
        >
          {params.row.subscription ? "ACTIVE" : "INACTIVE"}
        </Chip>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div>{`₹ ${Number(params.row.price).toFixed(1)}`}</div>
      ),
    },
    {
      field: "received",
      headerName: "Received",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div>{`₹ ${Number(params.row.received).toFixed(1)}`}</div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 135,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          color={
            params.row.received === params.row.price
              ? "success"
              : params.row.received === 0
              ? "danger"
              : "warning"
          }
          style={{ paddingTop: "2px" }}
          className="shadow-md"
          variant="soft"
        >
          {params.row.received === params.row.price
            ? "Fully Paid"
            : params.row.received === 0
            ? "Unpaid"
            : "Partially Paid"}
        </Chip>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex justify-center space-x-1 mt-2">
          <Tooltip title="Payment Reminder" placement="top" arrow>
            <IconButton
              aria-label="payment reminder"
              onClick={() => {
                if (params.row.received === params.row.price)
                  return toast.info(
                    "Member have Already Paid the Subscription Amount."
                  );
                paymentReminder(params.row.full_id);
              }}
            >
              <i
                className="fa-duotone fa-light fa-envelope text-green-600"
                style={{ fontSize: "20px" }}
              ></i>
            </IconButton>
          </Tooltip>
          <Tooltip title="Subscription History" placement="top" arrow>
            <IconButton
              aria-label="subscription history"
              onClick={() => getSubscriptionHistory(params.row.full_id)}
            >
              <i
                className="fa-sharp-duotone fa-solid fa-clock-rotate-left text-green-600"
                style={{ fontSize: "20px" }}
              ></i>
            </IconButton>
          </Tooltip>
          <Tooltip title="Payment" placement="top" arrow>
            <IconButton
              aria-label="payment"
              onClick={() => {
                params.row.received !== params.row.price
                  ? editPlan(params.row.full_id, false)
                  : toast.info("Payment Is Already Done");
              }}
            >
              <i
                className="fa-duotone fa-solid fa-credit-card text-green-600"
                style={{ fontSize: "20px" }}
              ></i>
            </IconButton>
          </Tooltip>
          <Tooltip title="Payment History" placement="top" arrow>
            <IconButton
              aria-label="payment history"
              onClick={() => getPaymentHistory(params.row.full_id)}
            >
              <i
                className="fa-sharp-duotone fa-solid fa-clock-rotate-left text-green-600"
                style={{ fontSize: "20px" }}
              ></i>
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Subscription" placement="top" arrow>
            <IconButton
              aria-label="edit"
              onClick={() => {
                params.row.received === 0 ||
                dayjs(params.row.endDate, "YYYY-MM-DD").isBefore(
                  dayjs(currentDate, "YYYY-MM-DD")
                )
                  ? editPlan(params.row.full_id, true)
                  : toast.info("Active subscriptions can't be changed");
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

  const handleSubscriptionChange = async (event, newValue) => {
    const current = await findSubscriptionByID(newValue);
    setSubscription({
      ...subscription,
      membershipPlan: newValue,
      planDuration: current.duration,
      planCost: current.price,
      endDate: dayjs(subscription.startDate)
        .add(current.duration, "month")
        .format("YYYY-MM-DD"),
      pending: current.price,
    });
  };

  const updateSubPlan = async () => {
    await updateSubscription(editId, subscription);
    setSubscription({
      membershipPlan: null,
      startDate: currentDate,
      planDuration: "",
      planCost: "",
      endDate: "",
      pending: 0,
    });
    setEditid(null);
    setOpenedit(false);
  };

  const updatePayment = async () => {
    if (payment.amount === "" || payment.amount === 0) {
      return toast.info("Payment Amount should not be empty or 0");
    }
    await makePayment(payment);
    setEditid(null);
    setPayment({
      amount: "",
      paymentMethod: "cash",
      dueAmount: 0,
      remarks: "",
    });
    setOpenpay(false);
  };

  const scheduleMail = async () => {
    if (!notificationCategory || notificationCategory === "") {
      return toast.info("Please Select the Subscription Category!");
    }
    subscriptionMail(notificationCategory);
    toast.success("Mail Sent Successfully 📨✔️");
    setNotificationCategory("");
    setOpenNotify(false);
  };

  return (
    <div id="subscriptionpaylist">
      <PageLocation
        pageTitle="Subscription PayList"
        parentPath="Subscription"
        currentPath="Subscription PayList"
      />

      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 4 }}>
        <CardContent>
          <div className="flex flex-row-reverse gap-4">
            <div className="flex gap-3"></div>
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
                onClick={() => setOpenNotify(true)}
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
                <i className="fa-light fa-envelopes me-2"></i> Notify
                Subscription
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
              rows={memberRows}
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

      {/* Change Subscription */}
      <Modal open={openedit} onClose={() => setOpenedit(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "800px" }}
        >
          <DialogTitle>
            <i className="fa-regular fa-crown mt-1 me-1"></i>
            Update Subscription Plan
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="flex justify-between my-4">
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Select Plan</FormLabel>
                <Select
                  placeholder="Select Subscription Plan"
                  value={subscription.membershipPlan}
                  onChange={handleSubscriptionChange}
                  name="subscription"
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    height: "42px",
                  }}
                  required
                >
                  {subscriptions.map((subscription, index) => (
                    <Option
                      key={`subscription-${index}`}
                      value={subscription._id}
                    >
                      {subscription.name}
                    </Option>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>
                  Plan Duration (in Months)
                </FormLabel>
                <Input
                  placeholder="Months"
                  value={subscription.planDuration}
                  name="planDuration"
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
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>
                  Plan Cost ( &#8377; )
                </FormLabel>
                <Input
                  placeholder="₹ 00.00"
                  value={subscription.planCost}
                  variant="outlined"
                  name="planCost"
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
            <div className="flex justify-between">
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Plan Start Date</FormLabel>
                <DatePicker
                  value={
                    subscription.startDate
                      ? dayjs(subscription.startDate, "YYYY-MM-DD")
                      : null
                  }
                  format="YYYY-MM-DD"
                  style={{
                    height: "42px",
                  }}
                  onChange={null}
                />
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Plan End Date</FormLabel>
                <DatePicker
                  value={
                    subscription.endDate
                      ? dayjs(subscription.endDate, "YYYY-MM-DD")
                      : null
                  }
                  format="YYYY-MM-DD"
                  style={{
                    height: "42px",
                  }}
                  onChange={null}
                />
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className="rounded-full py-1"
              variant="solid"
              color="success"
              onClick={updateSubPlan}
            >
              Update Plan
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpenedit(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* Make Payment */}
      <Modal open={openpay} onClose={() => setOpenpay(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "900px" }}
        >
          <DialogTitle>
            <i className="fa-duotone fa-solid fa-credit-card mt-1 me-1"></i>
            Make Payment
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="flex justify-between my-4">
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Plan Name</FormLabel>
                <Select
                  placeholder="Select Subscription Plan"
                  value={subscription.membershipPlan}
                  onChange={handleSubscriptionChange}
                  name="subscription"
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    height: "42px",
                  }}
                  disabled
                  required
                >
                  {subscriptions.map((subscription, index) => (
                    <Option
                      key={`subscription-${index}`}
                      value={subscription._id}
                    >
                      {subscription.name}
                    </Option>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>
                  Plan Duration (in Months)
                </FormLabel>
                <Input
                  placeholder="Months"
                  value={subscription.planDuration}
                  name="planDuration"
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
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>
                  Plan Cost ( &#8377; )
                </FormLabel>
                <Input
                  placeholder="₹ 00.00"
                  value={subscription.planCost}
                  variant="outlined"
                  name="planCost"
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
            <div className="flex justify-between">
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Plan Start Date</FormLabel>
                <DatePicker
                  value={
                    subscription.startDate
                      ? dayjs(subscription.startDate, "YYYY-MM-DD")
                      : null
                  }
                  format="YYYY-MM-DD"
                  style={{
                    height: "42px",
                  }}
                  onChange={null}
                />
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Plan End Date</FormLabel>
                <DatePicker
                  value={
                    subscription.endDate
                      ? dayjs(subscription.endDate, "YYYY-MM-DD")
                      : null
                  }
                  format="YYYY-MM-DD"
                  style={{
                    height: "42px",
                  }}
                  onChange={null}
                />
              </FormControl>
            </div>
            <div className="flex justify-between mt-4">
              <FormControl sx={{ width: "32%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Mode of Payment</FormLabel>
                <Select
                  onChange={handlePaymentChange}
                  placeholder="Payment Method"
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
                  value={payment.dueAmount}
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
            <div className="flex justify-between mt-4">
              <FormControl sx={{ width: "99%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Remarks</FormLabel>
                <Textarea
                  placeholder="Payment Remarks"
                  value={payment.remarks}
                  onChange={handleChange}
                  variant="outlined"
                  name="remarks"
                  size="md"
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  minRows={3}
                  maxRows={5}
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
              onClick={updatePayment}
            >
              Make Payment
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpenpay(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* Payment History */}
      <Modal open={openpayhis} onClose={() => setOpenpayhis(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "1100px" }}
        >
          <DialogTitle>
            <div className="flex justify-between w-full px-1">
              <div>
                <i className="fa-sharp-duotone fa-solid fa-clock-rotate-left text-green-600 mt-1 me-1"></i>
                Payment History
              </div>
              <div>
                <Tooltip title="Excel" placement="top" arrow>
                  <Button
                    className="transition-all duration-300"
                    onClick={exportToExcel}
                    variant="outlined"
                    color="warning"
                    size="md"
                    sx={{
                      px: 2,
                    }}
                  >
                    <i
                      className="fa-duotone fa-solid fa-file-excel me-3"
                      style={{ fontSize: "23px" }}
                    ></i>{" "}
                    Export
                  </Button>
                </Tooltip>
              </div>
            </div>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="flex justify-between my-4">
              <Table
                sx={{ "& tr > *:not(:first-child)": { textAlign: "right" } }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>Payment ID</th>
                    <th style={{ textAlign: "Center" }}>Plan Name</th>
                    <th style={{ textAlign: "Center" }}>Paid</th>
                    <th style={{ textAlign: "Center" }}>Due</th>
                    <th style={{ textAlign: "Center" }}>Method</th>
                    <th style={{ textAlign: "Center" }}>Date</th>
                    <th style={{ textAlign: "Center" }}>Time</th>
                    <th style={{ width: "20%", textAlign: "Center" }}>
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((row, index) => (
                    <tr key={`pay-${index}`}>
                      <td>{row._id.slice(17).toUpperCase()}</td>
                      <td style={{ textAlign: "Center" }}>
                        {row.subscription.name}
                      </td>
                      <td style={{ textAlign: "Center" }}>
                        &#8377;{row.amount.toFixed(1)}
                      </td>
                      <td style={{ textAlign: "Center" }}>
                        &#8377;{row.dueAmount.toFixed(1)}
                      </td>
                      <td style={{ textAlign: "Center" }}>
                        {row.paymentMethod.slice(0, 1).toUpperCase() +
                          row.paymentMethod.slice(1)}
                      </td>
                      <td style={{ textAlign: "Center" }}>
                        {row.createdAt.slice(0, 10)}
                      </td>
                      <td style={{ textAlign: "Center" }}>
                        {convertToIST(row.createdAt)}
                      </td>
                      <td style={{ textAlign: "Center" }}>{row.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>

      {/* Subscription History */}
      <Modal open={opensub} onClose={() => setOpensub(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "650px" }}
        >
          <DialogTitle>
            <i className="fa-sharp-duotone fa-solid fa-clock-rotate-left text-green-600 mt-1 me-1"></i>
            Subscription History
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="flex justify-between my-4">
              <Table
                sx={{ "& tr > *:not(:first-child)": { textAlign: "right" } }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "12%" }}>Plan ID</th>
                    <th style={{ textAlign: "Center" }}>Plan Name</th>
                    <th style={{ textAlign: "Center" }}>Duration</th>
                    <th style={{ textAlign: "Center" }}>Start Date</th>
                    <th style={{ textAlign: "Center" }}>End Date</th>
                    <th style={{ textAlign: "Center" }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionHistory.map((row, index) => (
                    <tr key={`pay-${index}`}>
                      <td>{row.subscription.planId.toUpperCase()}</td>
                      <td style={{ textAlign: "Center" }}>
                        {row.subscription.name}
                      </td>
                      <td style={{ textAlign: "Center" }}>
                        {row.subscription.duration} Months
                      </td>
                      <td style={{ textAlign: "Center" }}>
                        {row.startDate.slice(0, 10)}
                      </td>
                      <td style={{ textAlign: "Center" }}>
                        {row.endDate.slice(0, 10)}
                      </td>
                      <td style={{ textAlign: "Center" }}>
                        &#8377; {row.subscription.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>

      {/* Mail Confirmation */}
      <Modal open={openIndividual} onClose={() => setOpenIndividual(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "500px" }}
        >
          <DialogTitle>
            <i className="fa-regular fa-envelopes-bulk text-green-600 mt-1 me-1"></i>
            Payment Reminder Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="flex justify-between mt-1">
              Are you sure to make Email Notification for the Subscription
              Payment ?
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className="rounded-full py-1"
              variant="solid"
              color="success"
              onClick={notifyConfirmation}
            >
              Confirm
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpenIndividual(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>

      {/* Subscription Notification */}
      <Modal open={openNotify} onClose={() => setOpenNotify(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "650px" }}
        >
          <DialogTitle>
            <i className="fa-regular fa-envelopes-bulk text-green-600 mt-1 me-1"></i>
            Subscription Notification
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="flex justify-between mt-4">
              <FormControl sx={{ width: "100%" }}>
                <FormLabel sx={{ fontSize: 15 }}>
                  Select Subscription Category
                </FormLabel>
                <Select
                  onChange={handleCategoryChange}
                  placeholder="Select Category"
                  value={notificationCategory}
                  variant="outlined"
                  name="notificationcategory"
                  sx={{
                    backgroundColor: "white",
                    height: "42px",
                  }}
                  required
                >
                  <Option value="partial">Partially Paid Members</Option>
                  <Option value="unpaid">Unpaid Members</Option>
                  <Option value="both">
                    Both (Partially Paid & Unpaid Members)
                  </Option>
                  <Option value="everyone">Everyone</Option>
                </Select>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className="rounded-full py-1"
              variant="solid"
              color="success"
              onClick={scheduleMail}
            >
              <i className="fa-light fa-envelope me-2"></i>
              Send Mail
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpenNotify(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default SubscriptionPaylist;
