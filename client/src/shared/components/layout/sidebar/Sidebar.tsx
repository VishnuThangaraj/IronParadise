import { useSelector } from "react-redux";
import { selectUser } from "@/modules/auth/redux/auth.selector";
import SidebarFooter from "@/shared/components/layout/sidebar/components/SidebarFooter";
import SidebarHeader from "@/shared/components/layout/sidebar/components/SidebarHeader";
import SidebarItems from "@/shared/components/layout/sidebar/components/SidebarItems";
import { useSidebar } from "@/shared/components/layout/sidebar/hooks/useSidebar";
import {
  GeneralSidebarItems,
  AdminSidebarItems,
  TrainerSidebarItems,
  MemberSidebarItems,
  type SidebarItemType,
} from "@/shared/components/layout/sidebar/constants/sidebarFields";



const Sidebar = () => {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const user = useSelector(selectUser);

  const role = user?.role?.toLowerCase() || "";

  let roleSpecificItems: SidebarItemType[] = [];
  if (role === "admin") {
    roleSpecificItems = AdminSidebarItems;
  } else if (role === "trainer") {
    roleSpecificItems = TrainerSidebarItems;
  } else if (role === "member") {
    roleSpecificItems = MemberSidebarItems;
  }

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800/80 text-slate-300 transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] shrink-0 z-50 select-none shadow-2xl shadow-black/50 ${
        isCollapsed ? "w-[76px]" : "w-[268px]"
      }`}
    >
      {/* Sidebar Header */}
      <SidebarHeader
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar py-5 flex flex-col gap-6">
        {/* General Section */}
        <div>
          {isCollapsed ? (
            <div className="h-px bg-linear-to-r from-transparent via-slate-800 to-transparent my-2 mx-3" />
          ) : (
            <div className="px-6 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/70 shrink-0" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                General
              </p>
            </div>
          )}
          <SidebarItems
            items={GeneralSidebarItems}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </div>

        {/* Role-Specific Applications Section */}
        {roleSpecificItems.length > 0 && (
          <div>
            {isCollapsed ? (
              <div className="h-px bg-linear-to-r from-transparent via-slate-800 to-transparent my-2 mx-3" />
            ) : (
              <div className="px-6 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500/70 shrink-0" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Management
                </p>
              </div>
            )}
            <SidebarItems
              items={roleSpecificItems}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          </div>
        )}
      </div>

      {/* Sidebar Footer with User Profile */}
      <SidebarFooter isCollapsed={isCollapsed} />
    </aside>
  );
};

export default Sidebar;
