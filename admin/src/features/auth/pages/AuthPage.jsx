import { Paper, Checkbox } from "@mui/material";

import FormField from "@/shared/components/form/FormField";
import ButtonPrimary from "@/shared/components/form/ButtonPrimary";

import authFields from "@/features/auth/constants/authFields";
import useLoginForm from "@/features/auth/hooks/useLoginForm";

import styles from "@/features/auth/style/authForm.module.scss";

const AuthPage = () => {
  const { login, handleChange, handleSubmit } = useLoginForm();

  return (
    <div
      className={`${styles["auth-main"]} flex flex-col items-center justify-center h-screen w-full gap-5`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center">
        <img src="images/logo_black.webp" alt="Iron Paradise" width={100} />
      </div>

      <Paper
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
            <div className="text-gray-500">Forgot Password?</div>
          </div>

          <div className="w-full">
            <ButtonPrimary className={"w-full"} onClick={handleSubmit}>
              <span className="text-md font-semibold">Login</span>{" "}
            </ButtonPrimary>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default AuthPage;
