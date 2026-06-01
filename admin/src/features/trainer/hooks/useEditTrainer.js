import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import { getInitialTrainerState } from "../constants/trainerFields";

const useEditTrainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [trainer, setTrainer] = useState(getInitialTrainerState());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTrainer = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`trainer/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        // Format date to YYYY-MM-DD for input type="date"
        const fetchedData = { ...response.data };
        if (fetchedData.dob) {
          fetchedData.dob = new Date(fetchedData.dob).toISOString().split("T")[0];
        }
        if (fetchedData.joinDate) {
          fetchedData.joinDate = new Date(fetchedData.joinDate).toISOString().split("T")[0];
        }
        setTrainer(fetchedData);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to load trainer details";
      toast.error(errorMsg);
      navigate("/trainer/list");
    } finally {
      setIsLoading(false);
    }
  }, [id, token, navigate]);

  useEffect(() => {
    if (token && id) {
      const timer = setTimeout(() => {
        fetchTrainer();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [token, id, fetchTrainer]);

  const handleMetadataChange = useCallback((name, value) => {
    setTrainer((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      if (!trainer.name?.trim()) {
        toast.error("Trainer Name is required");
        return;
      }
      if (!trainer.email?.trim()) {
        toast.error("Email is required");
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await api.put(`trainer/update/${id}`, trainer, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(response.data?.message || "Trainer updated successfully!");
        navigate("/trainer/list");
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail ||
          (Array.isArray(err.response?.data?.detail)
            ? err.response.data.detail.map((d) => d.msg).join(", ")
            : null) ||
          err.response?.data?.message ||
          "Failed to update trainer";
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [trainer, token, id, navigate]
  );

  return {
    trainer,
    isLoading,
    isSubmitting,
    handleMetadataChange,
    handleSubmit,
  };
};

export default useEditTrainer;
