import { FormControl, FormLabel, TextField } from "@mui/material";

const FormField = ({
  field = {},
  fieldStyle,
  value,
  formSize = "medium",
  onChange,
  label = true,
  className = "",
  disabled = false,
}) => {
  return (
    <FormControl fullWidth>
      {label && <FormLabel sx={{ fontSize: 15 }}>{field.label}</FormLabel>}

      <TextField
        type={field.type || "text"}
        value={value ?? ""}
        size={formSize}
        onChange={(e) => onChange && onChange(field.name, e.target.value)}
        className={className}
        disabled={disabled}
        placeholder={field.placeholder}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",

            "& fieldset": {
              borderRadius: "8px",
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
              borderWidth: "2px",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#333",
            },
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "black",
          },

          ...fieldStyle,
        }}
      />
    </FormControl>
  );
};

export default FormField;
