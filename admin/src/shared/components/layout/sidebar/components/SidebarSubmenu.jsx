import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LuChevronDown } from "react-icons/lu";
import { SidebarIcon } from "./SidebarItem";
import PropTypes from "prop-types";

const SidebarSubmenu = ({
  item,
  isCollapsed,
  setIsCollapsed,
  pathname,
  isOpen,
  toggleSubmenu,
}) => {
  const isParentActive =
    pathname === item.location ||
    pathname.startsWith(item.location + "/") ||
    item.children.some(
      (child) =>
        pathname === child.location ||
        pathname.startsWith(child.location + "/"),
    );

  const handleParentClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      if (!isOpen) {
        toggleSubmenu(item.name);
      }
    } else {
      toggleSubmenu(item.name);
    }
  };

  return (
    <div className="group relative">
      {/* Parent Row Button */}
      <div
        onClick={handleParentClick}
        className={`flex items-center justify-between w-full p-3 rounded-xl text-sm font-medium transition-all duration-300 group/row cursor-pointer ${
          isParentActive
            ? "bg-slate-800/50 text-white"
            : "text-slate-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <motion.div
          className="flex items-center gap-3.5 w-full"
          whileHover={{ x: isCollapsed ? 0 : 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div
            className={`flex items-center justify-center w-8.5 h-8.5 rounded-lg transition-colors duration-300 ${
              isParentActive
                ? "bg-gradient-primary-color text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-800/40 text-slate-400 group-hover/row:text-white"
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
        {!isCollapsed && (
          <LuChevronDown
            className={`w-3.5 h-3.5 text-slate-500 group-hover/row:text-white transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {/* Expanded Submenu Children List */}
      <AnimatePresence initial={false}>
        {!isCollapsed && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="space-y-1 mt-1 ml-4 pl-5 border-slate-800/80 border-l overflow-hidden"
          >
            {item.children.map((child) => {
              const isChildActive =
                pathname === child.location ||
                pathname.startsWith(child.location + "/");
              return (
                <NavLink
                  key={child.name}
                  to={child.location}
                  className={`flex items-center gap-2.5 py-2 px-3.5 rounded-lg text-[12.5px] font-medium transition-all duration-200 ${
                    isChildActive
                      ? "text-indigo-400 font-semibold bg-indigo-500/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-transform duration-300 ${
                      isChildActive
                        ? "bg-indigo-400 scale-125 shadow-sm shadow-indigo-400/50"
                        : "bg-slate-500"
                    }`}
                  />
                  {child.name}
                </NavLink>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Hover Dropdown Popover */}
      {isCollapsed && (
        <div className="invisible group-hover:visible top-0 left-full z-50 absolute bg-slate-950 opacity-0 group-hover:opacity-100 shadow-2xl ml-3 p-2 border border-slate-800/80 rounded-xl w-52 scale-95 group-hover:scale-100 origin-left transition-all duration-300 transform">
          <div className="mb-1 px-2.5 py-1 border-slate-800/60 border-b font-bold text-[10px] text-slate-400 uppercase tracking-widest">
            {item.name}
          </div>
          <div className="space-y-0.5">
            {item.children.map((child) => {
              const isChildActive =
                pathname === child.location ||
                pathname.startsWith(child.location + "/");
              return (
                <NavLink
                  key={child.name}
                  to={child.location}
                  className={`flex items-center gap-2.5 py-2 px-3.5 rounded-lg text-[12.5px] font-medium transition-all duration-200 ${
                    isChildActive
                      ? "text-indigo-400 font-semibold bg-indigo-500/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-transform duration-300 ${
                      isChildActive
                        ? "bg-indigo-400 scale-125 shadow-sm shadow-indigo-400/50"
                        : "bg-slate-500"
                    }`}
                  />
                  {child.name}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

SidebarSubmenu.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
    children: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleSubmenu: PropTypes.func.isRequired,
};

export default SidebarSubmenu;
