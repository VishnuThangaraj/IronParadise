import { toast } from "sonner";
import { DataGrid } from "@mui/x-data-grid";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  Modal,
  Button,
  Divider,
  Input,
  CardContent,
  DialogTitle,
  ModalDialog,
  DialogContent,
  Textarea,
} from "@mui/joy";

import { MemberContext } from "../context/MemberContext";
import { GeneralContext } from "../context/GeneralContext";
import { TrainerContext } from "../context/TrainerContext";

import { PageLocation } from "../components/PageLocation";

const Messages = () => {
  const { members } = useContext(MemberContext);
  const { bulkMail } = useContext(GeneralContext);
  const { trainers } = useContext(TrainerContext);

  const [open, setOpen] = useState(false);
  const [combined, setCombined] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [email, setEmail] = useState({
    subject: "",
    message: "",
  });

  useEffect(() => {
    const combine = [...members, ...trainers];
    setCombined(combine);
  }, [members, trainers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmail({ ...email, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const convertToRowFormat = (data) => {
    return data.map((item) => ({
      id: item.username.toUpperCase(),
      name: item.name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      role: item.role.toUpperCase(),
      full_id: item._id,
    }));
  };

  const filteredRows = convertToRowFormat(combined).filter(
    (row) =>
      row.name.toLowerCase().includes(searchTerm) ||
      row.email.toLowerCase().includes(searchTerm) ||
      row.phone.includes(searchTerm) ||
      row.address.toLowerCase().includes(searchTerm) ||
      row.role.toLowerCase().includes(searchTerm)
  );

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "address", headerName: "Address", flex: 2 },
    { field: "role", headerName: "Role", flex: 1 },
  ];

  const sendMailToUser = () => {
    if (!selectedUser || selectedUser.length === 0) {
      return toast.info("No User Selected");
    }
    setOpen(true);
  };

  const clearMail = () => {
    setOpen(false);
    setEmail({
      subject: "",
      message: "",
    });
  };

  const validateAndSendMail = async () => {
    if (!email || !email.subject || !email.message) {
      toast.info("All fields are Required !");
    }
    setLoading(true);
    await bulkMail(selectedUser, email);
    setEmail({
      subject: "",
      message: "",
    });
    setLoading(false);
    setOpen(false);
  };

  return (
    <div id="messages">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Messages"
        currentPath="Email Sender"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 4 }}>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ width: "350px" }}
            />
            <Button
              className="transition-all duration-300"
              variant="solid"
              onClick={sendMailToUser}
              size="md"
              sx={{
                px: 3,
                borderRadius: 20,
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "#222222",
                },
              }}
            >
              Send Mail
            </Button>
          </div>
          <Box sx={{ height: 420, width: "100%", margin: "0 auto" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[10]}
              checkboxSelection
              onRowSelectionModelChange={(newSelection) => {
                const selectedData = filteredRows.filter((row) =>
                  newSelection.includes(row.id)
                );
                const email = selectedData.map((row) => row.email);
                setSelectedUser(email);
              }}
              sx={{
                ".MuiDataGrid-row": {
                  backgroundColor: "white",
                  "&(even)": { backgroundColor: "#f5f5f5" },
                },
                ".MuiDataGrid-cell": { padding: "8px" },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Send Mail */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          sx={{ width: "550px", px: 4, borderRadius: 10 }}
        >
          <DialogTitle>
            <span className="font-bold text-gray-500">Send Mail To</span>{" "}
            <span className="font-bold">{`${
              selectedUser && selectedUser.length
            }  ${selectedUser.length == 1 ? "Person" : "Persons"}`}</span>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <div className="pb-2"></div>
            <Input
              value={email.subject}
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
              value={email.message}
              onChange={handleChange}
              placeholder="Message"
              variant="outlined"
              name="message"
              minRows={6}
              maxRows={10}
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
                onClick={validateAndSendMail}
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

export default Messages;