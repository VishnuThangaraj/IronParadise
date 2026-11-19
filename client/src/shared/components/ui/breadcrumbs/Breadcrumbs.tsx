import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LuChevronRight, LuHouse } from "react-icons/lu";
import {
  generateBreadcrumbs,
  type BreadcrumbItem,
} from "@/shared/utils/breadcrumb.utils";

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  userRole?: string;
  showHomeIcon?: boolean;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items: propItems,
  userRole,
  showHomeIcon = true,
  className = "",
}) => {
  const location = useLocation();

  const crumbs = propItems || generateBreadcrumbs(location.pathname, userRole);

  const isAtDashboard =
    location.pathname === "/" || location.pathname === "/dashboard";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs overflow-hidden select-none ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-y-1 text-slate-500 dark:text-slate-400">
        {/* Home / Root Node */}
        <li className="inline-flex items-center">
          {isAtDashboard ? (
            <span
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400"
              aria-current="page"
            >
              {showHomeIcon && <LuHouse size={13} className="shrink-0" />}
              <span>Dashboard</span>
            </span>
          ) : (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded"
              title="Return to Dashboard"
            >
              {showHomeIcon && <LuHouse size={13} className="shrink-0" />}
              <span>Home</span>
            </Link>
          )}
        </li>

        {/* Subsequent Breadcrumb Nodes */}
        {!isAtDashboard &&
          crumbs.map((item, index) => {
            const isLast = index === crumbs.length - 1;

            return (
              <li key={`${item.label}-${index}`} className="inline-flex items-center">
                <LuChevronRight
                  size={12}
                  className="mx-1.5 text-slate-400 dark:text-slate-600 shrink-0 select-none"
                  aria-hidden="true"
                />

                {isLast || item.isCurrent || !item.path ? (
                  <span
                    className={
                      isLast || item.isCurrent
                        ? "font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px] sm:max-w-[320px]"
                        : "text-slate-500 dark:text-slate-400"
                    }
                    {...(isLast || item.isCurrent ? { "aria-current": "page" } : {})}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 rounded truncate max-w-[160px]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
