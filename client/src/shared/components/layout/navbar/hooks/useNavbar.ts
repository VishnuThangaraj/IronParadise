import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getInitials } from "@/shared/hooks/getInitials";
import type { User } from "@/modules/auth/types/user.types";
import { selectUser } from "@/modules/auth/redux/authSelector";

const useNavbar = () => {
  const user: User | null = useSelector(selectUser);
  const userInitials: string = getInitials((user?.fullName as string) ?? "");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Keyboard shortcut for search (Ctrl + K / Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  return {
    user,
    userInitials,
    isSearchOpen,
    isProfileOpen,
    setIsSearchOpen,
    setIsProfileOpen,
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    handleOpenLogoutModal,
  };
};

export default useNavbar;
