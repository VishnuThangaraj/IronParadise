import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LuChevronDown } from "react-icons/lu";
import { motion, AnimatePresence } from "motion/react";
import type { SidebarItemType } from "../constants/sidebarFields";

interface SidebarSubmenuProps {
  item: SidebarItemType;
  isCollapsed: boolean;
  setIsCollapsed?: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

const SidebarSubmenu = ({
  item,
  isCollapsed,
  setIsCollapsed,
}: SidebarSubmenuProps) => {
  const location = useLocation();
  const isAnyChildActive =
    item.children?.some(
      (child) =>
        location.pathname === child.location ||
        location.pathname.startsWith(`${child.location}/`),
    ) ?? false;

  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  // Auto-expand if child becomes active while expanded
  useEffect(() => {
    if (isAnyChildActive && !isCollapsed) {
      setIsOpen(true);
    }
  }, [isAnyChildActive, isCollapsed]);

  const toggleSubmenu = () => {
    if (isCollapsed) {
      setIsCollapsed?.(false);
      setIsOpen(true);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <li className="flex flex-col w-full relative group">
      {/* Parent Button */}
      <button
        type="button"
        onClick={toggleSubmenu}
        className={`relative flex items-center w-full select-none cursor-pointer rounded-xl border transition-all duration-200 ease-in-out ${
          isCollapsed
            ? "justify-center p-2.5"
            : "px-3 py-2.5"
        } ${
          isAnyChildActive
            ? "text-white bg-slate-800/50 border-slate-700/60 shadow-xs"
            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/30 border-transparent hover:border-slate-800/50"
        }`}
      >
        {/* Active Child Indicator Bar on Left */}
        <AnimatePresence>
          {isAnyChildActive && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-indigo-500 shadow-sm shadow-indigo-500/50"
            />
          )}
        </AnimatePresence>

        <div
          className={`flex items-center w-full transition-transform duration-200 ${
            isCollapsed ? "justify-center" : "group-hover:translate-x-0.5"
          }`}
        >
          {/* Icon Container */}
          <div
            className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
              isAnyChildActive
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/30 shadow-inner"
                : "bg-slate-800/50 text-slate-400 border-transparent group-hover:bg-slate-800 group-hover:text-slate-200 group-hover:scale-105"
            }`}
          >
            {typeof item.icon === "string" ? (
              <i className={`${item.icon} text-lg`}></i>
            ) : item.icon ? (
              <item.icon className="text-lg" />
            ) : null}
          </div>

          {!isCollapsed && (
            <>
              <span
                className={`ml-3 text-[13px] tracking-wide whitespace-nowrap flex-1 text-left truncate transition-colors duration-200 ${
                  isAnyChildActive
                    ? "font-semibold text-white"
                    : "font-medium text-slate-300 group-hover:text-white"
                }`}
              >
                {item.name}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className={`ml-auto text-xs shrink-0 transition-colors ${
                  isAnyChildActive
                    ? "text-indigo-400"
                    : "text-slate-500 group-hover:text-slate-300"
                }`}
              >
                <LuChevronDown />
              </motion.span>
            </>
          )}
        </div>
      </button>

      {/* Expanded Accordion Submenu */}
      {!isCollapsed && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="relative ml-7 my-1.5 space-y-1">
                {/* Continuous Vertical Tree Guide Line */}
                <div className="absolute left-2.5 top-2.5 bottom-2.5 w-[1.5px] -translate-x-1/2 bg-slate-800/90 pointer-events-none" />

                {item.children?.map((child, index) => {
                  const isChildActive =
                    location.pathname === child.location ||
                    location.pathname.startsWith(`${child.location}/`);

                  return (
                    <div
                      key={child.location || index}
                      className="relative group/sub flex items-center w-full"
                    >
                      {/* Tree Dot - Centered exactly on the vertical guide line at left-2.5 */}
                      <span
                        className={`absolute left-2.5 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 pointer-events-none z-10 ${
                          isChildActive
                            ? "w-2 h-2 bg-indigo-400 ring-4 ring-indigo-500/20 shadow-xs shadow-indigo-400"
                            : "w-1.5 h-1.5 bg-slate-600 group-hover/sub:bg-slate-400"
                        }`}
                      />

                      <NavLink
                        to={child.location}
                        className={`ml-5 flex items-center px-3 py-2 rounded-xl w-full text-[13px] tracking-wide select-none border transition-all duration-200 ease-in-out ${
                          isChildActive
                            ? "text-indigo-200 font-semibold bg-indigo-600/15 border-indigo-500/30 shadow-xs"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent hover:border-slate-800/50"
                        }`}
                      >
                        <span className="truncate">{child.name}</span>
                      </NavLink>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Collapsed Mode Tooltip */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 pointer-events-none opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out z-50">
          <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 text-xs font-semibold text-white shadow-xl shadow-black/60 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
            <span>{item.name}</span>
            {/* Tooltip arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
          </div>
        </div>
      )}
    </li>
  );
};

export default SidebarSubmenu;
