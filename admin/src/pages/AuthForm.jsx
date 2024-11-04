import { toast } from "sonner";
import Grid from "@mui/material/Grid2";
import { Fragment, useContext, useState } from "react";
import { Input, Button, Checkbox, FormControl, FormLabel } from "@mui/joy";

import CircularProgress from "@mui/material/CircularProgress";

import { AuthContext } from "../context/AuthContext";

const AuthForm = () => {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate and Login
  const validateAndLogin = async () => {
    if (email === "" || password === "")
      return toast.info("All fields are required!");
    setLoading(true);
    await login(email, password);
    setLoading(false);
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
        >
          <div className="font-bold text-2xl pb-1">Sign in to account</div>
          <div className="text-gray-500" style={{ letterSpacing: "1px" }}>
            Enter your email & password to login
          </div>
          <FormControl sx={{ mt: 4 }}>
            <FormLabel sx={{ fontSize: 16 }}>Email Address</FormLabel>
            <Input
              size="md"
              sx={{ py: 1 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              variant="soft"
            />
          </FormControl>
          <FormControl sx={{ mt: 2 }}>
            <FormLabel sx={{ fontSize: 16 }}>Password</FormLabel>
            <Input
              size="md"
              sx={{ py: 1 }}
              slotProps={{
                input: { placeholder: "•••••••••••", type: "password" },
              }}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              variant="soft"
            />
          </FormControl>
          <div className="flex justify-between my-6">
            <div className="text-gray-500">
              <Checkbox label="Remember Password" />
            </div>
            <div className="text-gray-500 cursor-pointer">
              Forgot Password ?
            </div>
          </div>
          <Button
            size="md"
            className="transition-all duration-300"
            variant="solid"
            sx={{
              backgroundColor: "black",
              "&:hover": {
                backgroundColor: "#222222",
              },
            }}
            onClick={validateAndLogin}
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
                <span className="ms-5 text-base">Authenticating ...</span>
              </Fragment>
            ) : (
              "Sign in"
            )}
          </Button>
        </Grid>
      </div>
    </div>
  );
};

export default AuthForm;
