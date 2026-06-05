import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import api from "@/service/api";

const useAttendanceKiosk = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserStatus, setSelectedUserStatus] = useState("absent");
  const [selectedUserRecord, setSelectedUserRecord] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsPageLoading(true);
    try {
      const res = await api.get("kiosk/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load kiosk users", err);
      toast.error("Failed to connect to kiosk server");
    } finally {
      setIsPageLoading(false);
    }
  }, []);

  const fetchSelectedUserStatus = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const res = await api.get(`kiosk/status/${userId}`);
      setSelectedUserStatus(res.data.status);
      setSelectedUserRecord(res.data.lastRecord);
    } catch (err) {
      console.error("Failed to load user status", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return users.filter(
      u =>
        u.name.toLowerCase().includes(query) ||
        u.id.toLowerCase().includes(query) ||
        (u.mobile && u.mobile.includes(query))
    );
  }, [users, searchQuery]);

  const handleCheckIn = async () => {
    if (!selectedUser) return;
    setIsActionLoading(true);
    try {
      const payload = {
        userId: selectedUser.id,
        userType: selectedUser.type
      };
      await api.post("kiosk/check-in", payload);
      toast.success(`Welcome to Iron Paradise, ${selectedUser.name}!`);
      fetchSelectedUserStatus(selectedUser.id);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to check in");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedUser) return;
    setIsActionLoading(true);
    try {
      const payload = {
        userId: selectedUser.id,
        userType: selectedUser.type
      };
      await api.post("kiosk/check-out", payload);
      toast.success(`Have a great day, ${selectedUser.name}!`);
      fetchSelectedUserStatus(selectedUser.id);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to check out");
    } finally {
      setIsActionLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setSearchQuery("");
    setSelectedUserStatus("absent");
    setSelectedUserRecord(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    isDropdownOpen,
    setIsDropdownOpen,
    selectedUser,
    setSelectedUser,
    selectedUserStatus,
    isActionLoading,
    isPageLoading,
    filteredUsers,
    handleCheckIn,
    handleCheckOut,
    clearSelection,
    fetchSelectedUserStatus
  };
};

export default useAttendanceKiosk;
