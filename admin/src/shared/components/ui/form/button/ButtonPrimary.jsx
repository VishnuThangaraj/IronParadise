import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { motion } from "motion/react";
import { fadeUp } from "@/shared/animations";

const MotionButton = motion.create(Button);

const ButtonPrimary = ({
  children,
  variant = "contained",
  className = "",
  size = "md",
  sx = {},
  loading = false,
  loadingText = "Adding...",
  onClick,
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
    <MotionButton
      {...fadeUp}
      type="submit"
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`shadow-md ${className}`}
      sx={{
        px: 3,
        color: "white",
        borderRadius: 2,
        textTransform: "none",
        backgroundColor: "black",
        position: "relative",
        overflow: "hidden",
        transition:
          "background-color 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          backgroundColor: "#222222",
          transform: "scale(1.02)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        },
        "&:active": {
          transform: "scale(0.98)",
        },
        "&.Mui-disabled": {
          color: "rgba(255,255,255,0.7)",
          backgroundColor: "#333",
        },
        ...sx,
      }}
      disabled={loading}
      {...props}
    >
      {/* Content layer — fades out when loading */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          opacity: loading ? 0 : 1,
          transform: loading ? "translateY(-1px)" : "translateY(0)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          pointerEvents: "none",
        }}
      >
        {children}
      </span>

      {/* Loading layer — fades in when loading */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: loading ? 1 : 0,
          transform: loading ? "translateY(0)" : "translateY(1px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          pointerEvents: "none",
        }}
      >
        <CircularProgress
          size={16}
          thickness={5}
          sx={{ color: "rgba(255,255,255,0.85)" }}
        />
        <span style={{ fontSize: "inherit", fontWeight: "inherit" }}>
          {loadingText}
        </span>
      </span>
    </MotionButton>
  );
};

export default ButtonPrimary;
