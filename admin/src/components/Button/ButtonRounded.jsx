import {Fragment} from "react";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import {useNavigate} from "react-router-dom";

const ButtonRounded = ({
                           children,
                           variant = "solid",
                           location = "/",
                           className = "",
                           size = "md",
                           sx = {},
                           loading = false,
                           loadingText = "Loading ...",
                           onClick, // allow custom click too
                           ...props
                       }) => {
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        } else if (location) {
            navigate(location);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={`transition-all duration-300 hover:scale-102 shadow-md ${className}`}
            onClick={handleClick}
            sx={{
                px: 3,
                borderRadius: 20,
                backgroundColor: "black",
                "&:hover": {backgroundColor: "#222222"},
                ...sx,
            }}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <Fragment>
                    <CircularProgress size="sm"/>
                    <span className="ms-3">{loadingText}</span>
                </Fragment>
            ) : (
                children
            )}
        </Button>
    );
};

export default ButtonRounded;