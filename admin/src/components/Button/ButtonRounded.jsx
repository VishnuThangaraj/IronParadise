import {Fragment, useLayoutEffect, useRef} from "react";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import {useNavigate} from "react-router-dom";
import {gsap} from "gsap";

const ButtonRounded = ({
                           children,
                           variant = "solid",
                           location = "/",
                           className = "",
                           size = "md",
                           sx = {},
                           loading = false,
                           loadingText = "Loading ...",
                           onClick,
                           ...props
                       }) => {
    const navigate = useNavigate();
    const btnRef = useRef(null);


    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(btnRef.current, {
                y: -60,
                opacity: 0,
                scale: 0.98,
            });

            gsap.to(btnRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "power4.out",
                force3D: true,
                clearProps: "transform",
            });
        });

        return () => ctx.revert();
    }, []);

    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        } else if (location) {
            navigate(location);
        }
    };

    return (
        <Button
            ref={btnRef}
            variant={variant}
            size={size}
            className={`transition-all duration-300 hover:scale-102 shadow-md ${className}`}
            onClick={handleClick}
            sx={{
                px: 3,
                borderRadius: 20,
                backgroundColor: "black",
                "&:hover": {
                    backgroundColor: "#222222",
                },
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