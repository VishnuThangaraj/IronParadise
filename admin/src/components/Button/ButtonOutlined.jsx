import {useLayoutEffect, useRef} from "react"
import Button from "@mui/joy/Button";
import {useNavigate} from "react-router-dom";
import {gsap} from "gsap";

const ButtonOutlined = ({
                            children,
                            variant = "outlined",
                            className = "",
                            color = "primary",
                            size = "md",
                            sx = {},
                            loading = false,
                            loadingText = 'Adding...',
                            onClick,
                            ...props
                        }) => {

    const navigate = useNavigate();
    const btnRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(btnRef.current, {
                y: 60,
                opacity: 0,
                scale: 0.98,
            });

            gsap.to(btnRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.3,
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
            type="submit"
            variant={variant}
            color={color}
            size={size}
            onClick={handleClick}
            className={`transition-all duration-300 hover:scale-102 shadow-md ${className}`}
            sx={{
                px: 3,
                borderRadius: 7,
                ...sx,
            }}
            disabled={loading}
            {...props}
        >
            {children}
        </Button>
    );
}

export default ButtonOutlined;