import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { motion } from "motion/react";
import { Paper, Checkbox } from "@mui/material";

import { fadeUp, fadeIn } from "@/shared/animations";

import { LuUsers, LuMessageSquare } from "react-icons/lu";
import FormField from "@/shared/components/ui/form/Input/FormField";
import ButtonPrimary from "@/shared/components/ui/form/button/ButtonPrimary";

import authFields from "@/features/auth/constants/authFields";
import useLoginForm from "@/features/auth/hooks/useLoginForm";
import { authFormField } from "@/features/auth/styles/authStyles";
import { authPageAnimation } from "@/features/auth/animation/authPage";
import { selectAuthLoading } from "@/features/auth/redux/authSelector";
import LoginAttemptLimitModal from "@/features/auth/components/LoginAttemptLimitModal";

import styles from "@/features/auth/styles/authForm.module.scss";

const MotionPaper = motion.create(Paper);

const AuthPage = () => {
  const loading = useSelector(selectAuthLoading);
  const {
    login,
    incorrectTry,
    handleChange,
    handleSubmit,
    contactAdmin,
    maxIncorrectAttempt,
  } = useLoginForm();

  return (
    <motion.div
      {...fadeIn}
      className={`${styles["auth-main"]} relative flex flex-col items-center justify-center h-screen w-full gap-5 overflow-hidden bg-slate-950`}
    >
      {/* Dark overlay & blur blobs */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/90 via-slate-950/85 to-indigo-950/90 pointer-events-none" />

      {/* Top right floating buttons */}
      <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-3">
        {/* Kiosk Mode Link */}
        <Link
          to="/attendance-log"
          className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors bg-indigo-900/30 hover:bg-indigo-900/50 px-4 py-2 rounded-full border border-indigo-500/30 backdrop-blur-md shadow-lg shadow-indigo-900/20"
        >
          <LuUsers className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Kiosk Mode
          </span>
        </Link>

        {/* Enquiry Link */}
        <Link
          to="/enquiry"
          className="flex items-center gap-2 text-emerald-300 hover:text-white transition-colors bg-emerald-900/30 hover:bg-emerald-900/50 px-4 py-2 rounded-full border border-emerald-500/30 backdrop-blur-md shadow-lg shadow-emerald-900/20"
        >
          <LuMessageSquare className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Contact Us
          </span>
        </Link>
      </div>

      {/* Logo */}
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="flex items-center justify-center relative z-10"
      >
        <img
          src="/images/logo_white.webp"
          alt="Iron Paradise"
          className="w-24 h-24 object-contain hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(99,102,241,0.25)]"
        />
      </motion.div>

      <MotionPaper
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.2 }}
        sx={authPageAnimation}
        className="w-[90%] max-w-md sm:w-110 relative z-10"
        elevation={0}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-indigo-200">
            Sign in to account
          </div>
          <div className="text-sm text-slate-400 font-medium mt-1.5 tracking-wide">
            Enter your email & password to login
          </div>
        </div>

        {/* Signin Field */}
        <form onSubmit={handleSubmit}>
          <div className={"mt-7 flex flex-col gap-4"}>
            {authFields.map((field) => {
              return (
                <div
                  key={field.name}
                  className={"flex flex-col items-start justify-center gap-2"}
                >
                  <div className={"text-sm font-semibold text-slate-300"}>
                    {field.label}
                  </div>
                  <FormField
                    field={field}
                    label={false}
                    formSize={"small"}
                    value={login[field.name] ?? ""}
                    onChange={handleChange}
                    fieldStyle={authFormField}
                  />
                </div>
              );
            })}
            <div className="flex items-center text-sm justify-between mt-2">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Checkbox
                  size="small"
                  sx={{
                    color: "rgba(255, 255, 255, 0.3)",
                    p: 0.5,
                    "&.Mui-checked": {
                      color: "#6366f1",
                    },
                  }}
                />
                <span className="cursor-pointer select-none">
                  Remember Password
                </span>
              </div>
              <div className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer transition-colors">
                Forgot Password?
              </div>
            </div>

            <div className="w-full mt-2">
              <ButtonPrimary
                className={"w-full"}
                loading={loading}
                loadingText={"Signing in..."}
              >
                <span className="text-md font-bold tracking-wide">
                  Sign in
                </span>{" "}
              </ButtonPrimary>
            </div>

            {/* Incorrect Password Count */}
            {incorrectTry > 0 && (
              <div className="flex flex-col items-center justify-between gap-1.5 p-3 rounded-xl bg-red-950/30 border border-red-900/30 mt-2 text-center">
                <div className="text-red-400 text-xs font-medium">
                  Invalid credentials (attempt {incorrectTry} of{" "}
                  {maxIncorrectAttempt}).
                </div>
                <div
                  className="text-xs text-red-300 font-semibold cursor-pointer hover:underline transition-all"
                  onClick={contactAdmin}
                >
                  Need help? Contact Admin
                </div>
              </div>
            )}
          </div>
        </form>
        <LoginAttemptLimitModal
          open={incorrectTry >= maxIncorrectAttempt}
          maxIncorrectAttempt={maxIncorrectAttempt}
          contactAdmin={contactAdmin}
        />
      </MotionPaper>
    </motion.div>
  );
};

export default AuthPage;
