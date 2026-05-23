import toast from "react-hot-toast";

export const handleChangeValidation = (value, rules = {}) => {
  const { type, maxLength, min, max, pattern } = rules;

  if (value === "") return true;

  if (type === "number") {
    const numValue = Number(value);
    if (Number.isNaN(numValue)) return false;

    if (min !== undefined && min >= 0 && numValue < 0) return false;
    if (max !== undefined && numValue > max) return false;

    return true;
  }

  if (maxLength && value.length > maxLength) return false;

  if (pattern) {
    if (type === "email") return true;

    const patternString = pattern.toString();

    if (patternString.includes("^[0-9]")) {
      if (!/^[0-9]*$/.test(value)) return false;
    } else if (patternString.includes("^[A-Z]")) {
      if (!/^[a-zA-Z0-9]*$/.test(value)) return false;
    } else {
      if (!patternString.includes("{") && !pattern.test(value)) return false;
    }
  }

  return true;
};

export const validateFields = (fields) => {
  for (const key in fields) {
    if (fields[key] === null || fields[key] === "") {
      toast.error("All Fields are required");
      return false;
    }
  }
  return true;
};
