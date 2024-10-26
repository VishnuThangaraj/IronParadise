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

import { SubscriptionContext } from "../../context/SubscriptionContext";

import { PageLocation } from "../../components/PageLocation";

const SubscriptionList = () => {
  const navigate = useNavigate();

  const { subscriptions, deleteSubscription } = useContext(SubscriptionContext);

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const convertToRowFormat = (data) => {
    let index = 0;
    return data.map((subscription) => ({
      id: subscription.planId.toUpperCase(),
      name: subscription.name,
      duration: `${subscription.duration} ${
        subscription.duration === 1 ? "Month" : "Months"
      }`,
      price: `₹ ${subscription.price.toFixed(2)}`,
      index: index++,
      full_id: subscription._id,
    }));
  };

  const deleteSubscriptionWithId = async () => {
    await deleteSubscription(deleteId);
    setOpen(false);
  };

  const subscriptionRows = convertToRowFormat(subscriptions);
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
      field: "duration",
      headerName: "Plan Duration (Months)",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Plan Cost ( ₹ )",
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
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton
              aria-label="edit"
              onClick={() => {
                navigate("/subscription/edit", { state: params.row.full_id });
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
    const worksheet = XLSX.utils.json_to_sheet(subscriptionRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subscription Plans");
    XLSX.writeFile(workbook, "subscriptionplans.xlsx");

    toast.success("Table exported to Excel 📃");
  };

  const exportToCSV = () => {
    toast.success("Table exported to CSV 📃");
    const csvData = subscriptionRows.map((subscription) => {
      return {
        "Subscription Id": subscription.id,
        "Plan Name": subscription.name,
        "Plan Duration (Months)": subscription.duration,
        "Plan Cost ( ₹ )": subscription.price,
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
    a.setAttribute("download", "subscriptionplan.csv");
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const input = document.getElementById("subscription-table");

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

      pdf.save("subscriptionplan.pdf");
    });
    toast.success("Table exported to PDF 📃");
  };

  const copyToClipboard = () => {
    const tableData = subscriptionRows
      .map((subscription) => {
        return `${subscription.id}\t${subscription.name}\t${subscription.duration}\t${subscription.price}`;
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
    <div id="subscriptionlist">
      <PageLocation
        pageTitle="Subscription Plans List"
        parentPath="Subscription Plans"
        currentPath="Subscription Plans List"
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
                onClick={() => navigate("/subscription/add")}
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
                Add New Plan
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
              rows={subscriptionRows}
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
              onClick={deleteSubscriptionWithId}
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

export default SubscriptionList;
