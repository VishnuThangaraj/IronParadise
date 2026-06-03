import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";

const useMembershipPlanDetails = (id) => {
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          err.response?.data?.detail || "Failed to load membership plan details";
        toast.error(errorMsg);
        navigate("/membership/list");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [id, token, navigate]);

  return {
    plan,
    isLoading,
  };
};

export default useMembershipPlanDetails;
