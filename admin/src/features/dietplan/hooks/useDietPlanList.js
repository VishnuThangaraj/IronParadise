import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";

const useDietPlanList = () => {
  const token = useSelector(selectToken);
  const [dietPlans, setDietPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("dietplan/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDietPlans(response.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to load diet plans";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const deletePlan = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Delete Diet Plan?",
        text: "This action cannot be undone and will permanently remove this plan.",
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
        const response = await api.delete(`dietplan/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(response.data?.message || "Diet Plan deleted successfully");
        // Update local list
        setDietPlans((prev) => prev.filter((plan) => plan.planId !== id));
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || "Failed to delete diet plan";
        toast.error(errorMsg);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        fetchPlans();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [token, fetchPlans]);

  // Client-side search filtering
  const filteredPlans = useMemo(() => {
    if (!searchQuery.trim()) return dietPlans;
    const query = searchQuery.toLowerCase();
    return dietPlans.filter(
      (plan) =>
        plan.name?.toLowerCase().includes(query) ||
        plan.goal?.toLowerCase().includes(query) ||
        plan.description?.toLowerCase().includes(query)
    );
  }, [dietPlans, searchQuery]);

  return {
    dietPlans: filteredPlans,
    totalCount: dietPlans.length,
    isLoading,
    searchQuery,
    setSearchQuery,
    deletePlan,
    refreshPlans: fetchPlans,
  };
};

export default useDietPlanList;
