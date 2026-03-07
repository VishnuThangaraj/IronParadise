import Modal from "@mui/joy/Modal";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogContent from "@mui/joy/DialogContent";
import { Fragment } from "react";
import { DialogActions } from "@mui/joy";

const DisplayModal = ({
  open,
  setOpen,
  icon,
  title,
  origin,
  content,
  subject = null,
  showAction = false,
}) => {
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
        {subject && (
          <Fragment>
            <DialogContent>
              <span className="font-semibold">Subject : {subject}</span>
            </DialogContent>
            <Divider />
          </Fragment>
        )}
        <DialogContent>{content}</DialogContent>
        {showAction && (
          <DialogActions>
            <Button
              className="rounded-full py-1"
              variant="solid"
              color="neutral"
              // onClick={confirmation}
            >
              <i className="fa-regular fa-reply me-3"></i>
              Replay {origin}
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        )}
      </ModalDialog>
    </Modal>
  );
};

export default DisplayModal;
