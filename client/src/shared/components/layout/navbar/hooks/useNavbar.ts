import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { getInitials } from "@/shared/hooks/getInitials";
import type { User } from "@/modules/auth/types/user.types";
import { selectUser } from "@/modules/auth/redux/auth.selector";

const useNavbar = () => {
  const user: User | null = useSelector(selectUser);
  const userInitials: string = getInitials((user?.fullName as string) ?? "");

  // Profile
  const profileRef = useRef<HTMLDivElement>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Search Modal
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [focusedSearchIndex, setFocusedSearchIndex] = useState(0);

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

  // Click outside listener for profile dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    user,
    profileRef,
    searchQuery,
    userInitials,
    isSearchOpen,
    isProfileOpen,
    searchInputRef,
    setSearchQuery,
    setIsSearchOpen,
    setIsProfileOpen,
    isLogoutModalOpen,
    focusedSearchIndex,
    setIsLogoutModalOpen,
    setFocusedSearchIndex,
    handleOpenLogoutModal,
  };
};

export default useNavbar;
