import { Button } from "antd";
import Modal from "@mui/joy/Modal";
import Divider from "@mui/joy/Divider";
import { toast } from "sonner";
import { useContext, useState } from "react";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import { AuthContext } from "../../context/AuthContext";

import { WarningOutlined } from "@ant-design/icons";

import "./Sidebar.scss";

export const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const logoutAdmin = async () => {
    await logout();
    toast.info("User logged out successfully!");
  };

  return (
    <div id="sidebar">
      <button className="mt-10" onClick={() => setOpen(true)}>
        logout
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningOutlined />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            Are you sure you want to Logout from this device?
          </DialogContent>
          <DialogActions>
            <Button
              className="rounded-md"
              variant="solid"
              color="danger"
              onClick={logoutAdmin}
            >
              Logout
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
