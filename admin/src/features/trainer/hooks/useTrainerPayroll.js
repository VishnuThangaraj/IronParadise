import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";

const useTrainerPayroll = () => {
  const token = useSelector(selectToken);
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (token) {
      fetchTrainers();
    }
  }, [token, fetchTrainers]);

  const addSalaryRecord = useCallback(
    async (trainerID, salaryData) => {
      setIsSubmitting(true);
      try {
        const response = await api.post(
          `trainer/${trainerID}/salary/add`,
          salaryData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(response.data?.message || "Salary record added successfully");
        if (response.data?.trainer) {
          setTrainers((prev) =>
            prev.map((t) =>
              t.trainerID === trainerID ? response.data.trainer : t
            )
          );
        } else {
          fetchTrainers();
        }
        return true;
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || "Failed to add salary record";
        toast.error(errorMsg);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, fetchTrainers]
  );

  const updateSalaryRecord = useCallback(
    async (trainerID, salaryId, salaryData) => {
      setIsSubmitting(true);
      try {
        const response = await api.put(
          `trainer/${trainerID}/salary/update/${salaryId}`,
          salaryData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(
          response.data?.message || "Salary record updated successfully"
        );
        if (response.data?.trainer) {
          setTrainers((prev) =>
            prev.map((t) =>
              t.trainerID === trainerID ? response.data.trainer : t
            )
          );
        } else {
          fetchTrainers();
        }
        return true;
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || "Failed to update salary record";
        toast.error(errorMsg);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, fetchTrainers]
  );

  const deleteSalaryRecord = useCallback(
    async (trainerID, salaryId) => {
      const result = await Swal.fire({
        title: "Remove Salary Record?",
        text: "This action cannot be undone and will permanently remove this record.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#6366f1",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, remove",
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
        const response = await api.delete(
          `trainer/${trainerID}/salary/remove/${salaryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(
          response.data?.message || "Salary record removed successfully"
        );
        if (response.data?.trainer) {
          setTrainers((prev) =>
            prev.map((t) =>
              t.trainerID === trainerID ? response.data.trainer : t
            )
          );
        } else {
          fetchTrainers();
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || "Failed to remove salary record";
        toast.error(errorMsg);
      }
    },
    [token, fetchTrainers]
  );

  return {
    trainers,
    isLoading,
    isSubmitting,
    addSalaryRecord,
    updateSalaryRecord,
    deleteSalaryRecord,
    refreshTrainers: fetchTrainers,
  };
};

export default useTrainerPayroll;
