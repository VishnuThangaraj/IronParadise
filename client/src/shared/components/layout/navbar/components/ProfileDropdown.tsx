import { LuChevronDown, LuSettings, LuLogOut } from "react-icons/lu";
import { AnimatePresence, motion } from "motion/react";
import type { User } from "@/modules/auth/types/user.types";
import type { Dispatch, SetStateAction } from "react";

export interface ProfileDropdownProps {
  user: User | null;
  userInitials: string;
  isProfileOpen: boolean;
  setIsProfileOpen: Dispatch<SetStateAction<boolean>>;
  handleOpenLogoutModal: () => void;
}

const ProfileDropdown = ({
  user,
  userInitials,
  isProfileOpen,
  setIsProfileOpen,
  handleOpenLogoutModal,
}: ProfileDropdownProps) => {
  return (
    <div className="relative">
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-all duration-200 text-slate-800 dark:text-slate-100 shadow-xs"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-xs bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white text-[11px] font-extrabold overflow-hidden">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user?.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{userInitials}</span>
          )}
        </div>
        <div className="hidden md:flex flex-col text-left pr-1">
          <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-100 leading-none">
            {user?.fullName}
          </span>
          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider leading-none">
            {user?.role}
          </span>
        </div>
        <LuChevronDown
          className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-250 ${
            isProfileOpen ? "rotate-180 text-slate-700 dark:text-slate-200" : ""
          }`}
        />
      </button>

      {/* Profile Options */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-2xl p-2 z-40 origin-top-right text-slate-800 dark:text-slate-100"
          >
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  // navigate("/account/settings");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 rounded-xl transition-all duration-200 cursor-pointer group"
              >
                <LuSettings className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                <span>Account Settings</span>
              </button>

              <div className="h-px bg-slate-100 dark:bg-slate-800/80 my-1" />

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  handleOpenLogoutModal();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-all duration-200 cursor-pointer group"
              >
                <LuLogOut className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
