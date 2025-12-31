import { Input } from "@mui/joy";

const SearchBar = ({ value, onChange }) => {
  return (
    <Input
      placeholder="Search..."
      className="shadow-md"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ width: "40%", borderRadius: 10 }}
    />
  );
};

export default SearchBar;
