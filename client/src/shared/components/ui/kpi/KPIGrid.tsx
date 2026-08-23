import type { ReactNode } from "react";
import KPICard, { type KPICardProps } from "./KPICard";

export interface KPIGridProps {
  children?: ReactNode;
  items?: KPICardProps[];
  columns?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

const columnClassesMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
};

export const KPIGrid = ({
  children,
  items,
  columns = 4,
  className = "",
}: KPIGridProps) => {
  const colClass = columnClassesMap[columns] || columnClassesMap[4];

  return (
    <div className={`grid ${colClass} gap-4 w-full ${className}`}>
      {items
        ? items.map((item, index) => (
            <KPICard key={item.id ?? `kpi-item-${index}`} {...item} />
          ))
        : children}
    </div>
  );
};

export default KPIGrid;
