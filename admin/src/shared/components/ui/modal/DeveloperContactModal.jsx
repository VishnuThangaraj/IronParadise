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
        <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 h-24 relative overflow-hidden flex items-center justify-between px-6">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size[14px_24px] pointer-events-none"></div>
          <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest z-10">
            Developer Card
          </span>
        </div>
        {/* Profile Avatar */}
        <div className="relative flex flex-col items-center px-6 -mt-10 pb-4">
          <div className="w-20 h-20 rounded-full border-4 border-white bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md overflow-hidden select-none">
            {!imgError ? (
              <img
                src={developerImageURL}
                alt={adminName}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-white font-extrabold text-2xl tracking-wider">
                {getInitials(adminName)}
              </span>
            )}
          </div>

          <Typography variant="h6" className="text-gray-800 font-bold mt-2.5">
            {adminName}
          </Typography>

          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mt-1">
            Full Stack Developer • Data Analyst • AI Enthusiast
          </span>

          <div className="flex gap-2 flex-wrap">
            {devSkills.map((item, index) => {
              return (
                <span
                  key={`dev-skill-${index}`}
                  className="my-2 bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                >
                  {item}
                </span>
              );
            })}
          </div>

          <div className="text-gray-500 text-sm my-1 leading-relaxed text-justify">
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
                  <div className="text-xs font-semibold text-gray-700 mt-0.5 normal-case tracking-wide">
                    {item.description}
                  </div>
                </div>
                <div
                  className={`text-gray-300 ${theme.arrowHover} transition-colors duration-300 text-right pr-0.5`}
                >
                  <FaAngleRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-300" />
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
