import Swal from "sweetalert2";
import { toast } from "sonner";
import axios from "../service/api";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
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

const gymQuotes = [
  "I only work out because I really, really like donuts.",
  "I got 99 problems, but I'm going to the gym to ignore all of them",
  "I'm sorry for what I said during burpees",
  "Life has its ups and downs. We call them squats",
  // Additional quotes...
];

const UserAttendance = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [buttonText, setButtonText] = useState("Mark Attendance");
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

  const handleChange = async (e) => {
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

        const response = await axios.post("/general/check", {
          foundUser,
        });

        if (response.status === 200) {
          setButtonText(response.data.message);
        }
      } else {
        setButtonText("Mark Attendance");
        setShowInvalidId(true);
        setName("");
      }
    } else {
      setButtonText("Mark Attendance");
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
          MySwal.fire({
            icon: "success",
            text: `${
              role.slice(0, 1).toUpperCase() + role.slice(1)
            } Attendance ${
              action === "login" ? "Punch In" : "Punch Out"
            } Successful.`,
            title: gymQuotes[Math.floor(Math.random() * gymQuotes.length)],
            showConfirmButton: false,
            timer: 4500,
          });

          setButtonText(`${action === "login" ? "Punch Out" : "Punch In"}`);
        }
      } else {
        toast.error("Please enter a valid ID.");
        setButtonText("Mark Attendance");
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
      style={{
        background: `url("images/loginBg.jpg") center no-repeat`,
        backgroundSize: "cover",
      }}
      className="flex items-center justify-center h-screen px-4"
    >
      <div
        id="V06102002T"
        className="flex flex-col gap-7 items-center w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
      >
        <img src="images/logoBlack.png" alt="Iron Paradise" width={110} />
        <Grid
          sx={{ p: 5, borderRadius: 3 }}
          className="bg-white w-full shadow-md"
          component="form"
          onSubmit={handleSubmit}
        >
          <div className="font-bold text-lg md:text-2xl pb-1">
            Attendance Portal
          </div>
          <div
            className="text-gray-500 text-sm md:text-base"
            style={{ letterSpacing: "1px" }}
          >
            Enter your ID and verify your name
          </div>
          <FormControl sx={{ mt: 4 }}>
            <FormLabel sx={{ fontSize: 14, md: 16 }}>Enter Your ID</FormLabel>
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
            <FormLabel sx={{ fontSize: 14, md: 16 }}>Full Name</FormLabel>
            <Input
              size="md"
              sx={{ py: 1 }}
              placeholder="Name"
              value={name}
              variant="solid"
              disabled
            />
          </FormControl>
          <div className="my-6 text-sm">
            Verify your ID and Name before marking Attendance.
          </div>

          <div className="mb-6">
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
                <Fragment>{buttonText}</Fragment>
              )}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-xs md:text-sm">
            <div className="text-gray-500 cursor-pointer">
              Need any help?{" "}
              <span className=" text-black">Reach out to us</span>
            </div>
            <div
              onClick={() => navigate("/enquiry")}
              className="cursor-pointer hover:scale-105 transition-all duration-300 rounded-lg text-white p-2 md:mt-0 mt-3"
              style={{
                background: "black",
              }}
            >
              <i className="fa fa-message me-2"></i> Connect with Us
            </div>
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default UserAttendance;
