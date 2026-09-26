import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "search"
  | "tel"
  | "url"
  | "date"
  | "datetime-local"
  | "month"
  | "time"
  | "week"
  | "checkbox"
  | "radio"
  | "file"
  | "submit"
  | "reset"
  | "button"
  | "color"
  | "hidden"
  | "image"
  | "range"
  | "text-box"
  | "textbox"
  | "textarea"
  | (string & {});

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  labelClassName?: string;
  textbox?: boolean;
  multiline?: boolean;
  as?: "input" | "textarea";
  rows?: number;
  cols?: number;
  type?: InputType;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement> &
      React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}

const Input = ({
  label,
  labelClassName = "",
  className = "",
  textbox,
  multiline,
  as,
  rows,
  cols,
  type = "text",
  ...props
}: InputProps) => {
  const inputId = props.id || props.name;
  const isTextbox = Boolean(
    textbox ||
      multiline ||
      as === "textarea" ||
      type === "text-box" ||
      type === "textbox" ||
      type === "textarea",
  );

  const sharedClassName = `block w-full rounded-md border border-white/60 px-3 py-2 bg-white/40 backdrop-blur-md text-slate-900 placeholder-slate-500 shadow-sm hover:bg-white/50 focus:bg-white/70 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 sm:text-sm transition-all duration-300 dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:placeholder-slate-400 dark:hover:bg-slate-900/70 dark:focus:bg-slate-900/80 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/50 ${className}`;

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={inputId}
          className={`mb-1 ps-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      {isTextbox ? (
        <textarea
          id={inputId}
          rows={rows ?? 3}
          cols={cols}
          className={sharedClassName}
          {...(props as unknown as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          className={sharedClassName}
          {...props}
        />
      )}
    </div>
  );
};

export default Input;
