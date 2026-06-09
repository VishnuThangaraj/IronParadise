import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { selectCurrentUser } from "@/features/auth/redux/authSelector";
import {
  updateAdminProfile,
  updateAdminPassword,
} from "../redux/accountThunks";
import accountRules from "../validation/accountRules";
import {
  initialPasswordState,
  initialProfileState,
} from "../state/initialAccountState";
import { handleChangeValidation } from "@/shared/utils/FormFieldValidation";

const useAccountSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const [profile, setProfile] = useState(() => {
    if (user) {
      return {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      };
    }
    return initialProfileState;
  });
  const [prevUser, setPrevUser] = useState(user);

  if (user !== prevUser) {
    setPrevUser(user);
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    } else {
      setProfile(initialProfileState);
    }
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
        toast.error("Name and Email are required");
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
      if (!password.current || !password.new || !password.confirm) {
        toast.error("Please fill in all password fields");
        return;
      }
      if (password.new !== password.confirm) {
        toast.error("New passwords do not match");
        return;
      }
      if (password.new.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      setIsUpdatingPassword(true);
      try {
        await dispatch(
          updateAdminPassword({
            current: password.current,
            new: password.new,
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

  const getInitials = useCallback((name) => {
    if (!name) return "VT";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }, []);

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
