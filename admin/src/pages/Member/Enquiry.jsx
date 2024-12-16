import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Modal,
  Button,
  Input,
  Divider,
  Tooltip,
  Textarea,
  FormLabel,
  IconButton,
  CardContent,
  DialogTitle,
  FormControl,
  ModalDialog,
  DialogActions,
  DialogContent,
} from "@mui/joy";

import { AuthContext } from "../../context/AuthContext";
import { EnquiryContext } from "../../context/EnquiryContext";

import { PageLocation } from "../../components/PageLocation";

const Enquiry = () => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { enquires, findEnquiry, updateEnquiry, deleteEnquiry } =
    useContext(EnquiryContext);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openReplay, setOpenReplay] = useState(false);
  const [replay, setReplay] = useState({
    _id: null,
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    panNumber: "",
    aadharNumber: "",
    replaySubject: "",
    replayMessage: "",
  });

  const convertToRowFormat = (data) => {
    return data.map((enquiry) => ({
      id: `ENQ${enquiry._id.slice(21).toUpperCase()}`,
      name: `${enquiry.firstName} ${enquiry.lastName}`,
      email: enquiry.email,
      phone: enquiry.phone,
      subject: enquiry.subject,
      message: enquiry.message,
      aadharNumber: enquiry.aadharNumber,
      panNumber: enquiry.panNumber,
      converted: enquiry.member ? "MEMBER" : "GUEST",
      member: enquiry.member,
      replaySubject: enquiry.replaySubject,
      replayMessage: enquiry.replayMessage,
      full_id: enquiry._id,
    }));
  };

  const filteredRows = convertToRowFormat(enquires).filter(
    (row) =>
      row.id.toLowerCase().includes(searchTerm) ||
      row.name.toLowerCase().includes(searchTerm) ||
      row.email.toLowerCase().includes(searchTerm) ||
      row.converted.toLowerCase().includes(searchTerm) ||
      row.phone.toLowerCase().includes(searchTerm) ||
      row.subject.toLowerCase().includes(searchTerm)
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const findEnquiryWithID = async (enquiryId) => {
    const enquiry = await findEnquiry(enquiryId);
    setReplay(enquiry);
    if (enquiry.replayMessage) setActive(true);
    else setActive(false);
    setOpenReplay(true);
  };

  const handleChange = (e) => {
    if (active) return;
    const { name, value } = e.target;

    setReplay({ ...replay, [name]: value });
  };

  const handleSubmit = async () => {
    if (replay.replaySubject === "" || replay.replayMessage === "")
      return toast.info("Subject & Message Should not be Empty.");
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
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
      field: "email",
      headerName: "Email",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "converted",
      headerName: "Membership Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div
          className={` font-semibold ${
            params.row.converted === "MEMBER"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {params.row.converted}
        </div>
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
          <Tooltip title="View & Replay" placement="top" arrow>
            <Button
              aria-label="Replay"
              size="sm"
              variant="outlined"
              color={params.row.replayMessage !== "" ? "success" : "primary"}
              onClick={() => {
                findEnquiryWithID(params.row.full_id);
              }}
            >
              <i
                className={
                  params.row.replayMessage === ""
                    ? " fa-duotone fa-solid fa-envelope-open-text text-blue-600  me-2"
                    : "fa-duotone fa-regular fa-check text-green-600 me-1"
                }
                style={{ fontSize: "20px" }}
              ></i>{" "}
              {params.row.replayMessage === "" ? "Replay" : "Replied"}
            </Button>
          </Tooltip>

          {params.row.converted === "FALSE" ? (
            <Tooltip title="Convert to Member" placement="top" arrow>
              <IconButton
                aria-label="convert"
                color="secondary"
                onClick={async () => {
                  navigate("/member/add", { state: params.row.full_id });
                }}
              >
                <i
                  className="fa-duotone fa-light fa-user-plus text-teal-600"
                  style={{ fontSize: "20px" }}
                ></i>
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="View Member" placement="top" arrow>
              <IconButton
                aria-label="view"
                color="secondary"
                onClick={async () => {
                  navigate("/member/edit", { state: params.row.member });
                }}
              >
                <i
                  className="fa-duotone fa-solid fa-eye text-blue-600"
                  style={{ fontSize: "20px" }}
                ></i>
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Remove" placement="top" arrow>
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

  const exportToExcel = () => {
    if (enquires.length === 0)
      return toast.info("Enquires List is Empty to Export.");

    const worksheet = XLSX.utils.json_to_sheet(enquires);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enquires");
    XLSX.writeFile(workbook, "enquiresList.xlsx");

    toast.success("Enquires exported to Excel 📃");
  };

  const deleteEnquiryWithID = async () => {
    setOpen(false);
    await deleteEnquiry(deleteId);
  };

  const sendReplay = async () => {
    setOpenReplay(false);
    await updateEnquiry(replay._id, replay);
    setReplay({
      _id: null,
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
      panNumber: "",
      aadharNumber: "",
      replaySubject: "",
      replayMessage: "",
    });
  };

  return (
    <div id="memberenquiry">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Messages"
        currentPath="Enquiry"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 4 }}>
        <CardContent>
          <div className="flex justify-between">
            <div>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: "350px" }}
              />
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
            <i className="fa-regular fa-message-slash mt-1 me-1"></i>
            Remove Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to delete the Enquiry from the list ?
          </DialogContent>
          <DialogActions>
            <Button
              className="rounded-full py-1"
              variant="solid"
              color="danger"
              onClick={deleteEnquiryWithID}
            >
              Remove Enquiry
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

      {/* View Enquiry */}
      <Modal open={openReplay} onClose={() => setOpenReplay(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "700px" }}
        >
          <DialogTitle>
            <i className="fa-regular fa-message-dots mt-1 me-1"></i>
            Enquiry
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Box component="form" sx={{ p: 0 }} onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 px-6 py-5">
                <div className="flex justify-between">
                  <FormControl sx={{ width: "48%" }}>
                    <FormLabel sx={{ fontSize: 15 }}>First Name</FormLabel>
                    <Input
                      value={replay.firstName}
                      placeholder="First Name"
                      variant="outlined"
                      name="firstName"
                      size="md"
                      sx={{ py: 1 }}
                      required
                    />
                  </FormControl>
                  <FormControl sx={{ width: "48%" }}>
                    <FormLabel sx={{ fontSize: 15 }}>Last Name</FormLabel>
                    <Input
                      value={replay.lastName}
                      placeholder="Last Name"
                      variant="outlined"
                      name="lastName"
                      size="md"
                      sx={{ py: 1 }}
                      required
                    />
                  </FormControl>
                </div>
                <div className="flex justify-between">
                  <FormControl sx={{ width: "48%" }}>
                    <FormLabel sx={{ fontSize: 15 }}>Email Address</FormLabel>
                    <Input
                      placeholder="example@gmail.com"
                      value={replay.email}
                      variant="outlined"
                      name="email"
                      type="email"
                      size="md"
                      sx={{
                        py: 1,
                        backgroundColor: "white",
                      }}
                      required
                    />
                  </FormControl>
                  <FormControl sx={{ width: "48%" }}>
                    <FormLabel sx={{ fontSize: 15 }}>Contact Number</FormLabel>
                    <Input
                      placeholder="0000 0000 00"
                      startDecorator={"+91"}
                      value={replay.phone}
                      variant="outlined"
                      name="phone"
                      size="md"
                      sx={{
                        py: 1,
                        backgroundColor: "white",
                      }}
                      required
                    />
                  </FormControl>
                </div>
                <div className="flex justify-between">
                  <FormControl sx={{ width: "48%" }}>
                    <FormLabel sx={{ fontSize: 15 }}>
                      Aadhar Card Number
                    </FormLabel>
                    <Input
                      placeholder="xxxx xxxx xxxx"
                      value={replay.aadharNumber}
                      name="aadharNumber"
                      variant="outlined"
                      size="md"
                      sx={{
                        py: 1,
                        backgroundColor: "white",
                      }}
                    />
                  </FormControl>
                  <FormControl sx={{ width: "48%" }}>
                    <FormLabel sx={{ fontSize: 15 }}>Pan Card Number</FormLabel>
                    <Input
                      value={replay.panNumber && replay.panNumber.toUpperCase()}
                      placeholder="xxxxxxxxxx"
                      variant="outlined"
                      name="panNumber"
                      size="md"
                      sx={{
                        py: 1,
                        backgroundColor: "white",
                      }}
                    />
                  </FormControl>
                </div>
                <div className="flex justify-between">
                  <FormControl sx={{ width: "100%" }}>
                    <FormLabel sx={{ fontSize: 15 }}>Subject</FormLabel>
                    <Input
                      value={replay.subject}
                      placeholder="Subject"
                      variant="outlined"
                      name="subject"
                      size="md"
                      sx={{ py: 1 }}
                      required
                    />
                  </FormControl>
                </div>
                <div className="flex justify-between">
                  <FormControl sx={{ width: "100%" }}>
                    <FormLabel sx={{ fontSize: 15 }}>Message</FormLabel>
                    <Textarea
                      placeholder="Enter your Message..."
                      value={replay.message}
                      variant="outlined"
                      name="message"
                      minRows={4}
                      maxRows={7}
                      sx={{
                        py: 1,
                        backgroundColor: "white",
                      }}
                      size="md"
                      required
                    />
                  </FormControl>
                </div>
                <div className="text-black uppercase text-lg font-semibold">
                  Replay to this Enquiry
                </div>
                <div className="pb-2">
                  <span className="font-semibold">From : </span> {user.email}
                </div>
                <div className="pb-1">
                  <span className="font-semibold">Mail To : </span>
                  {replay.email}
                </div>
                <div className="flex justify-between">
                  <FormControl sx={{ width: "100%" }}>
                    <FormLabel sx={{ fontSize: 15 }}>Subject</FormLabel>
                    <Input
                      value={replay.replaySubject}
                      onChange={handleChange}
                      placeholder="Subject"
                      name="replaySubject"
                      variant="outlined"
                      size="md"
                      sx={{ py: 1 }}
                      required
                    />
                  </FormControl>
                </div>
                <div className="flex justify-between">
                  <FormControl sx={{ width: "100%" }}>
                    <FormLabel sx={{ fontSize: 15 }}>Message</FormLabel>
                    <Textarea
                      placeholder="Enter your Message..."
                      value={replay.replayMessage}
                      onChange={handleChange}
                      variant="outlined"
                      name="replayMessage"
                      minRows={5}
                      maxRows={8}
                      sx={{
                        py: 1,
                        backgroundColor: "white",
                      }}
                      size="md"
                      required
                    />
                  </FormControl>
                </div>
              </div>
            </Box>
          </DialogContent>
          <DialogActions>
            <div className="me-5">
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setOpenReplay(false)}
              >
                Cancel
              </Button>
              <Button
                className="rounded-full py-1 "
                variant="solid"
                sx={{
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "#222222",
                  },
                }}
                onClick={sendReplay}
                disabled={active}
              >
                <i className="fa-light fa-envelope me-2"></i>
                {active ? "Already Replied" : "Send Replay"}
              </Button>
            </div>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default Enquiry;
