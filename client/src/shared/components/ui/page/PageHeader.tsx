import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

const PageHeader = ({ children, title, description }: PageHeaderProps) => {
  return (
    <div className="flex justify-between gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-3xl text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
      <div className="flex justify-center align-middle items-center">{children}</div>
    </div>
  );
};

export default PageHeader;
