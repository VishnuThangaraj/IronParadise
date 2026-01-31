import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "sonner";
import Grid from "@mui/joy/Grid";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import withReactContent from "sweetalert2-react-content";

import { gymQuotes } from "../../config/GymQuotes";

import {
  AttendanceFieldGroup,
  initialAttendanceState,
} from "../../config/AttendanceFields";

import { fetchMemberByMemberId } from "../../redux/member/memberThunks";
import { fetchTrainerByUserId } from "../../redux/trainer/trainerThunks";
import { addNewAttendance } from "../../redux/attendance/attendanceThunks";

const MySwal = withReactContent(Swal);

const AttendancePortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState(initialAttendanceState);
  const [invalidIdError, setInvalidIdError] = useState(null);

  const isAlphabetic = (v) => /^[A-Z]+$/.test(v);
  const isNumeric = (v) => /^\d+(\.\d+)?$/.test(v);

  const fetchUserWithId = async (value) => {
    try {
      const isMember = value.startsWith("MBR");

      const action = isMember
        ? fetchMemberByMemberId({ memberId: value })
        : fetchTrainerByUserId({ trainerId: value });

      const data = await dispatch(action).unwrap();

      setAttendance((prev) => ({
        ...prev,
        name: data?.name || "",
      }));

      setInvalidIdError("");
    } catch {
      setAttendance((prev) => ({
        ...prev,
        name: "",
      }));

      setInvalidIdError(
        `Invalid ${value.startsWith("MBR") ? "Member" : "Trainer"} ID Provided`,
      );
    }
  };

  const handleChange = (name, value) => {
    let v = value.toUpperCase();
    const prevValue = attendance[name] || "";
    const prevSize = prevValue.length;

    if (v.length > 7) return;

    setAttendance((prev) => ({ ...prev, name: "" }));
    setInvalidIdError("");

    if (v.endsWith("-")) v = v.slice(0, -1);

    const size = v.length;
    const first = v.slice(0, 3);
    const last = size > 3 ? v.slice(4) : "";

    const validRoots = ["MBR", "TRN"];
    const isValidPrefix = (val) =>
      validRoots.some((root) => root.startsWith(val));

    if (first && (!isAlphabetic(first) || !isValidPrefix(first))) return;
    if (last && !isNumeric(last)) return;

    if (size === 4 && prevValue.slice(-1) !== "-") {
      v = `${first}-${value.slice(-1)}`;
    }

    if (size === 3 && prevValue.slice(-1) === "-") {
      v = value.slice(0, -1);
    }

    if (size >= 3 && prevSize < size && !v.includes("-")) {
      v = `${first}-${last}`;
    }

    setAttendance((prev) => ({
      ...prev,
      [name]: v,
    }));

    if (size === 7) fetchUserWithId(v);
  };

  const handleIdValidation = () => {
    const id = attendance?.userName || "";

    if (id.length !== 7) {
      setInvalidIdError("ID must be in format MBR-001 or TRN-001");
      return false;
    }

    if (!attendance.name) {
      setInvalidIdError("Please enter a valid ID and verify name");
      return false;
    }

    setInvalidIdError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = handleIdValidation();
    if (!isValid) return;

    try {
      const role = attendance.userName.startsWith("MBR") ? "member" : "trainer";

      const response = await dispatch(
        addNewAttendance({
          newAttendance: { userId: attendance.userName, role },
        }),
      ).unwrap();

      MySwal.fire({
        icon: "success",
        text: `${role.slice(0, 1).toUpperCase() + role.slice(1)} Attendance ${response.message}.`,
        title: gymQuotes[Math.floor(Math.random() * gymQuotes.length)],
        showConfirmButton: false,
        timer: 4500,
      });

      setAttendance(initialAttendanceState);
      setInvalidIdError("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark attendance");
    }
  };

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
            onSubmit={handleSubmit}
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
            {invalidIdError && (
              <div className="text-red-500 mt-2 text-sm transition-opacity duration-200 ease-in">
                {invalidIdError}
              </div>
            )}

            <div
              className={`flex justify-between ${invalidIdError ? "mb-6 mt-2" : "my-6"} text-sm`}
            >
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
              onClick={() => navigate("/enquiry")}
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
