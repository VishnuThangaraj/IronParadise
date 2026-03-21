import {Fragment} from "react";

import Modal from "@mui/joy/Modal";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";

const DisplayModal = ({
                          open,
                          setOpen,
                          icon,
                          title,
                          origin,
                          content,
                          subject = null,
                          showAction = false,
                          buttonAction = () => {
                          },
                          buttonDisable = true,
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
                <Divider/>
                {subject && (
                    <Fragment>
                        <DialogContent>
                            <span className="font-semibold">Subject : {subject}</span>
                        </DialogContent>
                        <Divider/>
                    </Fragment>
                )}
                <DialogContent>{content}</DialogContent>
                {showAction && (
                    <DialogActions>
                        <Button
                            className="rounded-full py-1"
                            variant="solid"
                            color="neutral"
                            onClick={buttonAction}
                        >
                            {buttonDisable ? (
                                <Fragment>
                                    <i class="fa-duotone fa-regular fa-envelope me-3"></i>
                                    View Replay
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <i className="fa-regular fa-reply me-3"></i>
                                    Replay {origin}
                                </Fragment>
                            )}
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
