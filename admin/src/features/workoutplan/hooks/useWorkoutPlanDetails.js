import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import { getInitialWorkoutPlanState } from "../constants/workoutPlanFields";

const useWorkoutPlanDetails = () => {
  const navigate = useNavigate();
  const { workoutPlanId } = useParams();
  const token = useSelector(selectToken);

  const [workoutPlan, setWorkoutPlan] = useState(getInitialWorkoutPlanState);
  const [activeDay, setActiveDay] = useState("monday");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`workoutplan/${workoutPlanId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const fetchedPlan = response.data || {};
        const baseState = getInitialWorkoutPlanState();
        
        const mergedPlan = {
          ...baseState,
          ...fetchedPlan,
          monday: { ...baseState.monday, ...(fetchedPlan.monday || {}) },
          tuesday: { ...baseState.tuesday, ...(fetchedPlan.tuesday || {}) },
          wednesday: { ...baseState.wednesday, ...(fetchedPlan.wednesday || {}) },
          thursday: { ...baseState.thursday, ...(fetchedPlan.thursday || {}) },
          friday: { ...baseState.friday, ...(fetchedPlan.friday || {}) },
          saturday: { ...baseState.saturday, ...(fetchedPlan.saturday || {}) },
          sunday: { ...baseState.sunday, ...(fetchedPlan.sunday || {}) },
        };

        setWorkoutPlan(mergedPlan);
      } catch (err) {
        const errorMsg = err.response?.data?.detail || "Failed to load workout plan details";
        toast.error(errorMsg);
        navigate("/plan/workout/list");
      } finally {
        setIsLoading(false);
      }
    };

    if (token && workoutPlanId) {
      fetchPlanDetails();
    }
  }, [token, workoutPlanId, navigate]);

  return {
    workoutPlan,
    activeDay,
    setActiveDay,
    isLoading,
    workoutPlanId,
  };
};

export default useWorkoutPlanDetails;
