import Modal from "@mui/joy/Modal";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogContent from "@mui/joy/DialogContent";
import { Fragment } from "react";
import { DialogActions, Textarea } from "@mui/joy";

import { userEmail } from "../../config/UserConfig";

const SendMailModal = ({
  open,
  setOpen,
  icon,
  title,
  origin,
  content,
  loading = false,
  sender = null,
  showAction = false,
  buttonDisable = true,
}) => {
  return (
    <Modal
      key={`Display-Modal-${origin}`}
      open={open}
      onClose={() => setOpen(false)}
    >
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{ width: "650px", px: 4, borderRadius: 10 }}
      >
        <DialogTitle>
          <i className={`${icon} mt-1 me-1`}></i>
          Mail to {title}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <div className="pb-2">
            <span className="font-semibold">From : </span> {userEmail}
          </div>

          {sender && (
            <Fragment>
              <DialogContent>
                <div className="py-2">
                  <span className="font-semibold ">To : </span>
                  <span>{sender}</span>
                </div>
              </DialogContent>
            </Fragment>
          )}

          <form
          // onSubmit={validateAndSendMail}
          >
            <Input
              // value={formData.subject}
              // onChange={handleChange}
              placeholder="Subject"
              variant="outlined"
              name="subject"
              sx={{
                mt: 1,
                mb: 3,
                backgroundColor: "white",
              }}
            />
            <Textarea
              // value={formData.message}
              // onChange={handleChange}
              placeholder="Message"
              variant="outlined"
              name="message"
              minRows={8}
              maxRows={12}
              sx={{
                py: 1,
                my: 2,
                backgroundColor: "white",
              }}
              required
            />

            <div className="text-right flex gap-4 flex-row-reverse mt-4">
              <Button
                className="transition-all duration-300"
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
                onClick={() => {
                  setOpen(false);
                }}
                variant="text"
                size="md"
                sx={{
                  px: 2,
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};

export default SendMailModal;
