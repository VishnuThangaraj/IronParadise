import { motion } from "motion/react";
import { AdminSidebarItems } from "./constants/sidebarFields";
import SidebarHeader from "./components/SidebarHeader";
import SidebarItem from "./components/SidebarItem";
import SidebarSubmenu from "./components/SidebarSubmenu";
import SidebarFooter from "./components/SidebarFooter";
import useSidebar from "./hooks/useSidebar";

const Sidebar = () => {
  const {
    isCollapsed,
    setIsCollapsed,
    openMenus,
    toggleSubmenu,
    pathname,
  } = useSidebar();

  return (
    <motion.div
      animate={{ width: isCollapsed ? "5.25rem" : "16.5rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 flex flex-col justify-between bg-linear-to-b from-slate-950 via-slate-900 to-indigo-950 border-r border-slate-800/80 text-slate-300 select-none z-30 shadow-2xl shrink-0"
    >
      {/* Header / Logo */}
      <SidebarHeader
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Navigation Links */}
      <div className="overflow-y-auto overflow-x-hidden flex-1 px-3 py-5 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {AdminSidebarItems.map((sec) => (
          <div key={sec.section} className="flex flex-col gap-1.5">
            {/* Section Heading */}
            {isCollapsed ? (
              <div className="h-px bg-slate-800/80 my-2 mx-1.5" />
            ) : (
              <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase px-3.5 mb-1 select-none">
                {sec.section}
              </div>
            )}

            {/* Section Items */}
            {sec.items.map((item) => {
              const hasChildren = !!item.children;

              if (hasChildren) {
                return (
                  <SidebarSubmenu
                    key={item.name}
                    item={item}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    pathname={pathname}
                    isOpen={!!openMenus[item.name]}
                    toggleSubmenu={toggleSubmenu}
                  />
                );
              }

              return (
                <SidebarItem
                  key={item.name}
                  item={item}
                  isCollapsed={isCollapsed}
                  pathname={pathname}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile Section */}
      <SidebarFooter isCollapsed={isCollapsed} />
    </motion.div>
  );
};

export default Sidebar;
