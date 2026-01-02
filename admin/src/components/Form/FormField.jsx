import {
  FormControl,
  Textarea,
  FormLabel,
  Input,
  Select,
  Option,
} from "@mui/joy";

const fieldStyle = {
  py: 1,
  height: 42,
  backgroundColor: "white",
  fontSize: 15,
};

const textAreaFieldStyle = {
  py: 1,
  backgroundColor: "white",
  fontSize: 15,
};

const FormField = ({ field, value, onChange }) => {
  const handleInputChange = (e) => {
    onChange(field.name, e.target.value);
  };

  if (field.type === "select") {
    return (
      <FormControl>
        <FormLabel sx={{ fontSize: 15 }}>{field.label}</FormLabel>
        <Select
          name={field.name}
          value={value ?? ""}
          placeholder={field.placeholder}
          onChange={(_, val) => onChange(field.name, val)}
          size="md"
          sx={fieldStyle}
          required={field.required !== false}
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

  if (field.type === "textbox") {
    return (
      <FormControl sx={{ width: "100%" }}>
        <FormLabel sx={{ fontSize: 15 }}>{field.label}</FormLabel>
        <Textarea
          name={field.name}
          value={value ?? ""}
          placeholder={field.placeholder}
          onChange={handleInputChange}
          size="md"
          sx={textAreaFieldStyle}
          minRows={2}
          maxRows={2}
          required={field.required !== false}
        />
      </FormControl>
    );
  }

  return (
    <FormControl>
      <FormLabel sx={{ fontSize: 15 }}>{field.label}</FormLabel>
      <Input
        name={field.name}
        type={field.type || "text"}
        value={value ?? ""}
        placeholder={field.placeholder}
        onChange={handleInputChange}
        size="md"
        variant="outlined"
        sx={fieldStyle}
        startDecorator={field.mobile ? field.countryCode || "+91" : null}
        required={field.required !== false}
        disabled={Boolean(field.disabled)}
      />
    </FormControl>
  );
};

export default FormField;
