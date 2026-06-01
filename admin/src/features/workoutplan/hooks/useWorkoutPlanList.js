import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";

const useWorkoutPlanList = () => {
  const token = useSelector(selectToken);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("workoutplan/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWorkoutPlans(response.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to load workout plans";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const deletePlan = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Delete Workout Plan?",
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
        const response = await api.delete(`workoutplan/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(response.data?.message || "Workout Plan deleted successfully");
        setWorkoutPlans((prev) => prev.filter((plan) => plan.planId !== id));
      } catch (err) {
        const errorMsg = err.response?.data?.detail || "Failed to delete workout plan";
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

  const filteredPlans = useMemo(() => {
    if (!searchQuery.trim()) return workoutPlans;
    const query = searchQuery.toLowerCase();
    return workoutPlans.filter(
      (plan) =>
        plan.name?.toLowerCase().includes(query) ||
        plan.goal?.toLowerCase().includes(query) ||
        plan.description?.toLowerCase().includes(query)
    );
  }, [workoutPlans, searchQuery]);

  return {
    workoutPlans: filteredPlans,
    totalCount: workoutPlans.length,
    isLoading,
    searchQuery,
    setSearchQuery,
    deletePlan,
    refreshPlans: fetchPlans,
  };
};

export default useWorkoutPlanList;
