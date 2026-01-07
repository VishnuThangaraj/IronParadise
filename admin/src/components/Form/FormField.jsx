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

const FormField = ({ field, value, onChange }) => {
  if (field.type === "select") {
    return (
      <FormControl>
        <FormLabel sx={{ fontSize: 15 }}>{field.label}</FormLabel>

        <Select
          value={value ?? null}
          placeholder={field.placeholder}
          onChange={(_, val) => onChange(field.name, val)}
          size="md"
          sx={fieldStyle}
          disabled={field.disabled}
          required={field.required !== false}
        >
          {field.options.map((option) => {
            const optionValue =
              typeof option === "object" ? option.value : option;
            const optionLabel =
              typeof option === "object" ? option.label : option;

            return (
              <Option key={optionValue} value={optionValue}>
                {optionLabel}
              </Option>
            );
          })}
        </Select>
      </FormControl>
    );
  }

  if (field.type === "textbox") {
    return (
      <FormControl>
        <FormLabel sx={{ fontSize: 15 }}>{field.label}</FormLabel>
        <Textarea
          value={value ?? ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          minRows={field.rows || 2}
          maxRows={field.rows || 2}
          disabled={field.disabled}
          placeholder={field.placeholder}
        />
      </FormControl>
    );
  }

  return (
    <FormControl>
      <FormLabel sx={{ fontSize: 15 }}>{field.label}</FormLabel>
      <Input
        type={field.type || "text"}
        value={value ?? ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        disabled={field.disabled}
        startDecorator={field.mobile ? "+91" : null}
        placeholder={field.placeholder}
        sx={fieldStyle}
      />
    </FormControl>
  );
};

export default FormField;
