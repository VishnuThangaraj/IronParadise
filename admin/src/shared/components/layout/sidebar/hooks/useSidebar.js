import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AdminSidebarItems } from "../constants/sidebarFields";

export const useSidebar = () => {
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [openMenus, setOpenMenus] = useState(() => {
    const initialOpenMenus = {};
    AdminSidebarItems.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const hasActiveChild = item.children.some(
            (child) =>
              location.pathname === child.location ||
              location.pathname.startsWith(child.location + "/"),
          );
          if (hasActiveChild) {
            initialOpenMenus[item.name] = true;
          }
        }
      });
    });
    return initialOpenMenus;
  });

  const [prevPathname, setPrevPathname] = useState(location.pathname);
  const [prevIsCollapsed, setPrevIsCollapsed] = useState(isCollapsed);

  if (location.pathname !== prevPathname || isCollapsed !== prevIsCollapsed) {
    setPrevPathname(location.pathname);
    setPrevIsCollapsed(isCollapsed);

    if (!isCollapsed) {
      const activeMenu = {};
      let needsUpdate = false;
      AdminSidebarItems.forEach((section) => {
        section.items.forEach((item) => {
          if (item.children) {
            const hasActiveChild = item.children.some(
              (child) =>
                location.pathname === child.location ||
                location.pathname.startsWith(child.location + "/"),
            );
            if (hasActiveChild && !openMenus[item.name]) {
              activeMenu[item.name] = true;
              needsUpdate = true;
            }
          }
        });
      });
      if (needsUpdate) {
        setOpenMenus((prev) => ({ ...prev, ...activeMenu }));
      }
    }
  }

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSubmenu = (name) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return {
    isCollapsed,
    setIsCollapsed,
    openMenus,
    toggleSubmenu,
    pathname: location.pathname,
  };
};

export default useSidebar;
