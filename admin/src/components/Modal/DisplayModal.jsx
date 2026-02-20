import Modal from "@mui/joy/Modal";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogContent from "@mui/joy/DialogContent";

const DisplayModal = ({ open, setOpen, icon, title, content }) => {
  return (
    <Modal
      key={`Display-Modal-${origin}`}
      open={open}
      onClose={() => setOpen(false)}
    >
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <i className={`${icon} mt-1 me-1`}></i>
          {title}
        </DialogTitle>
        <Divider />
        <DialogContent>{content}</DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default DisplayModal;
