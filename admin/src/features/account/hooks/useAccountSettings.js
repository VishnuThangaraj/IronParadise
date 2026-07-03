import toast from "react-hot-toast";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectCurrentUser } from "@/features/auth/redux/authSelector";
import {
  updateAdminProfile,
  updateAdminPassword,
} from "@/features/account/redux/accountThunks";
import accountRules from "@/features/account/validation/accountRules";
import {
  initialProfileState,
  initialPasswordState,
} from "@/features/account/state/initialAccountState";
import {
  validateFields,
  handleChangeValidation,
} from "@/shared/utils/FormFieldValidation";

export const getInitials = (name) => {
  if (!name) return "VT";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const useAccountSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const [profile, setProfile] = useState(() =>
    user
      ? {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        }
      : initialProfileState,
  );
  const [prevUser, setPrevUser] = useState(user);

  if (user !== prevUser) {
    setPrevUser(user);
    setProfile(
      user
        ? {
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
          }
        : initialProfileState,
    );
  }

  const [password, setPassword] = useState(initialPasswordState);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileChange = useCallback((e) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    const rules = accountRules[name];
    if (rules && !handleChangeValidation(value, rules)) return;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    const rules = accountRules[name];
    if (rules && !handleChangeValidation(value, rules)) return;
    setPassword((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleProfileSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!profile.name || !profile.email) {
        toast.warn("Name and Email are required");
        return;
      }
      setIsUpdatingProfile(true);
      try {
        await dispatch(updateAdminProfile(profile)).unwrap();
        toast.success("Profile details updated successfully!");
      } catch (error) {
        toast.error(error || "Failed to update profile details");
      } finally {
        setIsUpdatingProfile(false);
      }
    },
    [profile, dispatch],
  );

  const handlePasswordSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateFields({ ...password })) return;

      const { current, newPassword, confirm } = password;
      console.log(current, newPassword, confirm);

      if (newPassword !== confirm) {
        toast.error("New passwords do not match");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      setIsUpdatingPassword(true);

      try {
        await dispatch(
          updateAdminPassword({
            current,
            newPassword,
          }),
        ).unwrap();

        toast.success("Password changed successfully!");
        setPassword(initialPasswordState);
      } catch (error) {
        toast.error(error || "Failed to update password");
      } finally {
        setIsUpdatingPassword(false);
      }
    },
    [password, dispatch],
  );

  return {
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
  };
};

export default useAccountSettings;
