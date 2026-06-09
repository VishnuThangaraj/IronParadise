import PropTypes from "prop-types";
import { motion, AnimatePresence } from "motion/react";
import { LuChevronDown, LuSettings, LuLogOut } from "react-icons/lu";

const ProfileDropdown = ({
  isProfileOpen,
  setIsProfileOpen,
  profileRef,
  navigate,
  handleLogout,
  user,
}) => {
  const adminInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all duration-200"
      >
        <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[11px] font-extrabold shadow-sm">
          {adminInitials}
        </div>
        <div className="hidden md:flex flex-col text-left pr-1">
          <span className="text-[12.5px] font-bold text-slate-800 leading-none">
            {user.name}
          </span>
          <span className="text-[10px] font-bold text-indigo-500 mt-1 uppercase tracking-wider leading-none">
            {user.role}
          </span>
        </div>
        <LuChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-250 ${
            isProfileOpen ? "rotate-180 text-slate-600" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl p-3 z-40 origin-top-right"
          >
            <div className="flex items-center gap-3 p-2 bg-slate-50/50 rounded-xl mb-2">
              <div className="w-10 h-10 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-extrabold text-sm">
                {adminInitials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-800 truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-500 truncate mt-0.5">
                  {user.email}
                </span>
              </div>
            </div>

            <div className="space-y-0.5">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/account/settings");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/40 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <LuSettings className="w-4 h-4 text-slate-400" />
                <span>Account Settings</span>
              </button>

              <div className="h-px bg-slate-100 my-2" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <LuLogOut className="w-4 h-4 text-rose-600" />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

ProfileDropdown.propTypes = {
  isProfileOpen: PropTypes.bool.isRequired,
  setIsProfileOpen: PropTypes.func.isRequired,
  profileRef: PropTypes.shape({ current: PropTypes.any }),
  adminName: PropTypes.string.isRequired,
  adminEmail: PropTypes.string.isRequired,
  adminInitials: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default ProfileDropdown;
