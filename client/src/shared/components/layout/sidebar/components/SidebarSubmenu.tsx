import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LuChevronDown } from "react-icons/lu";
import type { SidebarItemType } from "../constants/sidebarFields";

interface SidebarSubmenuProps {
  item: SidebarItemType;
  isCollapsed: boolean;
}

const SidebarSubmenu = ({ item, isCollapsed }: SidebarSubmenuProps) => {
  const location = useLocation();
  const isAnyChildActive =
    item.children?.some((child) =>
      location.pathname.startsWith(child.location),
    ) ?? false;

  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  const toggleSubmenu = () => {
    if (!isCollapsed) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li className="flex flex-col space-y-1 w-full">
      <button
        onClick={toggleSubmenu}
        className={`flex items-center transition-all duration-300 group w-full ${
          isCollapsed
            ? "justify-center p-3 rounded-2xl"
            : "px-3 py-3 rounded-2xl"
        } ${
          isAnyChildActive
            ? "text-slate-200 font-semibold"
            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
        }`}
        title={isCollapsed ? item.name : ""}
      >
        <div
          className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
            isAnyChildActive
              ? "bg-[#1E293B] text-slate-300"
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
          <>
            <span className="ml-4 text-[15px] font-medium whitespace-nowrap flex-1 text-left transition-colors duration-300">
              {item.name}
            </span>
            <span
              className={`ml-auto text-sm transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"} ${isAnyChildActive ? "text-slate-400" : "text-[#64748B] group-hover:text-slate-400"}`}
            >
              <LuChevronDown />
            </span>
          </>
        )}
      </button>

      {/* Submenu Items */}
      {!isCollapsed && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-125 opacity-100 mt-1" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="ml-8 pl-4 space-y-1 border-l border-slate-800 relative">
            {item.children?.map((child, index) => {
              const isChildActive =
                location.pathname === child.location ||
                location.pathname.startsWith(`${child.location}/`);

              return (
                <li key={index} className="w-full relative py-0.5">
                  {/* Decorative dot indicator for active/inactive child */}
                  <div
                    className={`absolute left-[-1.12rem] top-1/2 -translate-y-1/2 w-1.24 h-1.25 rounded-full transition-colors duration-300 z-10 ${
                      isChildActive ? "bg-[#94A3B8]" : "bg-[#475569]"
                    }`}
                  />

                  <NavLink
                    to={child.location}
                    className={`flex items-center px-4 py-2.5 rounded-xl transition-all duration-200 w-full text-[14px] relative ${
                      isChildActive
                        ? "text-white font-semibold bg-[#1E293B]"
                        : "text-[#64748B] hover:text-slate-200 hover:bg-[#1E293B]/50"
                    }`}
                  >
                    <span className="whitespace-nowrap">{child.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
};

export default SidebarSubmenu;
