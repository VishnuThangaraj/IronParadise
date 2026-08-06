import { NavLink, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import SidebarSubmenu from "./SidebarSubmenu";
import type { SidebarItemType } from "../constants/sidebarFields";

interface SidebarItemsProps {
  items: SidebarItemType[];
  isCollapsed: boolean;
}

const SidebarItems = ({
  items,
  isCollapsed,
}: SidebarItemsProps) => {
  const location = useLocation();

  return (
    <ul className={`flex flex-col space-y-2 ${isCollapsed ? "px-2" : "px-3"}`}>
      {items.map((item, index) => {
        if (item.children) {
          return (
            <SidebarSubmenu
              key={index}
              item={item}
              isCollapsed={isCollapsed}
            />
          );
        }

        const isActive =
          location.pathname === item.location ||
          (item.location !== "/" &&
            location.pathname.startsWith(`${item.location}/`));

        return (
          <li key={index} className="w-full relative group">
            <NavLink
              to={item.location}
              className={`flex items-center transition-all duration-300 w-full ${
                isCollapsed
                  ? "justify-center p-3 rounded-2xl"
                  : "px-3 py-3 rounded-2xl"
              } ${
                isActive
                  ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25 font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <motion.div
                className="flex items-center w-full"
                whileHover={{ x: isCollapsed ? 0 : 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div
                  className={`shrink-0 flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "text-white"
                      : "bg-[#1E293B]/50 text-[#94A3B8] group-hover:bg-[#1E293B] group-hover:text-slate-300"
                  }`}
                >
                  {typeof item.icon === "string" ? (
                    <i className={`${item.icon} text-lg`}></i>
                  ) : item.icon ? (
                    <item.icon className="text-xl" />
                  ) : null}
                </div>

                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`ml-4 text-[13px] transition-colors duration-300 ${isActive ? "font-semibold" : "font-medium"}`}
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
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarItems;
