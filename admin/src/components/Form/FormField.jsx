import { FormControl, FormLabel, Input, Select, Option } from "@mui/joy";

const fieldStyle = {
  py: 1,
  height: 42,
  backgroundColor: "white",
  fontSize: 15,
};

const FormField = ({ field, value, onChange }) => {
  if (field.type === "select") {
    return (
      <FormControl key={field.name}>
        <FormLabel sx={{ fontSize: 15 }}>{field.label}</FormLabel>
        <Select
          name={field.name}
          value={value || ""}
          onChange={(_, val) => onChange(field.name, val)}
          size="md"
          sx={fieldStyle}
          required
        >
          {field.options.map((opt) => (
            <Option key={opt} value={opt}>
              {opt}
            </Option>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <FormControl key={field.name}>
      <FormLabel sx={{ fontSize: 15 }}>{field.label}</FormLabel>
      <Input
        placeholder={field.placeholder}
        name={field.name}
        type={field.type || "text"}
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        size="md"
        variant="outlined"
        sx={fieldStyle}
        startDecorator={field.mobile ? field.countryCode || "+91" : null}
        required={field.required !== false}
      />
    </FormControl>
  );
};

export default FormField;
