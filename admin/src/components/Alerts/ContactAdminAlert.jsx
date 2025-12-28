import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

export default function ContactAdminAlert({
  open,
  onClose,
  attempts = 10,
  email = "admin@example.com",
}) {
  const handleContact = () => {
    window.location.href = `mailto:${email}`;
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Sheet
        sx={{
          p: 3,
          borderRadius: "md",
          width: 360,
          mx: "auto",
          my: "30vh",
          textAlign: "center",
        }}
      >
        <Typography level="h5" mb={1}>
          Too Many Login Attempts
        </Typography>

        <Typography level="body-sm" mb={3}>
          More than <strong>{attempts}</strong> failed login attempts were
          detected. For security reasons, please contact the administrator to
          continue.
        </Typography>

        <Button fullWidth color="danger" onClick={handleContact}>
          Contact Administrator
        </Button>
      </Sheet>
    </Modal>
  );
}
