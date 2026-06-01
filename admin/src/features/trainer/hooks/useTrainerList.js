import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";

const useTrainerList = () => {
  const token = useSelector(selectToken);
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTrainers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("trainer/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrainers(response.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to load trainers";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const deleteTrainer = useCallback(
    async (id) => {
      const result = await Swal.fire({
        title: "Delete Trainer?",
        text: "This action cannot be undone and will permanently remove this trainer.",
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
        const response = await api.delete(`trainer/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(response.data?.message || "Trainer deleted successfully");
        setTrainers((prev) => prev.filter((trainer) => trainer.trainerID !== id));
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || "Failed to delete trainer";
        toast.error(errorMsg);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        fetchTrainers();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [token, fetchTrainers]);

  const filteredTrainers = useMemo(() => {
    if (!searchQuery.trim()) return trainers;
    const query = searchQuery.toLowerCase();
    return trainers.filter(
      (trainer) =>
        trainer.name?.toLowerCase().includes(query) ||
        trainer.email?.toLowerCase().includes(query) ||
        trainer.specialization?.toLowerCase().includes(query)
    );
  }, [trainers, searchQuery]);

  return {
    trainers: filteredTrainers,
    totalCount: trainers.length,
    isLoading,
    searchQuery,
    setSearchQuery,
    deleteTrainer,
    refreshTrainers: fetchTrainers,
  };
};

export default useTrainerList;
