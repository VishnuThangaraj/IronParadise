import { useState, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

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
  position = "bottom",
  className = "",
  delay = 150,
  showArrow = true,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionStyles = {
    top: "bottom-full mb-2.5 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2.5 left-1/2 -translate-x-1/2",
    left: "right-full mr-2.5 top-1/2 -translate-y-1/2",
    right: "left-full ml-2.5 top-1/2 -translate-y-1/2",
  };

  const arrowStyles = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-white/95 dark:border-t-slate-900/95 border-x-transparent border-b-transparent border-[5px]",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-b-white/95 dark:border-b-slate-900/95 border-x-transparent border-t-transparent border-[5px]",
    left: "left-full top-1/2 -translate-y-1/2 border-l-white/95 dark:border-l-slate-900/95 border-y-transparent border-r-transparent border-[5px]",
    right:
      "right-full top-1/2 -translate-y-1/2 border-r-white/95 dark:border-r-slate-900/95 border-y-transparent border-l-transparent border-[5px]",
  };

  const animationVariants = {
    top: {
      initial: { opacity: 0, scale: 0.92, y: 5 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.92, y: 5 },
    },
    bottom: {
      initial: { opacity: 0, scale: 0.92, y: -5 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.92, y: -5 },
    },
    left: {
      initial: { opacity: 0, scale: 0.92, x: 5 },
      animate: { opacity: 1, scale: 1, x: 0 },
      exit: { opacity: 0, scale: 0.92, x: 5 },
    },
    right: {
      initial: { opacity: 0, scale: 0.92, x: -5 },
      animate: { opacity: 1, scale: 1, x: 0 },
      exit: { opacity: 0, scale: 0.92, x: -5 },
    },
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && title && (
          <motion.div
            initial={animationVariants[position].initial}
            animate={animationVariants[position].animate}
            exit={animationVariants[position].exit}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 pointer-events-none whitespace-nowrap ${positionStyles[position]} ${className}`}
          >
            {/* Main Tooltip Body */}
            <div className="px-3 py-1.5 text-[11.5px] font-semibold text-slate-700 dark:text-slate-100 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-lg shadow-slate-900/10 dark:shadow-black/70 flex items-center gap-1.5">
              {title}
            </div>

            {/* Optional Arrow */}
            {showArrow && (
              <div
                className={`absolute w-0 h-0 pointer-events-none ${arrowStyles[position]}`}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
