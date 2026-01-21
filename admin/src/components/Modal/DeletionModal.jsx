import Modal from "@mui/joy/Modal";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";

const DeletionModal = ({ open, setOpen, origin, icon, confirmation }) => {
  return (
    <Modal
      key={`Deletion-Modal-${origin}`}
      open={open}
      onClose={() => setOpen(false)}
    >
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <i className={`${icon} mt-1 me-1`}></i>
          Delete Confirmation
        </DialogTitle>
        <Divider />
        <DialogContent>
          Are you sure you want to delete the {origin} from the list ?
        </DialogContent>
        <DialogActions>
          <Button
            className="rounded-full py-1"
            variant="solid"
            color="danger"
            onClick={confirmation}
          >
            Delete {origin}
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
  );
};

export default DeletionModal;
