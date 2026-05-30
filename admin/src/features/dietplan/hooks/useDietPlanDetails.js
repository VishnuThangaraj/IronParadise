import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import { getInitialDietPlanState } from "../constants/dietPlanFields";

const useDietPlanDetails = () => {
  const navigate = useNavigate();
  const { dietPlanId } = useParams();
  const token = useSelector(selectToken);

  const [dietPlan, setDietPlan] = useState(getInitialDietPlanState);
  const [activeDay, setActiveDay] = useState("monday");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`dietplan/${dietPlanId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const fetchedPlan = response.data || {};
        const baseState = getInitialDietPlanState();
        
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

        setDietPlan(mergedPlan);
      } catch (err) {
        const errorMsg = err.response?.data?.detail || "Failed to load diet plan details";
        toast.error(errorMsg);
        navigate("/plan/diet/list");
      } finally {
        setIsLoading(false);
      }
    };

    if (token && dietPlanId) {
      fetchPlanDetails();
    }
  }, [token, dietPlanId, navigate]);

  const getActiveDayTotals = useCallback(() => {
    const dayData = dietPlan[activeDay] || {};
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    Object.keys(dayData).forEach((meal) => {
      const items = dayData[meal] || [];
      items.forEach((item) => {
        calories += item.calories || 0;
        protein += item.protein || 0;
        carbs += item.carbs || 0;
        fat += item.fat || 0;
      });
    });

    return { calories, protein, carbs, fat };
  }, [dietPlan, activeDay]);

  return {
    dietPlan,
    activeDay,
    setActiveDay,
    isLoading,
    getActiveDayTotals,
    dietPlanId,
  };
};

export default useDietPlanDetails;
