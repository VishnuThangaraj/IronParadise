import { FiArrowLeft, FiMoon, FiSun } from "react-icons/fi";

import { loginBg } from "@/modules/auth/assets";
import logoDark from "@/shared/assets/images/logo-dark.webp";
import logoWhite from "@/shared/assets/images/logo-white.webp";

import { useTheme } from "@/shared/hooks/useTheme";
import { useNavigation } from "@/shared/hooks/useNavigation";

import { developerGithubURL } from "@/config/appConfig";
import HeaderButton from "@/shared/components/ui/buttons/HeaderButton";

const AttendanceEntry = () => {
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
      {/* Navigation Switch */}
      <div className="flex flex-col absolute top-6 right-6 z-20 gap-2">
        <HeaderButton
          variant="blue"
          ariaLabel="back to login"
          icon={<FiArrowLeft />}
          onClick={() => navigate("/authenticate")}
          text="Back to Login"
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
        </div>
      </div>
    </div>
  );
};

export default AttendanceEntry;
