import {toast} from "sonner"

export const handleChangeValidation = (value, rules = {}) => {
    const {type, maxLength, maxValue, pattern} = rules;

    if (value === "") return true;

    const numValue = Number(value);

    if (type === "number" && Number.isNaN(numValue)) return false;

    if (maxLength && value.length > maxLength) return false;

    if (maxValue && numValue > maxValue) return false;

    if (pattern && !pattern.test(value)) return false;

    return true;
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