import {Fragment} from "react"
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";

const ButtonSubmit = ({
                          children,
                          variant = "solid",
                          className = "",
                          size = "md",
                          sx = {},
                          loading = false,
                          loadingText = 'Adding...',
                          ...props
                      }) => (
    <Button
        type="submit"
        variant={variant}
        size={size}
        className={`transition-all duration-300 hover:scale-105 ${className}`}
        sx={{
            px: 3,
            borderRadius: 7,
            backgroundColor: "black",
            "&:hover": {backgroundColor: "#222222"},
            ...sx,
        }}
        disabled={loading}
        {...props}
    >
        {loading ? (
            <Fragment>
                <CircularProgress variant="solid"/>
                <span className="ms-3">{loadingText}</span>
            </Fragment>
        ) : (
            children
        )}
    </Button>
);

export default ButtonSubmit;