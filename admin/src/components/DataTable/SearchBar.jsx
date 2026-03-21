import {Input} from "@mui/joy";

const SearchBar = ({value, onChange}) => {
    return (
        <Input
            placeholder="Search..."
            className="shadow-md hover:scale-101 transition duration-300 ease-in-out"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
                width: "40%",
                borderRadius: 10,

                "--Input-focusedHighlight": "#4b5563",
                "--Input-focusedThickness": "1px",

                "--joy-palette-primary-500": "#4b5563",
                "--joy-palette-primary-solidColor": "#4b5563",
                "--joy-palette-primary-outlinedBorder": "#4b5563",

                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                transition: "all 0.15s ease",

                "&:focus-within": {
                    boxShadow:
                        "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)",
                    transform: "scale(1.005)",
                },
            }}
        />
    );
};

export default SearchBar;