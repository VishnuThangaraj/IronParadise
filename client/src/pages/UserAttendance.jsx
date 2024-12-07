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

const gymQuotes = [
  "I only work out because I really, really like donuts.",
  "I got 99 problems, but I'm going to the gym to ignore all of them",
  "I'm sorry for what I said during burpees",
  "Life has its ups and downs. We call them squats",
  "Unless you puke, faint, or die, keep going! — Jillian Michaels",
  "You make my knees weak. Just kidding. Yesterday was leg day.",
  "My favorite machine at the gym is the television.",
  "It's my workout. I can cry if I want to.",
  "Hustle for that muscle.",
  "Eat clean, stay fit, and have a burger to stay sane.—Gigi Hadid",
  "Weights before dates.",
  "I like big weights and I cannot lie.",
  "I don't sweat, I sparkle.",
  "Sweat is your fat crying.",
  "Fitness: If it came in a bottle, everyone would have a great body.—Cher ",
  "I don't want to look skinny. I want to look like I could kick your butt.",
  "Friday night. Party at the gym with my friends dumbbell and barbell.",
  "Life is short. Lift heavy things.",
  "If you still look cute after working out, you didn't go hard enough.",
  "The only BS I need in my life is breakfast and squats.",
];

const UserAttendance = () => {
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
      // Check for valid user
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
            title: gymQuotes[Math.floor(Math.random() * gymQuotes.length - 1)],
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
              <Fragment>{buttonText}</Fragment>
            )}
          </Button>
        </Grid>
      </div>
    </div>
  );
};

export default UserAttendance;
