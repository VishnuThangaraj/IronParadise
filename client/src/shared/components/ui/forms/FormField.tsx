import type { ReactNode } from "react";

interface FormFieldProps {
  children: ReactNode;
  size?: number;
}

const FormField = ({ children, size }: FormFieldProps) => {
  let colSpanClass = "sm:col-span-12";
  if (size === 50) colSpanClass = "sm:col-span-6";
  else if (size === 30) colSpanClass = "sm:col-span-4";

  return (
    <div className={`col-span-1 my-2 sm:my-0 ${colSpanClass}`}>
      {children}
    </div>
  );
};

export default FormField;
