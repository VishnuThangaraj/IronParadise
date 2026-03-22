import Modal from "@mui/joy/Modal";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";

const LogoutModal = ({open, setOpen, setOpenLogout}) => {
    return <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
            <DialogTitle>Logout Confirmation</DialogTitle>
            <Divider/>
            <DialogContent>
                Proceed with logging out of the current session?
            </DialogContent>
            <DialogActions>
                <Button
                    variant="solid"
                    color="danger"
                    onClick={() => setOpenLogout(false)}
                >
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
}

export default LogoutModal;