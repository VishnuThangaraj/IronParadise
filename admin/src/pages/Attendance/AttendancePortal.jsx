import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import Grid from "@mui/joy/Grid";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";

import {
  AttendanceFieldGroup,
  initialAttendanceState,
} from "../../config/AttendanceFields";

const AttendancePortal = () => {
  const [attendance, setAttendance] = useState(initialAttendanceState);

  const handleChange = (name, value) => {
    const raw = value.toUpperCase();

    let letters = "";
    let numbers = "";

    for (const char of raw) {
      if (letters.length < 3 && /[A-Z]/.test(char)) {
        letters += char;
        continue;
      }

      if (letters.length === 3 && /[0-9]/.test(char) && numbers.length < 3) {
        numbers += char;
      }
    }

    let formatted = letters;

    if (letters.length === 3) {
      formatted += "-";
    }

    formatted += numbers;

    setAttendance((prev) => ({
      ...prev,
      [name]: formatted,
    }));
  };

  const handleSubmit = () => {};
  return (
    <div
      id="AttendancePortal"
      key="AttendancePortal"
      style={{
        background:
          'url("../../../public/images/login_background.webp") center / cover no-repeat',
        width: "100vw",
      }}
      className="flex items-center justify-center h-screen "
    >
      <div className="flex flex-col gap-5 items-center">
        <img
          src="../../../public/images/logo_black.webp"
          alt="Iron Paradise"
          width={100}
        />
        <Grid
          sx={{ p: 5, borderRadius: 9 }}
          className="bg-white w-120 shadow-md"
        >
          <div className="loginform_header">
            <div className="font-bold text-xl">Attendance Portal</div>
            <div
              className="text-sm text-gray-500"
              style={{ letterSpacing: "1px" }}
            >
              Enter your ID and verify your name
            </div>
          </div>
          <form
            className="flex flex-col justify-between mb-1"
            // onSubmit={handleSubmit}
          >
            {AttendanceFieldGroup.map((field, index) => {
              return (
                <FormControl
                  key={`attendance-portal-${field.name}-${index}`}
                  sx={{ mt: 3 }}
                >
                  <FormLabel className="font-semibold">{field.label}</FormLabel>
                  <Input
                    size="sm"
                    sx={{ py: 1 }}
                    value={attendance[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={field?.disabled ?? false}
                    variant="soft"
                  />
                </FormControl>
              );
            })}
            <div className="flex justify-between my-7 text-sm">
              <div>Verify your ID and Name before marking Attendance.</div>
            </div>
            <Button
              type="submit"
              size="md"
              className="transition-all duration-300 hover:scale-101"
              variant="solid"
              sx={{
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "#2A2A2A",
                },
              }}
              fullWidth
            >
              Mark Attendance
            </Button>
          </form>
          <div className="mt-7 flex items-center justify-between">
            <span className="text-sm">Need any help? Reach out to us</span>
            <Button
              size="md"
              className="transition-all duration-300 hover:scale-101"
              variant="outlined"
              color="neutral"
              sx={{
                border: "1px solid black",
              }}
            >
              <i className="fa fa-message me-1"></i>Connect with Us
            </Button>
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default AttendancePortal;
