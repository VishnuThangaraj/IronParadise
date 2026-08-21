import type { ReactNode } from "react";
import MuiTooltip from "@mui/material/Tooltip";

export interface TooltipProps {
  title: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
  showArrow?: boolean;
}

const Tooltip = ({
  title,
  children,
  position = "top",
  className = "",
  delay = 150,
}: TooltipProps) => {
  if (!title) return <>{children}</>;

  return (
    <MuiTooltip
      title={
        <div
          className={`px-3 py-1.5 text-[11.5px] font-semibold text-slate-700 dark:text-slate-100 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-900/10 dark:shadow-black/70 flex items-center gap-1.5 ${className}`}
        >
          {title}
        </div>
      }
      placement={position}
      enterDelay={delay}
      slotProps={{
        popper: {
          sx: {
            zIndex: 99999,
          },
        },
        tooltip: {
          sx: {
            backgroundColor: "transparent !important",
            padding: "4px !important",
            boxShadow: "none !important",
            maxWidth: "none !important",
          },
        },
      }}
    >
      <span className="inline-flex items-center">{children}</span>
    </MuiTooltip>
  );
};

export default Tooltip;

