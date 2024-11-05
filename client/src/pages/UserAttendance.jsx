import Swal from "sweetalert2";
import { toast } from "sonner";
import axios from "../service/api";
import Grid from "@mui/material/Grid2";
import { Fragment, useEffect, useState } from "react";
import withReactContent from "sweetalert2-react-content";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Input,
  Button,
  FormLabel,
  FormControl,
  FormHelperText,
} from "@mui/joy";

const MySwal = withReactContent(Swal);

const UserAttendance = () => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [showInvalidId, setShowInvalidId] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get("/general");

        if (response.status === 200) {
          setAttendance(response.data.attendance);
        }
      } catch (err) {
        console.log("Error Fetching Attendance Data", err);
      }
    };
    fetchAttendanceData();
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    if (value && value.length > 5) return;

    setUserId(value.toUpperCase());

    if (value.length > 2) {
      const foundUser = attendance.find(
        (data) => data.username.toLowerCase() === value.toLowerCase()
      );

      if (foundUser) {
        setName(foundUser.name);
        setShowInvalidId(false);
      } else {
        setName("");
        setShowInvalidId(true);
      }
    } else {
      setShowInvalidId(false);
      setName("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (showInvalidId) {
        toast.error("Please enter a valid ID.");
      } else if (userId && name) {
        const user =
          attendance.find((data) => data.username === userId) || null;

        const response = await axios.post("/general/attendance", { user });
        if (response.status === 200) {
          const { action, role } = response.data.attendance;
          console.log(action, role);
          MySwal.fire({
            icon: "success",
            text: `${
              role.slice(0, 1).toUpperCase() + role.slice(1)
            } Attendance ${
              action === "login" ? "Punch In" : "Punch Out"
            } Successful.`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        toast.error("Please enter a valid ID.");
      }
    } catch (err) {
      console.log("Error Marking Attendance", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="authform"
      style={{ background: `url("images/loginBg.jpg") center no-repeat` }}
      className="flex items-center justify-center h-screen"
    >
      <div
        className="flex flex-col gap-7 items-center"
        style={{ width: "30%" }}
      >
        <img src="images/logoBlack.png" alt="Iron Paradise" width={110} />
        <Grid
          sx={{ p: 5, borderRadius: 3 }}
          className="bg-white w-full shadow-md"
          component="form"
          onSubmit={handleSubmit}
        >
          <div className="font-bold text-2xl pb-1">Attendance Portal</div>
          <div className="text-gray-500" style={{ letterSpacing: "1px" }}>
            Enter your ID and verify your name
          </div>
          <FormControl sx={{ mt: 4 }}>
            <FormLabel sx={{ fontSize: 16 }}>Enter Your ID</FormLabel>
            <Input
              onChange={handleChange}
              placeholder="MBXX"
              value={userId}
              variant="soft"
              size="md"
              sx={{ py: 1 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
            />
            {showInvalidId && (
              <FormHelperText sx={{ color: "red", mt: 1 }}>
                Invalid Member/Trainer ID Provided
              </FormHelperText>
            )}
          </FormControl>
          <FormControl sx={{ mt: 2 }}>
            <FormLabel sx={{ fontSize: 16 }}>Full Name</FormLabel>
            <Input
              size="md"
              sx={{ py: 1 }}
              placeholder=""
              value={name}
              variant="solid"
              disabled
            />
          </FormControl>
          <div className="flex justify-between my-6">
            <div className="text-gray-500 cursor-pointer">
              Forgot your ID? Contact Admin{" "}
              <span className="cursor-pointer underline text-black">
                Click here
              </span>
            </div>
          </div>
          <Button
            type="submit"
            size="md"
            className="transition-all duration-300"
            variant="solid"
            sx={{
              backgroundColor: "black",
              "&:hover": {
                backgroundColor: "#222222",
              },
            }}
            fullWidth
          >
            {loading ? (
              <Fragment>
                <CircularProgress
                  size={20}
                  sx={{
                    color: "white",
                  }}
                />{" "}
                <span className="ms-5 text-base">Validating ...</span>
              </Fragment>
            ) : (
              "Mark Attendance"
            )}
          </Button>
        </Grid>
      </div>
    </div>
  );
};

export default UserAttendance;
