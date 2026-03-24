import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Modal from "@mui/joy/Modal";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";

import { logout } from "../../redux/auth/authSlice";

const LogoutModal = ({ open, setOpenLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout_user = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Modal open={open} onClose={() => setOpenLogout(false)}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>Logout Confirmation</DialogTitle>
        <Divider />
        <DialogContent>
          Proceed with logging out of the current session?
        </DialogContent>
        <DialogActions>
          <Button variant="solid" color="danger" onClick={logout_user}>
            Logout
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => setOpenLogout(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default LogoutModal;
