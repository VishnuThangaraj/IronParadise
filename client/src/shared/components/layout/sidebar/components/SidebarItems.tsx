import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import SidebarSubmenu from "./SidebarSubmenu";
import type { SidebarItemType } from "../constants/sidebarFields";

interface SidebarItemsProps {
  items: SidebarItemType[];
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

const SidebarItems = ({
  items,
  isCollapsed,
  setIsCollapsed,
}: SidebarItemsProps) => {
  const location = useLocation();

  return (
    <ul className={`flex flex-col space-y-1.5 ${isCollapsed ? "px-2.5" : "px-3"}`}>
      {items.map((item, index) => {
        if (item.children) {
          return (
            <SidebarSubmenu
              key={item.name || index}
              item={item}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          );
        }

        const isActive =
          location.pathname === item.location ||
          (item.location !== "/" &&
            location.pathname.startsWith(`${item.location}/`));

        return (
          <li key={item.name || index} className="w-full relative group">
            <NavLink
              to={item.location}
              className={`relative flex items-center w-full select-none rounded-xl border transition-all duration-200 ease-in-out ${
                isCollapsed
                  ? "justify-center p-2.5"
                  : "px-3 py-2.5"
              } ${
                isActive
                  ? "text-white font-semibold bg-linear-to-r from-indigo-600 via-indigo-600/95 to-purple-600 border-indigo-400/30 shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 border-transparent hover:border-slate-800/60"
              }`}
            >
              <div
                className={`flex items-center w-full transition-transform duration-200 ${
                  isCollapsed ? "justify-center" : "group-hover:translate-x-0.5"
                }`}
              >
                {/* Icon Container */}
                <div
                  className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-white bg-white/15 shadow-inner"
                      : "bg-slate-800/50 text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-200 group-hover:scale-105"
                  }`}
                >
                  {typeof item.icon === "string" ? (
                    <i className={`${item.icon} text-lg`}></i>
                  ) : item.icon ? (
                    <item.icon className="text-lg" />
                  ) : null}
                </div>

                {/* Text Label */}
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.15 }}
                      className={`ml-3 text-[13px] tracking-wide truncate ${
                        isActive
                          ? "font-semibold text-white drop-shadow-xs"
                          : "font-medium text-slate-300 group-hover:text-white"
                      }`}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </NavLink>

            {/* Collapsed Tooltip */}
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
      })}
    </ul>
  );
};

export default SidebarItems;
