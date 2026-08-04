import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

export const useSidebar = () => {
  // const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return { isCollapsed, setIsCollapsed };
};
