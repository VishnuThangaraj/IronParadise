import { NavLink, useLocation } from "react-router-dom";
import SidebarSubmenu from "./SidebarSubmenu";
import type { SidebarItemType } from "../constants/sidebarFields";

interface SidebarItemsProps {
  items: SidebarItemType[];
  isCollapsed: boolean;
}

const SidebarItems = ({ items, isCollapsed }: SidebarItemsProps) => {
  const location = useLocation();

  return (
    <ul className={`flex flex-col space-y-2 ${isCollapsed ? "px-2" : "px-4"}`}>
      {items.map((item, index) => {
        if (item.children) {
          return (
            <SidebarSubmenu key={index} item={item} isCollapsed={isCollapsed} />
          );
        }

        const isActive = location.pathname.startsWith(item.location);

        return (
          <li key={index} className="w-full">
            <NavLink
              to={item.location}
              className={`flex items-center transition-all duration-300 group w-full ${
                isCollapsed
                  ? "justify-center p-3 rounded-2xl"
                  : "px-3 py-3 rounded-2xl"
              } ${
                isActive
                  ? "bg-linear-to-r from-[#8B5CF6] to-[#6D28D9] text-white shadow-lg shadow-[#8B5CF6]/25"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
              title={isCollapsed ? item.name : ""}
            >
              <div
                className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
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
                <span
                  className={`ml-4 text-[15px] transition-all duration-300 ${isActive ? "font-semibold" : "font-medium"}`}
                >
                  {item.name}
                </span>
              )}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarItems;
