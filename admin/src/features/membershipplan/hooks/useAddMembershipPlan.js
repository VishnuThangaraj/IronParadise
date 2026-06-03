import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import { getInitialMembershipPlanState } from "../constants/membershipFields";

const useAddMembershipPlan = () => {
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [plan, setPlan] = useState(getInitialMembershipPlanState());
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        const response = await api.post("membership/create", plan, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(response.data?.message || "Membership Plan created successfully!");
        navigate("/membership/list");
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail ||
          (Array.isArray(err.response?.data?.detail)
            ? err.response.data.detail.map((d) => d.msg).join(", ")
            : null) ||
          err.response?.data?.message ||
          "Failed to create membership plan";
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [plan, token, navigate]
  );

  return {
    plan,
    isSubmitting,
    handleMetadataChange,
    handleSubmit,
  };
};

export default useAddMembershipPlan;
