import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { LuMail } from "react-icons/lu";
import PropTypes from "prop-types";

export const SidebarIcon = ({ icon, className = "w-5 h-5" }) => {
  if (!icon) return null;
  if (typeof icon === "string") {
    const lower = icon.toLowerCase();
    if (
      lower.includes("envelope") ||
      lower.includes("mail") ||
      lower.includes("message")
    ) {
      return <LuMail className={className} />;
    }
    return (
      <i className={`${icon} ${className} flex items-center justify-center`} />
    );
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
    <div className="group relative">
      <NavLink
        to={item.location}
        className={({ isActive: linkActive }) => {
          const currentActive = linkActive || isActive;
          return `flex items-center gap-3.5 p-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
            currentActive
              ? "bg-gradient-primary-color text-white shadow-md shadow-indigo-600/25 font-semibold"
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
              className="font-semibold text-[13.5px] tracking-wide whitespace-nowrap"
            >
              {item.name}
            </motion.span>
          )}
        </motion.div>
      </NavLink>

      {/* Collapsed Tooltip */}
      {isCollapsed && (
        <div className="invisible group-hover:visible top-1/2 left-full z-50 absolute bg-slate-950 opacity-0 group-hover:opacity-100 shadow-md ml-3 px-2.5 py-1.5 border border-slate-800/80 rounded-lg font-bold text-[10px] text-slate-200 whitespace-nowrap scale-95 group-hover:scale-100 origin-left transition-all -translate-y-1/2 duration-200 transform">
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
