import { type ToastMessage } from "@/shared/components/ui/toast";

export interface ValidationRules {
  type?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
}

type AddToastFn = (toast: Omit<ToastMessage, "id">) => void;

export const handleChangeValidation = (
  value: string,
  rules: ValidationRules = {},
  addToast?: AddToastFn,
): boolean => {
  const { type, maxLength, min, max, pattern } = rules;

  if (value === "") return true;

  if (type === "number") {
    const numValue = Number(value);
    if (Number.isNaN(numValue)) {
      addToast?.({ type: "error", message: "Please enter a valid number." });
      return false;
    }

    if (min !== undefined && min >= 0 && numValue < 0) {
      addToast?.({
        type: "error",
        message: `Value cannot be less than ${min}.`,
      });
      return false;
    }
    if (max !== undefined && numValue > max) {
      addToast?.({ type: "error", message: `Value cannot exceed ${max}.` });
      return false;
    }

    return true;
  }

  if (maxLength && value.length > maxLength) {
    addToast?.({
      type: "error",
      message: `Maximum length is ${maxLength} characters.`,
    });
    return false;
  }

  if (pattern) {
    if (type === "email") return true;

    const patternString = pattern.toString();

    if (patternString.includes("^[0-9]")) {
      if (!/^[0-9]*$/.test(value)) {
        addToast?.({ type: "error", message: "Only numbers are allowed." });
        return false;
      }
    } else if (patternString.includes("^[A-Z]")) {
      if (!/^[a-zA-Z0-9]*$/.test(value)) {
        addToast?.({
          type: "error",
          message: "Only alphanumeric characters are allowed.",
        });
        return false;
      }
    } else {
      if (!patternString.includes("{") && !pattern.test(value)) {
        addToast?.({ type: "error", message: "Invalid format." });
        return false;
      }
    }
  }

  return true;
};

export const validateFields = <T extends object>(
  fields: T,
  addToast?: AddToastFn,
): boolean => {
  for (const value of Object.values(fields)) {
    if (!value) {
      addToast?.({
        type: "warning",
        message: "Looks like a few fields are missing",
      });
      return false;
    }
  }
  return true;
};
