import {toast} from "sonner"

export const formFieldColSpan = (size) => {
  switch (size) {
    case 100:
      return "col-span-12";
    case 50:
      return "col-span-6";
    case 30:
      return "col-span-4";
    default:
      return "col-span-6";
  }
};

export const validateFields = (fields) => {

  for (const key in fields) {
    if (fields[key] === null || fields[key] === '') {
      toast.warning("All Fields are required")
      return false;
    }
  }
  return true;
}