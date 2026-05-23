import { Modal, Box, Typography, IconButton, Divider } from "@mui/material";
import { motion } from "motion/react";
import { IoClose } from "react-icons/io5";

import ButtonPrimary from "@/shared/components/ui/form/button/ButtonPrimary";
import { modalBaseStyle } from "@/shared/components/ui/modal/config/modalConfig";

const ContactAdminModal = ({ open, onClose, title, children, onClick }) => {
  return (
    <Modal
      open={Boolean(open)}
      onClose={typeof onClose === "function" ? onClose : undefined}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
        },
      }}
    >
      <Box
        sx={{
          ...modalBaseStyle,
          bgcolor: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          color: "white",
        }}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
        animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-4 pb-3">
          <Typography
            variant="h6"
            fontWeight="bold"
            className="text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-indigo-200"
          >
            {title}
          </Typography>
          {typeof onClose === "function" && (
            <IconButton
              onClick={onClose}
              size="small"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <IoClose />
            </IconButton>
          )}
        </div>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

        {/* Content */}
        <div className="px-6 py-3 text-slate-300 text-sm leading-relaxed">
          {children}
        </div>
        <div className="px-6 text-slate-300 text-sm leading-relaxed pb-7">
          <ButtonPrimary className={"w-full"} onClick={onClick}>
            <span className="text-md font-semibold">Contact Admin</span>{" "}
          </ButtonPrimary>
        </div>
      </Box>
    </Modal>
  );
};

export default ContactAdminModal;
