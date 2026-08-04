import { useSelector } from "react-redux";
import { selectUser } from "@/modules/auth/redux/authSelector";
import SidebarFooter from "@/shared/components/layout/sidebar/components/SidebarFooter";
import SidebarHeader from "@/shared/components/layout/sidebar/components/SidebarHeader";
import SidebarItems from "@/shared/components/layout/sidebar/components/SidebarItems";
import { useSidebar } from "@/shared/components/layout/sidebar/hooks/useSidebar";
import {
  GeneralSidebarItems,
  AdminSidebarItems,
  TrainerSidebarItems,
  MemberSidebarItems,
} from "@/shared/components/layout/sidebar/constants/sidebarFields";

const Sidebar = () => {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const user = useSelector(selectUser);

  // Fallback to empty string if role is undefined
  const role = user?.role?.toLowerCase() || "";

  let roleSpecificItems: any[] = [];
  if (role === "admin") {
    roleSpecificItems = AdminSidebarItems;
  } else if (role === "trainer") {
    roleSpecificItems = TrainerSidebarItems;
  } else if (role === "member") {
    roleSpecificItems = MemberSidebarItems;
  }

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 bg-[#0B1120] dark:bg-slate-950 border-r border-slate-800/80 dark:border-slate-800/50 transition-all duration-300 ease-in-out shrink-0 z-50 ${
        isCollapsed ? "w-20" : "w-70"
      }`}
    >
      <SidebarHeader
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none py-6 flex flex-col gap-8">
        <div>
          {!isCollapsed && (
            <p className="px-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              General
            </p>
          )}
          <SidebarItems items={GeneralSidebarItems} isCollapsed={isCollapsed} />
        </div>

        {roleSpecificItems.length > 0 && (
          <div>
            {!isCollapsed && (
              <p className="px-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                Applications
              </p>
            )}
            <SidebarItems items={roleSpecificItems} isCollapsed={isCollapsed} />
          </div>
        )}
      </div>

      <SidebarFooter isCollapsed={isCollapsed} />
    </aside>
  );
};

export default Sidebar;
