export const authFormField = {
  "& .MuiOutlinedInput-root": {
    color: "white",
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.1)",
      transition: "border-color 0.2s ease",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(255, 255, 255, 0.25) !important",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#6366f1 !important",
      borderWidth: "2px",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255, 255, 255, 0.4)",
    opacity: 1,
  },
};
