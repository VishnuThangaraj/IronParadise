import { useState } from "react";

import { motion } from "motion/react";
import { FaAngleRight } from "react-icons/fa6";
import { Modal, Box, Typography, Divider } from "@mui/material";

import { adminName } from "@/config/appConfig";

import {
  getContactTheme,
  socialThemes,
} from "@/shared/components/ui/modal/config/modalColorMap";
import { modalBaseStyle } from "@/shared/components/ui/modal/config/modalConfig";
import {
  devSkills,
  devSocials,
  getInTouch,
  devDescription,
  developerImageURL,
} from "@/shared/components/ui/modal/config/developerModalConfig";

const getInitials = (name) => {
  if (!name) return "VT";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const DeveloperContactModal = ({ open, onClose }) => {
  const [imgError, setImgError] = useState(false);

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
        {/* Banner*/}
        <div className="relative flex justify-between items-center bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 h-24 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size[14px_24px] pointer-events-none"></div>
          <span className="z-10 font-bold text-[10px] text-white/80 uppercase tracking-widest">
            Developer Card
          </span>
        </div>
        {/* Profile Avatar */}
        <div className="relative flex flex-col items-center -mt-10 px-6 pb-4">
          <div className="flex justify-center items-center shadow-md border-4 border-white rounded-full w-20 h-20 overflow-hidden text-gradient-primary-color select-none">
            {!imgError ? (
              <img
                src={developerImageURL}
                alt={adminName}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="font-extrabold text-white text-2xl tracking-wider">
                {getInitials(adminName)}
              </span>
            )}
          </div>

          <Typography variant="h6" className="mt-2.5 font-bold text-gray-800">
            {adminName}
          </Typography>

          <span className="mt-1 font-bold text-[9px] text-gradient-primary-color uppercase tracking-widest">
            Full Stack Developer • Data Analyst • AI Enthusiast
          </span>

          <div className="flex flex-wrap gap-2">
            {devSkills.map((item, index) => {
              return (
                <span
                  key={`dev-skill-${index}`}
                  className="bg-indigo-50 my-2 px-2.5 py-0.5 rounded-full font-semibold text-[10px] text-indigo-700"
                >
                  {item}
                </span>
              );
            })}
          </div>

          <div className="my-1 text-gray-500 text-sm text-justify leading-relaxed">
            {devDescription}
          </div>
        </div>
        <Divider className="mx-6 border-gray-100" />
        <div className="flex flex-col gap-2.5 px-7 py-3.5">
          {/* Get In Touch */}
          {getInTouch.map((item, index) => {
            const Icon = item.icon;
            const theme = getContactTheme(item, index);
            return (
              <a
                key={`get-in-touch-${index}`}
                href={item.url}
                target={
                  item.url &&
                  (item.url.startsWith("mailto:") || item.url === "#")
                    ? undefined
                    : "_blank"
                }
                rel={
                  item.url &&
                  (item.url.startsWith("mailto:") || item.url === "#")
                    ? undefined
                    : "noopener noreferrer"
                }
                onClick={(e) => {
                  if (item.url === "#") {
                    e.preventDefault();
                  }
                }}
                className={`flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 ${theme.cardHover} transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group no-underline`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${theme.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div
                    className={`text-[9px] font-bold uppercase tracking-wider text-gray-400 ${theme.titleHover} transition-colors duration-300`}
                  >
                    {item.title}
                  </div>
                  <div className="mt-0.5 font-semibold text-gray-700 text-xs normal-case tracking-wide">
                    {item.description}
                  </div>
                </div>
                <div
                  className={`text-gray-300 ${theme.arrowHover} transition-colors duration-300 text-right pr-0.5`}
                >
                  <FaAngleRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 duration-300 transform" />
                </div>
              </a>
            );
          })}
        </div>
        <Divider className="mx-6 border-gray-100" />

        {/* Socials */}
        <div className="flex justify-center gap-4 py-4">
          {devSocials.map((item, index) => {
            const Icon = item.icon;
            const themeClass =
              socialThemes[item.title] ||
              "hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-indigo-500/30";
            return (
              <motion.a
                key={`devSocial-${index}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={item.title}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-500 transition-all duration-300 ${themeClass} cursor-pointer`}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            );
          })}
        </div>
      </Box>
    </Modal>
  );
};

export default DeveloperContactModal;
