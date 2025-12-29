import { toast } from "sonner";
import Cookies from "js-cookie";
import Grid from "@mui/joy/Grid";
import { useState } from "react";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import { useDispatch, useSelector } from "react-redux";

import {
  selectAuthLoading,
  selectAuthError,
} from "../../redux/auth/authSelectors";
import "./AuthForm.module.scss";
import { login } from "../../redux/auth/authThunks";
import ContactAdminAlert from "../../components/Alerts/ContactAdminAlert";

const COOKIE_KEY = "login_attempts";
const maxIncorrectAttempt = 10;

const AuthForm = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const loading = useSelector(selectAuthLoading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectTry, setIncorrectTry] = useState(
    Number(Cookies.get(COOKIE_KEY)) || 0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warning("Please enter email and password");
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      Cookies.remove(COOKIE_KEY);
      setIncorrectTry(0);
      toast.success("Login successful");
    } catch {
      setIncorrectTry((prev) => {
        const next = prev + 1;
        Cookies.set(COOKIE_KEY, next);
        return next;
      });
      toast.error("Invalid email or password");
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div
      id="login_container"
      style={{
        background:
          'url("images/login_background.webp") center / cover no-repeat',
        width: "100vw",
      }}
      className="flex items-center justify-center h-screen "
    >
      <div className="flex flex-col gap-5 items-center">
        <img src="images/logo_black.webp" alt="Iron Paradise" width={100} />
        <Grid
          sx={{ p: 4, borderRadius: 9 }}
          className="bg-white w-110 shadow-md"
        >
          <div className="loginform_header">
            <div className="font-bold text-xl">Sign in to account</div>
            <div
              className="text-sm text-gray-500"
              style={{ letterSpacing: "1px" }}
            >
              Enter your email & password to login
            </div>
          </div>
          <form
            className="flex flex-col justify-between"
            onSubmit={handleSubmit}
          >
            <FormControl sx={{ mt: 4 }}>
              <FormLabel className="font-semibold">Email Address</FormLabel>
              <Input
                size="sm"
                sx={{ py: 1 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                disabled={loading || incorrectTry > maxIncorrectAttempt}
                variant="soft"
              />
            </FormControl>
            <FormControl sx={{ mt: 3 }}>
              <FormLabel className="font-semibold">Password</FormLabel>
              <Input
                size="md"
                sx={{ py: 1 }}
                slotProps={{
                  input: { placeholder: "•••••••••••", type: "password" },
                }}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={loading || incorrectTry > maxIncorrectAttempt}
                variant="soft"
              />
            </FormControl>
            <div className="flex justify-between my-7 text-sm">
              <div className="text-gray-500">
                <Checkbox size="sm" label="Remember Password" />
              </div>
              <div className="text-gray-500 cursor-pointer">
                Forgot Password ?
              </div>
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
              disabled={loading || incorrectTry > maxIncorrectAttempt}
              fullWidth
            >
              {incorrectTry > maxIncorrectAttempt
                ? "Contact Admin"
                : loading
                ? "Logging in..."
                : "Login"}
            </Button>

            {error && (
              <p className="text-red-500 text-sm mt-5 text-right italic transition-all duration-300">
                Invalid credentials (attempt {incorrectTry}).{" "}
                <span className="underline cursor-pointer">Contact Admin</span>
              </p>
            )}
          </form>
        </Grid>
      </div>
      <ContactAdminAlert
        open={incorrectTry > maxIncorrectAttempt}
        onClose={incorrectTry <= maxIncorrectAttempt}
        attempts={incorrectTry}
        email="support@yourcompany.com"
      />
    </div>
  );
};

export default AuthForm;
