import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";

const useTrainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [trainer, setTrainer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrainer = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`trainer/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrainer(response.data);
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

  return {
    trainer,
    isLoading,
    refreshTrainer: fetchTrainer,
  };
};

export default useTrainerDetails;
