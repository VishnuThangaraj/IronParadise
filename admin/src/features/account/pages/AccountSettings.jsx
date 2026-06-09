import { motion } from "motion/react";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuLock,
  LuShield,
  LuCheck,
  LuRefreshCw,
} from "react-icons/lu";
import useAccountSettings from "../hooks/useAccountSettings";

const AccountSettings = () => {
  const {
    profile,
    password,
    isUpdatingProfile,
    isUpdatingPassword,
    handleProfileChange,
    handlePasswordChange,
    handleProfileSubmit,
    handlePasswordSubmit,
    getInitials,
    user,
  } = useAccountSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-montserrat">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
          Account Settings
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Manage your administrative profile and password credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col items-center text-center h-fit sticky top-24"
        >
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-linear-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-md shadow-indigo-200">
              {getInitials(user?.name)}
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-green-500 border-2 border-white flex items-center justify-center"
              title="Admin Active"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-800 mt-4 leading-snug">
            {user?.name || "Admin"}
          </h3>
          <span className="text-[10px] font-bold text-indigo-500 mt-1 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
            {user?.role || "System Admin"}
          </span>

          <div className="w-full space-y-2.5 mt-6 text-left text-xs text-slate-600">
            <div className="flex items-center gap-2.5 hover:text-indigo-600 transition-colors duration-200">
              <LuMail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{user?.email || "No email provided"}</span>
            </div>
            <div className="flex items-center gap-2.5 hover:text-indigo-600 transition-colors duration-200">
              <LuPhone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{user?.phone || "No phone number"}</span>
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-6" />

          <div className="w-full space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Account Status</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md ${
                  user?.status === "Active" || !user?.status
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {user?.status || "Active"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Last Session</span>
              <span className="font-bold text-slate-700">
                {user?.lastSession
                  ? new Date(user.lastSession).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "Currently Active"}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="md:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-2 mb-6">
              <LuUser className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Profile Details
              </h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    placeholder="Enter name"
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="Enter email"
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter phone number"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all duration-250 cursor-pointer"
                >
                  {isUpdatingProfile ? (
                    <>
                      <LuRefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <LuCheck className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-2 mb-6">
              <LuLock className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Change Password
              </h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  name="current"
                  value={password.current}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new"
                    value={password.new}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm"
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="flex items-center gap-2 px-5 py-2 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all duration-250 cursor-pointer"
                >
                  {isUpdatingPassword ? (
                    <>
                      <LuRefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <LuShield className="w-3.5 h-3.5" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
