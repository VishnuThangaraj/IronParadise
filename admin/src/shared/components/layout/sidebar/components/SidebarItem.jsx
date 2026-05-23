import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { LuMail } from "react-icons/lu";
import PropTypes from "prop-types";

export const SidebarIcon = ({ icon, className = "w-5 h-5" }) => {
  if (!icon) return null;
  if (typeof icon === "string") {
    const lower = icon.toLowerCase();
    if (lower.includes("envelope") || lower.includes("mail") || lower.includes("message")) {
      return <LuMail className={className} />;
    }
    return <i className={`${icon} ${className} flex items-center justify-center`} />;
  }
  const IconComponent = icon;
  return <IconComponent className={className} />;
};

SidebarIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  className: PropTypes.string,
};

const SidebarItem = ({ item, isCollapsed, pathname }) => {
  const isActive =
    pathname === item.location ||
    (item.location !== "/" && pathname.startsWith(item.location + "/"));

  return (
    <div className="relative group">
      <NavLink
        to={item.location}
        className={({ isActive: linkActive }) => {
          const currentActive = linkActive || isActive;
          return `flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
            currentActive
              ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25 font-semibold"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`;
        }}
      >
        <motion.div
          className="flex items-center gap-3.5 w-full"
          whileHover={{ x: isCollapsed ? 0 : 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div
            className={`flex items-center justify-center w-8.5 h-8.5 rounded-lg transition-colors duration-300 ${
              isActive
                ? "text-white"
                : "bg-slate-800/40 text-slate-400 group-hover:text-white"
            }`}
          >
            <SidebarIcon icon={item.icon} className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="whitespace-nowrap text-[13.5px] font-semibold tracking-wide"
            >
              {item.name}
            </motion.span>
          )}
        </motion.div>
      </NavLink>

      {/* Collapsed Tooltip */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[10px] font-bold text-slate-200 whitespace-nowrap shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform scale-95 origin-left group-hover:scale-100 z-50">
          {item.name}
        </div>
      )}
    </div>
  );
};

SidebarItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  }).isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
};

export default SidebarItem;
