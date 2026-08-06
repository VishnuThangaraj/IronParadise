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
      className={`flex flex-col h-screen sticky top-0 bg-linear-to-b from-slate-950 via-slate-900 to-indigo-950 border-r border-slate-800/80 text-slate-300 transition-all duration-300 ease-in-out shrink-0 z-50 ${
        isCollapsed ? "w-20" : "w-66"
      }`}
    >
      <SidebarHeader
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none py-6 flex flex-col gap-8">
        <div>
          {isCollapsed ? (
            <div className="h-px bg-slate-800/80 my-2 mx-4" />
          ) : (
            <p className="px-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
              General
            </p>
          )}
          <SidebarItems items={GeneralSidebarItems} isCollapsed={isCollapsed} />
        </div>

        {roleSpecificItems.length > 0 && (
          <div>
            {isCollapsed ? (
              <div className="h-px bg-slate-800/80 my-2 mx-4" />
            ) : (
              <p className="px-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
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
