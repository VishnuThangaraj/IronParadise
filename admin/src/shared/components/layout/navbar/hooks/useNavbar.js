import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { logout } from "@/features/auth/redux/authSlice";
import { selectCurrentUser } from "@/features/auth/redux/authSelector";
import { AdminSidebarItems } from "@/shared/components/layout/sidebar/constants/sidebarFields";

// Function to generate initials
const getInitials = (name) => {
  if (!name) return "VT";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

// Function to get active breadcrumbs
const getBreadcrumbs = (pathname) => {
  if (pathname === "/" || pathname === "/home") {
    return [{ name: "Dashboard", path: "/" }];
  }

  const paths = [];
  let found = false;

  for (const section of AdminSidebarItems) {
    for (const item of section.items) {
      if (item.location === pathname) {
        paths.push({ name: item.name, path: item.location });
        found = true;
        break;
      }
      if (item.children) {
        const childMatch = item.children.find(
          (child) => child.location === pathname,
        );
        if (childMatch) {
          paths.push({ name: item.name, path: item.location });
          paths.push({ name: childMatch.name, path: childMatch.location });
          found = true;
          break;
        }
      }
    }
    if (found) break;
  }

  if (paths.length === 0) {
    const segments = pathname.split("/").filter(Boolean);
    segments.forEach((seg, index) => {
      const path = "/" + segments.slice(0, index + 1).join("/");
      const name =
        seg.charAt(0).toUpperCase() +
        seg
          .slice(1)
          .replace(/-/g, " ")
          .replace(/view|list|add/g, (m) => ` ${m}`);
      paths.push({ name, path });
    });
  }

  return paths;
};

export const useNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  // States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [focusedSearchIndex, setFocusedSearchIndex] = useState(0);

  // Refs
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  // Keyboard shortcut for search (Ctrl + K / Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus search input when search modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    } else {
      setSearchQuery("");
      setFocusedSearchIndex(0);
    }
  }, [isSearchOpen]);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Dynamic search list derived from Sidebar items configuration
  const searchItems = [];
  AdminSidebarItems.forEach((section) => {
    section.items.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          searchItems.push({
            name: child.name,
            category: item.name,
            path: child.location,
            desc: `Navigate to ${item.name} > ${child.name}`,
          });
        });
      } else {
        searchItems.push({
          name: item.name,
          category: section.section,
          path: item.location,
          desc: `Go to ${item.name}`,
        });
      }
    });
  });

  const filteredSearchItems = searchItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchNavigation = (path) => {
    setIsSearchOpen(false);
    navigate(path);
  };

  // Key navigation inside search command palette
  const handleSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedSearchIndex(
        (prev) => (prev + 1) % Math.max(1, filteredSearchItems.length),
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedSearchIndex((prev) =>
        prev === 0 ? filteredSearchItems.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSearchItems[focusedSearchIndex]) {
        handleSearchNavigation(filteredSearchItems[focusedSearchIndex].path);
      }
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  const breadcrumbs = getBreadcrumbs(location.pathname);
  const adminName = user?.name || "";
  const adminEmail = user?.email || "";
  const adminInitials = getInitials(adminName);

  return {
    adminName,
    adminEmail,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    user,
    setSearchQuery,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isProfileOpen,
    setIsProfileOpen,
    unreadCount,
    setUnreadCount,
    focusedSearchIndex,
    setFocusedSearchIndex,
    notificationRef,
    profileRef,
    searchInputRef,
    handleLogout,
    filteredSearchItems,
    handleSearchNavigation,
    handleSearchKeyDown,
    breadcrumbs,
    adminInitials,
    navigate,
  };
};

export default useNavbar;
