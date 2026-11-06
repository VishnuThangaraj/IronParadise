import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "@/modules/auth/redux/auth.selector";

interface RoleRouteProps {
  allowedRoles: Array<"admin" | "trainer" | "member" | string>;
  children: ReactNode;
  fallbackPath?: string;
}

const RoleRoute = ({
  allowedRoles,
  children,
  fallbackPath = "/dashboard",
}: RoleRouteProps) => {
  const user = useSelector(selectUser);
  const currentRole = user?.role?.toLowerCase() || "";

  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
