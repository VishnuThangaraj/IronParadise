import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import { getInitialMembershipPlanState } from "../constants/membershipFields";

const useEditMembershipPlan = (id) => {
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [plan, setPlan] = useState(getInitialMembershipPlanState());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id || !token) return;
      setIsLoading(true);
      try {
        const response = await api.get(`membership/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlan(response.data);
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || "Failed to load membership plan";
        toast.error(errorMsg);
        navigate("/membership/list");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [id, token, navigate]);

  const handleMetadataChange = useCallback((name, value) => {
    setPlan((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      if (!plan.name?.trim()) {
        toast.error("Plan Name is required");
        return;
      }
      if (!plan.duration?.trim()) {
        toast.error("Duration is required");
        return;
      }
      if (!plan.amount || plan.amount <= 0) {
        toast.error("Valid Amount is required");
        return;
      }
      if (!plan.description?.trim()) {
        toast.error("Description is required");
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await api.put(`membership/update/${id}`, plan, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(response.data?.message || "Membership Plan updated successfully!");
        navigate("/membership/list");
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail ||
          (Array.isArray(err.response?.data?.detail)
            ? err.response.data.detail.map((d) => d.msg).join(", ")
            : null) ||
          err.response?.data?.message ||
          "Failed to update membership plan";
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [id, plan, token, navigate]
  );

  return {
    plan,
    isLoading,
    isSubmitting,
    handleMetadataChange,
    handleSubmit,
  };
};

export default useEditMembershipPlan;
