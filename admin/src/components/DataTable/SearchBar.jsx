import {Input} from "@mui/joy";
import {useEffect, useRef} from "react";
import {gsap} from "gsap";

const SearchBar = ({value, onChange}) => {
    const inputRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            inputRef.current,
            {
                opacity: 0,
                x: 0,
                y: 60,
                scale: 0.9,
            },
            {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: "power3.out",
            }
        );
    }, []);

    return (
        <Input
            ref={inputRef}
            placeholder="Search..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
                width: "35%",
                borderRadius: 10,

                "--Input-focusedHighlight": "#4b5563",
                "--Input-focusedThickness": "1px",

                "--joy-palette-primary-500": "#4b5563",

                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",

                "&:focus-within": {
                    boxShadow:
                        "0px 6px 12px rgba(0,0,0,0.2), 0px 3px 6px rgba(0,0,0,0.15)",
                },
            }}
        />
    );
};

export default SearchBar;