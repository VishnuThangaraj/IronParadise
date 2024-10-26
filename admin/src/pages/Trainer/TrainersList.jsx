import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Paper } from "@mui/material";
import html2canvas from "html2canvas";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Fragment, useContext, useState } from "react";
import {
  Card,
  Modal,
  Button,
  Divider,
  Input,
  Tooltip,
  IconButton,
  CardContent,
  DialogTitle,
  ModalDialog,
  DialogActions,
  DialogContent,
  Textarea,
} from "@mui/joy";

import { AuthContext } from "../../context/AuthContext";
import { GeneralContext } from "../../context/GeneralContext";
import { TrainerContext } from "../../context/TrainerContext";

import { PageLocation } from "../../components/PageLocation";

const TrainersList = () => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { sendMail } = useContext(GeneralContext);
  const { trainers, deleteTrainer } = useContext(TrainerContext);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openMail, setOpenMail] = useState(false);
  const [mailData, setMailData] = useState({
    to: "",
    name: "",
    subject: "",
    message: "",
  });

  const convertToRowFormat = (data) => {
    let index = 0;
    return data.map((trainer) => ({
      id: trainer.username.toUpperCase(),
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      gender: trainer.gender.charAt(0).toUpperCase() + trainer.gender.slice(1),
      dob: trainer.dob.slice(0, 10),
      specialization: trainer.specialization,
      bmi: trainer.bmi,
      index: index++,
      full_id: trainer._id,
    }));
  };

  const deleteTrainerWithId = async () => {
    await deleteTrainer(deleteId);
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMailData({ ...mailData, [name]: value });
  };

  const clearMail = () => {
    setOpenMail(false);
    setLoading(false);
    setMailData({
      to: "",
      name: "",
      subject: "",
      message: "",
    });
  };

  const sendMailToTrainer = async () => {
    if (mailData.subject === "" || mailData.message === "")
      return toast.info("All Fields are reqired !");
    setLoading(true);
    await sendMail(mailData);
    clearMail();
  };

  const trainerRows = convertToRowFormat(trainers);
  const columns = [
    {
      field: "id",
      headerName: "Trainer Id",
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
    },
    {
      field: "dob",
      headerName: "DOB",
      flex: 1,
      headerAlign: "center",
      align: "center",
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
      renderCell: (params) => (
        <div className="flex justify-center space-x-2 mt-2">
          <Tooltip title="Mail" placement="top" arrow>
            <IconButton
              sx={{ paddingTop: "2px" }}
              aria-label="mail"
              onClick={() => {
                setMailData({
                  ...mailData,
                  to: params.row.email,
                  name: params.row.name,
                });
                setOpenMail(true);
              }}
            >
              <i
                className="fa-duotone fa-solid fa-envelopes"
                style={{ fontSize: "20px" }}
              ></i>
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton
              aria-label="edit"
              onClick={() => {
                navigate("/trainer/edit", { state: params.row.full_id });
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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(trainerRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trainers");
    XLSX.writeFile(workbook, "trainers.xlsx");

    toast.success("Table exported to Excel 📃");
  };

  const exportToCSV = () => {
    toast.success("Table exported to CSV 📃");
    const csvData = trainerRows.map((trainer) => {
      return {
        "Trainer Id": trainer.id,
        "Full Name": trainer.name,
        Contact: trainer.phone,
        Gender: trainer.gender,
        DOB: trainer.dob,
        Specialization: trainer.specialization,
        BMI: trainer.bmi,
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
    a.setAttribute("download", "trainers.csv");
    a.click();
    URL.revokeObjectURL(url);
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

      pdf.save("trainers.pdf");
    });
    toast.success("Table exported to PDF 📃");
  };

  const copyToClipboard = () => {
    const tableData = trainerRows
      .map((trainer) => {
        return `${trainer.id}\t${trainer.name}\t${trainer.phone}\t${trainer.gender}\t${trainer.dob}\t${trainer.specialization}\t${trainer.bmi}`;
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

  return (
    <div id="trainerslist">
      <PageLocation
        pageTitle="Trainers List"
        parentPath="Trainers"
        currentPath="Trainers List"
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
              </Tooltip>
            </div>
            <div>
              <Button
                className="transition-all duration-300"
                variant="solid"
                onClick={() => navigate("/trainer/add")}
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
                Add New Trainer
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
            Are you sure you want to delete the Trainer from the list ?
          </DialogContent>
          <DialogActions>
            <Button
              className="rounded-full py-1"
              variant="solid"
              color="danger"
              onClick={deleteTrainerWithId}
            >
              Delete Trainer
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

      {/* Send Mail */}
      <Modal open={openMail} onClose={() => setOpenMail(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "550px", px: 4, borderRadius: 10 }}
        >
          <DialogTitle>
            <span className="font-bold text-gray-500">Send Mail To</span>{" "}
            <span className="font-bold">{mailData.name}</span>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="pb-2">
              <span className="font-semibold">From : </span> {user.email}
            </div>
            <div className="pb-1">
              <span className="font-semibold">Mail To : </span>
              {mailData.to}
            </div>
            <Input
              value={mailData.subject}
              onChange={handleChange}
              placeholder="Subject"
              variant="outlined"
              name="subject"
              sx={{
                mt: 1,
                backgroundColor: "white",
              }}
            />
            <Textarea
              value={mailData.message}
              onChange={handleChange}
              placeholder="Message"
              variant="outlined"
              name="message"
              minRows={5}
              maxRows={8}
              sx={{
                py: 1,
                my: 2,
                backgroundColor: "white",
              }}
              size="md"
              required
            />
            <div className="text-right flex gap-4 flex-row-reverse">
              <Button
                className="transition-all duration-300"
                onClick={sendMailToTrainer}
                variant="solid"
                type="submit"
                size="md"
                sx={{
                  px: 2,
                  borderRadius: 25,
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "#222222",
                  },
                }}
                disabled={loading}
              >
                {loading ? (
                  <Fragment>
                    <span className="text-base">Sending ...</span>
                  </Fragment>
                ) : (
                  <Fragment>
                    Send &nbsp;
                    <i className="fa-regular fa-paper-plane-top"></i>
                  </Fragment>
                )}
              </Button>
              <Button
                className="transition-all duration-300"
                onClick={clearMail}
                variant="text"
                type="submit"
                size="md"
                sx={{
                  px: 2,
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default TrainersList;
