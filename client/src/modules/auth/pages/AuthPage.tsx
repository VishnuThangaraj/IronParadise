import { useState } from "react";
import { FiSun, FiMoon, FiUsers, FiMessageSquare } from "react-icons/fi";

import { loginBg } from "@/modules/auth/assets";
import logoDark from "@/shared/assets/images/logo-dark.webp";
import logoWhite from "@/shared/assets/images/logo-white.webp";

import { useTheme } from "@/shared/hooks/useTheme";
import { useNavigation } from "@/shared/hooks/useNavigation";

import { Checkbox } from "@mui/material";
import Input from "@/shared/components/ui/forms/Input";
import FormField from "@/shared/components/ui/forms/FormField";
import useLogin from "@/modules/auth/hooks/use-login";

import Button from "@/shared/components/ui/buttons/Button";
import HeaderButton from "@/shared/components/ui/buttons/HeaderButton";
import Container from "@/shared/components/ui/containers/Container";
import { developerGithubURL } from "@/config/appConfig";
import authFields, { type AuthField } from "../constants/auth.fields";

const AuthPage = () => {
  const [rememberPassword, setRememberPassword] = useState(false);
  const { login, handleChange, handleSubmit } = useLogin();
  const { isDark, toggleTheme } = useTheme();
  const { navigate, openInNewTab } = useNavigation();

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
      <div className="flex flex-col absolute top-6 left-6 z-20 gap-2">
        <HeaderButton
          variant="secondary"
          onClick={toggleTheme}
          ariaLabel="Toggle Theme"
          iconClassName="text-indigo-600 dark:text-amber-400"
          icon={isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
          text={isDark ? "LIGHT MODE" : "DARK MODE"}
        />
      </div>
      {/* Mode Switch */}
      <div className="flex flex-col absolute top-6 right-6 z-20 gap-2">
        <HeaderButton
          variant="blue"
          ariaLabel="Kiosk Mode"
          icon={<FiUsers />}
          onClick={() => navigate("/attendance-kiosk")}
          text="KIOSK MODE"
        />
        <HeaderButton
          variant="green"
          ariaLabel="Contact Us"
          icon={<FiMessageSquare />}
          onClick={() => navigate("/contact-us")}
          text="CONTACT US"
        />
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
              className="h-12 w-auto block dark:hidden object-contain select-none"
            />
            <img
              src={logoWhite}
              alt="IronParadise Logo"
              draggable={false}
              className="h-12 w-auto hidden dark:block object-contain select-none"
            />
          </div>

          {/* Auth Fields */}
          <Container className="flex-col align-middle items-center gap-2 py-10 px-8 sm:p-4">
            <div className="text-2xl font-bold text-gray-700 dark:text-white">
              Sign in to account
            </div>
            <div className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-400">
              Enter your user id & password to login
            </div>

            {/* Sign in Field */}
            <form onSubmit={handleSubmit} className="w-full sm:w-90">
              <div className="grid w-full grid-cols-1 sm:grid-cols-12 gap-0 md:gap-5 pt-5">
                {authFields.map((field: AuthField, index: number) => {
                  return (
                    <FormField key={`auth-field-${index}`} size={field.size}>
                      <Input
                        label={field.label}
                        name={field.name}
                        type={field.type}
                        value={login[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        size={field.size}
                        labelClassName="font-semibold"
                      />
                    </FormField>
                  );
                })}
              </div>
              <div className="flex justify-between w-full text-sm gap-3 md:gap-1 px-1 pt-3 pb-5 md:py-7 select-none">
                <label className="items-center cursor-pointer group">
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
                    Remember me
                  </span>
                </label>
                <div className="cursor-pointer pe-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-center">
                  Forgot Password ?
                </div>
              </div>
              <div className="w-full mt-0.5 mb-1.5">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full font-semibold text-sm"
                >
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
