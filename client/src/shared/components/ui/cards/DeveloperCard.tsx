import { useState } from "react";
import { motion } from "motion/react";
import { FaAngleRight } from "react-icons/fa6";
import { Modal, Divider } from "@mui/material";

import { developerName } from "@/config/appConfig";
import {
  devSkills,
  devDescription,
  getInTouch,
  devSocials,
} from "./config/developerCardConfig";
import { getContactTheme, socialThemes } from "./config/modalColorMap";
import { getInitials } from "@/shared/hooks/getInitials";

interface DeveloperCardProps {
  open: boolean;
  onClose?: () => void;
}

const DeveloperCard = ({ open, onClose }: DeveloperCardProps) => {
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-105 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl outline-none overflow-hidden border border-gray-100 dark:border-slate-800">
        {/* Banner */}
        <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 h-24 relative overflow-hidden flex items-start justify-between p-4 px-6">
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size[14px_24px] pointer-events-none"></div>
          <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest z-10">
            Developer Card
          </span>
        </div>

        {/* Avatar & Header Info */}
        <div className="relative px-6 pt-0 pb-4 text-center flex flex-col items-center">
          <div className="w-20 h-20 -mt-10 rounded-full border-4 border-white dark:border-slate-900 bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md overflow-hidden select-none z-10">
            {!imgError ? (
              <img
                src="/images/developer.png"
                alt={developerName}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-white font-extrabold text-2xl tracking-wider">
                {getInitials(developerName)}
              </span>
            )}
          </div>

          <div className="mt-3 text-xl font-bold text-gray-900 dark:text-white">
            {developerName}
          </div>
          <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">
            Full Stack Developer • Data Analyst • AI Enthusiast
          </div>

          <div className="flex gap-2 flex-wrap justify-center mt-3 mb-2">
            {devSkills.map((skill, index) => (
              <span
                key={`dev-skill-${index}`}
                className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="text-gray-600 dark:text-slate-300 text-sm mt-1 leading-relaxed text-justify max-w-sm">
            {devDescription}
          </div>
        </div>

        <Divider className="w-full border-gray-200! dark:border-slate-700/80!" />

        {/* Get In Touch */}
        <div className="flex flex-col gap-2.5 px-6 py-4">
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
                className={`flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 ${theme.cardHover} transform hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group no-underline`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${theme.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div
                    className={`text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 ${theme.titleHover} transition-colors duration-300`}
                  >
                    {item.title}
                  </div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-slate-200 mt-0.5 normal-case tracking-wide">
                    {item.description}
                  </div>
                </div>
                <div
                  className={`text-gray-300 dark:text-slate-600 ${theme.arrowHover} transition-colors duration-300 text-right pr-0.5`}
                >
                  <FaAngleRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>
              </a>
            );
          })}
        </div>

        <Divider className="mx-6 border-gray-200! dark:border-slate-700/80!" />

        {/* Social Links */}
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
                className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-gray-500 dark:text-slate-400 transition-all duration-300 ${themeClass} cursor-pointer`}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default DeveloperCard;
