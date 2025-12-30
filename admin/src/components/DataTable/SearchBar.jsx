import { Input } from "@mui/joy";

const SearchBar = ({ value, onChange }) => {
  return (
    <Input
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ width: "300px" }}
    />
  );
};

export default SearchBar;
