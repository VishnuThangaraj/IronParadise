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
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        },
      }}
    >
      <Box
        sx={modalBaseStyle}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95, y: "-40%", x: "-50%" }}
        animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-4 pb-3">
          <Typography variant="h6" fontWeight="bold" className="text-gray-800">
            {title}
          </Typography>
          {typeof onClose === "function" && (
            <IconButton
              onClick={onClose}
              size="small"
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <IoClose />
            </IconButton>
          )}
        </div>

        <Divider />

        {/* Content */}
        <div className="px-6 py-3 text-gray-600 text-sm leading-relaxed">
          {children}
        </div>
        <div className="px-6 text-gray-600 text-sm leading-relaxed pb-7">
          <ButtonPrimary className={"w-full"} onClick={onClick}>
            <span className="text-md font-semibold">Contact Admin</span>{" "}
          </ButtonPrimary>
        </div>
      </Box>
    </Modal>
  );
};

export default ContactAdminModal;
