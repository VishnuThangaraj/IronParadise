import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import { getInitialTrainerState } from "../constants/trainerFields";

const useAddTrainer = () => {
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [trainer, setTrainer] = useState(getInitialTrainerState());
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (!trainer.mobile?.trim()) {
        toast.error("Mobile is required");
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await api.post("trainer/create", trainer, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(response.data?.message || "Trainer created successfully!");
        navigate("/trainer/list");
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail ||
          (Array.isArray(err.response?.data?.detail)
            ? err.response.data.detail.map((d) => d.msg).join(", ")
            : null) ||
          err.response?.data?.message ||
          "Failed to create trainer";
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [trainer, token, navigate]
  );

  return {
    trainer,
    isSubmitting,
    handleMetadataChange,
    handleSubmit,
  };
};

export default useAddTrainer;
