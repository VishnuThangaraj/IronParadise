import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Paper } from "@mui/material";
import html2canvas from "html2canvas";
import { DataGrid } from "@mui/x-data-grid";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Chip,
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
} from "@mui/joy";

import { PlanContext } from "../../context/PlanContext";
import { MemberContext } from "../../context/MemberContext";

import { PageLocation } from "../../components/PageLocation";

const MembersList = () => {
  const navigate = useNavigate();

  const { workoutplans, dietplans } = useContext(PlanContext);
  const { members, findMember, updateFitnessPlan, deleteMember } =
    useContext(MemberContext);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openplan, setOpenplan] = useState(false);
  const [plandata, setPlandata] = useState({
    dietplan: null,
    workoutplan: null,
  });

  const convertToRowFormat = (data) => {
    let index = 0;
    return data.map((member) => ({
      id: member.username.toUpperCase(),
      name: member.name,
      email: member.email,
      phone: member.phone,
      gender: member.gender.charAt(0).toUpperCase() + member.gender.slice(1),
      dietplan: member.dietPlan.dietPlanName,
      workoutplan: member.workoutPlan.workoutPlanName,
      trainer: member.trainerId.name,
      status: member.subscription.pending < member.subscription.planCost,
      index: index++,
      full_id: member._id,
    }));
  };

  const deleteMemberWithId = async () => {
    await deleteMember(deleteId);
    setOpen(false);
  };

  const triggerPlanChange = async (memberId) => {
    const member = await findMember(memberId);
    setPlandata({
      workoutplan: member.workoutPlan._id,
      dietplan: member.dietPlan._id,
    });
    setEditId(memberId);
    setOpenplan(true);
  };

  const memberRows = convertToRowFormat(members);
  const columns = [
    {
      field: "id",
      headerName: "Id",
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
      field: "dietplan",
      headerName: "Diet Plan",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "workoutplan",
      headerName: "Workout Plan",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "trainer",
      headerName: "Trainer",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          className="shadow-md"
          color={params.row.status ? "success" : "danger"}
          variant="soft"
        >
          {params.row.status ? "ACTIVE" : "INACTIVE"}
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
          <Tooltip title="Change Plan" placement="top" arrow>
            <IconButton
              aria-label="change plan"
              color="error"
              onClick={() => {
                triggerPlanChange(params.row.full_id);
              }}
            >
              <i
                className="fa-sharp-duotone fa-solid fa-arrows-rotate-reverse text-blue-600"
                style={{ fontSize: "20px" }}
              ></i>
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton
              aria-label="edit"
              onClick={() => {
                navigate("/member/edit", { state: params.row.full_id });
              }}
            >
              <i
                className="fa-duotone fa-solid fa-pencil text-green-600"
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
                className="fa-duotone fa-solid fa-trash-can text-red-600"
                style={{ fontSize: "20px" }}
              ></i>
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleDietChange = (event, newValue) => {
    setPlandata({ ...plandata, ["dietplan"]: newValue });
  };

  const handleWorkoutChange = (event, newValue) => {
    setPlandata({ ...plandata, ["workoutplan"]: newValue });
  };

  const copyToClipboard = () => {
    const tableData = memberRows
      .map((member) => {
        return `${member.id}\t${member.name}\t${member.phone}\t${member.dietplan}\t${member.workoutplan}\t${member.trainer}\t${member.status}\t`;
      })
      .join("\n");

    navigator.clipboard
      .writeText(tableData)
      .then(() => {
        toast.success("Table copied to clipboard 📃");
      })
      .catch((err) => {
        console.error("Error copying to clipboard: ", err);
      });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(memberRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
    XLSX.writeFile(workbook, "members.xlsx");

    toast.success("Table exported to Excel 📃");
  };

  const exportToPDF = () => {
    const input = document.getElementById("pdf-table");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "pt", "a4");
      const imgWidth = 842;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("members.pdf");
    });
    toast.success("Table exported to PDF 📃");
  };

  const updateDietPlan = async () => {
    await updateFitnessPlan(editId, plandata);
    setEditId(null);
    setOpenplan(false);
  };

  const exportToCSV = () => {
    toast.success("Table exported to CSV 📃");
    const csvData = memberRows.map((member) => {
      return {
        "Member Id": member.id,
        "Full Name": member.name,
        Contact: member.phone,
        "Diet Plan": member.dietplan,
        "Workout Plan": member.workoutplan,
        Trainer: member.trainer,
      };
    });

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "members.csv");
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="memberslist">
      <PageLocation
        pageTitle="Members List"
        parentPath="Members"
        currentPath="Members List"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 4 }}>
        <CardContent>
          <div className="flex justify-between">
            <div className="flex gap-3">
              <Tooltip title="Copy" placement="top" arrow>
                <Button
                  className="transition-all duration-300"
                  onClick={copyToClipboard}
                  variant="outlined"
                  color="warning"
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
                  color="warning"
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
                  color="warning"
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
                  color="warning"
                  size="md"
                >
                  <i
                    className="fa-duotone fa-solid fa-file-pdf"
                    style={{ fontSize: "23px" }}
                  ></i>
                </Button>
              </Tooltip>
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

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <i className="fa-light fa-user-slash  mt-1 me-1"></i>
            Delete Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to delete the Member from the list ?
          </DialogContent>
          <DialogActions>
            <Button
              className="rounded-full py-1"
              variant="solid"
              color="danger"
              onClick={deleteMemberWithId}
            >
              Delete Member
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

      {/* Change Plan */}
      <Modal open={openplan} onClose={() => setOpenplan(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "550px" }}
        >
          <DialogTitle>
            <i className="fa-regular fa-folder-heart mt-1 me-1"></i>
            Update Fitness Plan
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="text font-bold text-xl my-3">Fitness Plans</div>
            <div className="flex justify-between">
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Select Diet Plan</FormLabel>
                <Select
                  placeholder="Select Diet Plan"
                  onChange={handleDietChange}
                  value={plandata.dietplan}
                  variant="outlined"
                  name="dietPlan"
                  sx={{
                    backgroundColor: "white",
                    height: "42px",
                  }}
                  required
                >
                  {dietplans.map((dietplan, index) => (
                    <Option key={`dietplan-${index}`} value={dietplan._id}>
                      {dietplan.dietPlanName}
                    </Option>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Select Workout Plan</FormLabel>
                <Select
                  placeholder="Select Workout Plan"
                  onChange={handleWorkoutChange}
                  value={plandata.workoutplan}
                  variant="outlined"
                  name="workoutPlan"
                  sx={{
                    backgroundColor: "white",
                    height: "42px",
                  }}
                  required
                >
                  {workoutplans.map((workoutplan, index) => (
                    <Option
                      key={`workoutplan-${index}`}
                      value={workoutplan._id}
                    >
                      {workoutplan.workoutPlanName}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className="rounded-full py-1"
              variant="solid"
              color="success"
              onClick={updateDietPlan}
            >
              Update Plan
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

export default MembersList;
