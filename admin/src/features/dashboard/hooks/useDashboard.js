import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "@/features/auth/redux/authSelector";
import api from "@/service/api";
import toast from "react-hot-toast";

const useDashboard = () => {
  const token = useSelector(selectToken);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await api.get("dashboard/metrics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetrics(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard metrics", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    metrics,
    isLoading,
    refetch: fetchMetrics
  };
};

export default useDashboard;
