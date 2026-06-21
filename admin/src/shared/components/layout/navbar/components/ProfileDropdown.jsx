import { useState } from "react";
import PropTypes from "prop-types";

import { motion, AnimatePresence } from "motion/react";
import { LuChevronDown, LuSettings, LuLogOut } from "react-icons/lu";

import LogoutConfirmationModal from "@/shared/components/ui/modal/LogoutConfirmationModal";

const ProfileDropdown = ({
  isProfileOpen,
  setIsProfileOpen,
  profileRef,
  navigate,
  handleLogout,
  user,
}) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const adminInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-2 hover:bg-slate-50 p-1.5 border border-slate-200 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <div className="flex justify-center items-center bg-gradient-primary-color shadow-sm rounded-lg w-8 h-8 font-extrabold text-[11px] text-white">
            {adminInitials}
          </div>
          <div className="hidden md:flex flex-col pr-1 text-left">
            <span className="font-bold text-[12.5px] text-slate-800 leading-none">
              {user.name}
            </span>
            <span className="mt-1 font-bold text-[10px] text-indigo-500 uppercase leading-none tracking-wider">
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
              className="right-0 z-40 absolute bg-white shadow-2xl mt-3 p-3 border border-slate-100 rounded-2xl w-64 origin-top-right"
            >
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/account/settings");
                  }}
                  className="flex items-center gap-2.5 hover:bg-indigo-50/40 px-3 py-2 rounded-xl w-full font-semibold text-slate-600 hover:text-indigo-600 text-xs transition-all duration-200 cursor-pointer"
                >
                  <LuSettings className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </button>

                <div className="bg-slate-100 my-2 h-px" />

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="flex items-center gap-2.5 hover:bg-rose-50 px-3 py-2 rounded-xl w-full font-bold text-rose-600 text-xs transition-all duration-200 cursor-pointer"
                >
                  <LuLogOut className="w-4 h-4 text-rose-600" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LogoutConfirmationModal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          handleLogout();
        }}
      />
    </>
  );
};

ProfileDropdown.propTypes = {
  isProfileOpen: PropTypes.bool.isRequired,
  setIsProfileOpen: PropTypes.func.isRequired,
  profileRef: PropTypes.shape({ current: PropTypes.any }),
  adminName: PropTypes.string,
  adminEmail: PropTypes.string,
  adminInitials: PropTypes.string,
  navigate: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default ProfileDropdown;
