import { motion } from "motion/react";
import { Modal, Box, Typography, Divider } from "@mui/material";

import ButtonPrimary from "@/shared/components/ui/form/button/ButtonPrimary";
import { modalBaseStyle } from "@/shared/components/ui/modal/config/modalConfig";

const LogoutConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      open={Boolean(open)}
      onClose={typeof onClose === "function" ? onClose : undefined}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(15, 23, 42, 0.6)",
          },
        },
      }}
    >
      <Box
        sx={{
          ...modalBaseStyle,
          maxWidth: 500,
          bgcolor: "white",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          color: "#0f172a",
        }}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
        animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-4 pb-3">
          <Typography variant="h6" fontWeight="bold" className="text-slate-800">
            Confirm Logout
          </Typography>
        </div>

        <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.08)" }} />

        {/* Content */}
        <div className="px-6 py-6 text-slate-600 text-sm leading-relaxed">
          Are you sure you want to log out? You will need to sign in again to
          access the admin dashboard.
        </div>
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg font-semibold text-slate-600 hover:text-slate-900 text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <ButtonPrimary
            onClick={onConfirm}
            animate={false}
            sx={{
              background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
              boxShadow: "0 4px 14px 0 rgba(225, 29, 72, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
                boxShadow: "0 6px 20px rgba(225, 29, 72, 0.4)",
              },
            }}
          >
            <span className="px-2 font-semibold text-sm">Log Out</span>
          </ButtonPrimary>
        </div>
      </Box>
    </Modal>
  );
};

export default LogoutConfirmationModal;
