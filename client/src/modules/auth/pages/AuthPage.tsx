import { useState } from "react";
import { loginBg } from "@/modules/auth/assets";
import { ThemeToggle } from "@/shared/components/buttons/ThemeToggle";

import logoDark from "@/shared/assets/images/logo-dark.webp";
import logoWhite from "@/shared/assets/images/logo-white.webp";
import { openInNewTab } from "@/shared/hooks/useNavigation";

import { Checkbox } from "@mui/material";

import Button from "@/shared/components/buttons/Button";
import Container from "@/shared/components/containers/Container";
import { developerGithubURL } from "@/config/appConfig";
import authFields, { type AuthField } from "../constants/authFields";

const AuthPage = () => {
  const [rememberPassword, setRememberPassword] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      {/* Light Mode Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-300/70 via-slate-400/50 to-indigo-300/60 pointer-events-none transition-opacity duration-500 opacity-100 dark:opacity-0" />
      {/* Dark Mode Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/90 via-slate-950/85 to-indigo-950/90 pointer-events-none transition-opacity duration-500 opacity-0 dark:opacity-100" />
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="flex flex-col justify-between gap-10">
          {/* Logo */}
          <div
            onClick={() => openInNewTab(developerGithubURL)}
            className="flex items-center justify-center hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
          >
            <img
              src={logoDark}
              alt="IronParadise Logo"
              draggable={false}
              className="h-13 w-auto block dark:hidden object-contain select-none"
            />
            <img
              src={logoWhite}
              alt="IronParadise Logo"
              draggable={false}
              className="h-13 w-auto hidden dark:block object-contain select-none"
            />
          </div>

          {/* Auth Fields */}
          <Container className="flex-col align-middle items-center gap-2">
            <div className="text-2xl font-bold text-gray-700 dark:text-white">
              Sign in to account
            </div>
            <div className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-400">
              Enter your email & password to login
            </div>

            {/* Sign in Field */}
            <form onSubmit={() => {}}>
              {authFields.map((field: AuthField, index: number) => {
                return (
                  <div key={index}>
                    <div>{field.label}</div>
                    <div>{field.placeholder}</div>
                  </div>
                );
              })}
              <div className="flex w-full justify-between text-sm mt-2 gap-10 py-4 px-3 select-none">
                <label className="flex justify-center items-center cursor-pointer group">
                  <Checkbox
                    checked={rememberPassword}
                    onChange={(e) => setRememberPassword(e.target.checked)}
                    size="small"
                    sx={{
                      p: 0,
                      color: "rgba(100, 116, 139, 0.7)",
                      ".dark &": {
                        color: "rgba(255, 255, 255, 0.3)",
                      },
                      "&.Mui-checked": {
                        color: "#6366f1 !important",
                      },
                    }}
                  />
                  <span className="ms-2 text-slate-600 group-hover:text-slate-800 dark:text-gray-300 dark:group-hover:text-white transition-colors">
                    Remember Password
                  </span>
                </label>
                <div className="cursor-pointer text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                  Forgot Password ?
                </div>
              </div>
              <div className="w-full">
                <Button variant="primary" className="font-semibold text-sm">
                  Sign in
                </Button>
              </div>
            </form>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
