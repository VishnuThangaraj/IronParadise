import { Fragment, useState } from "react";
import { toast } from "sonner";

import Modal from "@mui/joy/Modal";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Textarea from "@mui/joy/Textarea";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogContent from "@mui/joy/DialogContent";
import CircularProgress from "@mui/joy/CircularProgress";

import { userEmail } from "../../config/UserConfig";
import { sendMail } from "../../redux/email/emailThunks";

import { useDispatch, useSelector } from "react-redux";
import { selectEmailLoading } from "../../redux/email/emailSelector";

const SendMailModal = ({ open, setOpen, icon, title, origin, sender = [] }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectEmailLoading);

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateAndSendMail = async (e) => {
    e.preventDefault();

    const mailData = {
      to: sender,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      await dispatch(sendMail({ mailData })).unwrap();
      toast.success("Email sent successfully!");
      setFormData({ subject: "", message: "" });
      setOpen(false);
    } catch {
      toast.error("Failed to send email");
    }
  };

  // Compact email display
  const renderCompactEmails = () => {
    if (!sender || sender.length === 0) return null;

    const visible = sender.slice(0, 2);
    const remaining = sender.length - visible.length;

    return (
      <>
        {visible.join(", ")}
        {remaining > 0 && (
          <span className="text-gray-500"> +{remaining} more</span>
        )}
      </>
    );
  };

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
          {icon && <i className={`${icon} mt-1 me-1`}></i>}
          Mail to {title}
        </DialogTitle>

        <Divider />

        <DialogContent>
          <div className="pb-2">
            <span className="font-semibold">From : </span> {userEmail}
          </div>

          {sender && sender.length > 0 && (
            <div className="py-2">
              <span className="font-semibold">To : </span>
              <span>{renderCompactEmails()}</span>
            </div>
          )}

          <form onSubmit={validateAndSendMail}>
            <Input
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              variant="outlined"
              name="subject"
              sx={{
                mt: 1,
                mb: 3,
                backgroundColor: "white",
              }}
              required
            />

            <Textarea
              value={formData.message}
              onChange={handleChange}
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
                    <CircularProgress
                      size="sm"
                      sx={{ mr: 1 }}
                      color="neutral"
                    />
                    Sending...
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
                onClick={() => setOpen(false)}
                variant="text"
                size="md"
                sx={{ px: 2 }}
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
