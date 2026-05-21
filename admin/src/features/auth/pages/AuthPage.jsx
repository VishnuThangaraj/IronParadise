import { useSelector } from "react-redux";

import { motion } from "motion/react";
import { Paper, Checkbox } from "@mui/material";

import { fadeUp, fadeIn } from "@/shared/animations";
import FormField from "@/shared/components/form/FormField";
import ButtonPrimary from "@/shared/components/form/ButtonPrimary";

import authFields from "@/features/auth/constants/authFields";
import useLoginForm from "@/features/auth/hooks/useLoginForm";
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
      className={`${styles["auth-main"]} flex flex-col items-center justify-center h-screen w-full gap-5`}
    >
      {/* Logo */}
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="flex items-center justify-center"
      >
        <img src="images/logo_black.webp" alt="Iron Paradise" width={100} />
      </motion.div>

      <MotionPaper
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.2 }}
        sx={{
          py: { xs: 4, sm: 5 },
          px: { xs: 3, sm: 4 },
          borderRadius: 3,
        }}
        className="w-[90%] max-w-md sm:w-110"
        elevation={3}
      >
        <div className="flex flex-col items-start">
          <div className="text-xl font-bold">Sign in to account</div>
          <div className="text-sm text-gray-500 tracking-wide">
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
                  <div className={"text-sm font-medium"}>{field.label}</div>
                  <FormField
                    field={field}
                    label={false}
                    formSize={"small"}
                    value={login[field.name] ?? ""}
                    onChange={handleChange}
                  />
                </div>
              );
            })}
            <div className="flex items-center text-sm justify-between">
              <div className="flex items-center gap-1">
                <Checkbox
                  size="small"
                  sx={{
                    color: "grey.400",
                    "&.Mui-checked": {
                      color: "black",
                    },
                  }}
                />
                Remember Password
              </div>
              <div className="text-gray-500 cursor-pointer">
                Forgot Password?
              </div>
            </div>

            <div className="w-full">
              <ButtonPrimary
                className={"w-full"}
                loading={loading}
                loadingText={"Signing in..."}
              >
                <span className="text-md font-semibold">Sign in</span>{" "}
              </ButtonPrimary>
            </div>

            {/* Incorrect Password Count */}
            {incorrectTry > 0 && (
              <div className="flex justify-end text-red-500 italic text-sm items-end mt-1">
                Invalid credentials (attempt {incorrectTry}).{" "}
                <span
                  className="underline cursor-pointer"
                  onClick={contactAdmin}
                >
                  Contact Admin
                </span>
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
