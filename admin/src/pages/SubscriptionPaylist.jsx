import jsPDF from "jspdf";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import Chip from "@mui/joy/Chip";
import { DatePicker } from "antd";
import { Paper } from "@mui/material";
import html2canvas from "html2canvas";
import { DataGrid } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
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
  Option,
  Select,
  FormLabel,
  FormControl,
  Input,
} from "@mui/joy";

import { AuthContext } from "../context/AuthContext";
import { MemberContext } from "../context/MemberContext";
import { SubscriptionContext } from "../context/SubscriptionContext";

import { PageLocation } from "../components/PageLocation";

const SubscriptionPaylist = () => {
  const navigate = useNavigate();

  const { currentDate } = useContext(AuthContext);
  const { members, findMember, updateSubscription } = useContext(MemberContext);
  const { subscriptions, subscriptionName, findSubscriptionByID } =
    useContext(SubscriptionContext);

  const [editId, setEditid] = useState(null);
  const [openpay, setOpenpay] = useState(false);
  const [openedit, setOpenedit] = useState(false);
  const [memberRows, setMemberRows] = useState([]);
  const [subscription, setSubscription] = useState({
    membershipPlan: null,
    startDate: currentDate,
    planDuration: "",
    planCost: "",
    endDate: "",
    pending: 0,
  });

  useEffect(() => {
    const convertToRowFormat = async (data) => {
      let index = 0;
      const rows = await Promise.all(
        data.map(async (member) => ({
          id: `${member.username.toUpperCase()} - ${member.name}`,
          plan: await subscriptionName(member.subscription.membershipPlan),
          price: member.subscription.planCost.toFixed(1),
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

  const editPlan = async (memberId, edit = true) => {
    setEditid(memberId);
    const member = await findMember(memberId);
    setSubscription({ ...member.subscription });
    edit ? setOpenedit(true) : setOpenpay(true);
  };

  const columns = [
    {
      field: "id",
      headerName: "Id - Name",
      flex: 2,
      headerAlign: "center",
      align: "center",
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
      headerName: "price",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div>{`₹ ${Number(params.row.price).toFixed(1)}`}</div>
      ),
    },
    {
      field: "received",
      headerName: "received",
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
      width: 110,
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
            : "Partially"}
        </Chip>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="flex justify-center space-x-2 mt-2">
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
    setEditid(null);
    setOpenedit(false);
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
          <div className="flex justify-between">
            <div className="flex gap-3">
              {/* <Tooltip title="Copy" placement="top" arrow>
                <Button
                  className="transition-all duration-300"
                  onClick={copyToClipboard}
                  variant="outlined"
                  color="neutral"
                  size="md"
                  sx={{
                    px: 2,
                  }}
                >
                  <i
                    className="fa-duotone fa-solid fa-copy"
                    style={{ fontSize: "23px" }}
                  ></i>
                </Button>
              </Tooltip>
              <Tooltip title="Excel" placement="top" arrow>
                <Button
                  className="transition-all duration-300"
                  onClick={exportToExcel}
                  variant="outlined"
                  color="neutral"
                  size="md"
                  sx={{
                    px: 2,
                  }}
                >
                  <i
                    className="fa-duotone fa-solid fa-file-excel"
                    style={{ fontSize: "23px" }}
                  ></i>
                </Button>
              </Tooltip>
              <Tooltip title="CSV" placement="top" arrow>
                <Button
                  className="transition-all duration-300"
                  onClick={exportToCSV}
                  variant="outlined"
                  color="neutral"
                  size="md"
                  sx={{
                    px: 2,
                  }}
                >
                  <i
                    className="fa-duotone fa-solid fa-file-csv"
                    style={{ fontSize: "23px" }}
                  ></i>
                </Button>
              </Tooltip>
              <Tooltip title="PDF" placement="top" arrow>
                <Button
                  className="transition-all duration-300"
                  onClick={exportToPDF}
                  variant="outlined"
                  color="neutral"
                  size="md"
                >
                  <i
                    className="fa-duotone fa-solid fa-file-pdf"
                    style={{ fontSize: "23px" }}
                  ></i>
                </Button>
              </Tooltip> */}
            </div>
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
    </div>
  );
};

export default SubscriptionPaylist;
