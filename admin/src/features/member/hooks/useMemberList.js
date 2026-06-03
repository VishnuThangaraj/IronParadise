import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";

const useMemberList = () => {
  const token = useSelector(selectToken);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("member/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMembers(response.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to load members";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const deleteMember = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Delete Member?",
        text: "This action cannot be undone and will permanently remove this member.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#6366f1",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl font-montserrat",
          title: "text-base font-bold text-slate-800",
          confirmButton: "px-4 py-2 text-xs font-bold rounded-xl cursor-pointer",
          cancelButton: "px-4 py-2 text-xs font-bold rounded-xl cursor-pointer",
        },
      });

      if (!result.isConfirmed) return;

      try {
        const response = await api.delete(`member/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(response.data?.message || "Member deleted successfully");
        setMembers((prev) => prev.filter((member) => member.memberId !== id));
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || "Failed to delete member";
        toast.error(errorMsg);
      }
    },
    [token]
  );

  const populateMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("member/populate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data?.message || "Members seeded successfully!");
      fetchMembers();
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to seed members";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [token, fetchMembers]);

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        fetchMembers();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [token, fetchMembers]);

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const query = searchQuery.toLowerCase();
    return members.filter(
      (member) =>
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.mobile?.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  return {
    members: filteredMembers,
    totalCount: members.length,
    isLoading,
    searchQuery,
    setSearchQuery,
    deleteMember,
    populateMembers,
    refreshMembers: fetchMembers,
  };
};

export default useMemberList;
