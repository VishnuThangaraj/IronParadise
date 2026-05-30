import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import { getInitialDietPlanState } from "../constants/dietPlanFields";

const useAddDietPlan = () => {
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [dietPlan, setDietPlan] = useState(getInitialDietPlanState);
  const [activeDay, setActiveDay] = useState("monday");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMetadataChange = useCallback((name, value) => {
    setDietPlan((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const addMealItem = useCallback((day, meal, item) => {
    if (
      !item.name?.trim() ||
      !item.quantity?.trim() ||
      item.calories === "" || item.calories === undefined ||
      item.protein === "" || item.protein === undefined ||
      item.carbs === "" || item.carbs === undefined ||
      item.fat === "" || item.fat === undefined
    ) {
      toast.error("Please fill in all meal item fields");
      return;
    }

    setDietPlan((prev) => {
      const updatedMeals = [...(prev[day]?.[meal] || [])];
      
      const parsedItem = {
        name: item.name || "",
        quantity: item.quantity || "",
        calories: item.calories ? parseInt(item.calories, 10) : 0,
        protein: item.protein ? parseFloat(item.protein) : 0,
        carbs: item.carbs ? parseFloat(item.carbs) : 0,
        fat: item.fat ? parseFloat(item.fat) : 0,
      };

      updatedMeals.push(parsedItem);

      return {
        ...prev,
        [day]: {
          ...prev[day],
          [meal]: updatedMeals,
        },
      };
    });
  }, []);

  const updateMealItem = useCallback((day, meal, index, item) => {
    if (
      !item.name?.trim() ||
      !item.quantity?.trim() ||
      item.calories === "" || item.calories === undefined ||
      item.protein === "" || item.protein === undefined ||
      item.carbs === "" || item.carbs === undefined ||
      item.fat === "" || item.fat === undefined
    ) {
      toast.error("Please fill in all meal item fields");
      return;
    }

    setDietPlan((prev) => {
      const updatedMeals = [...(prev[day]?.[meal] || [])];
      
      updatedMeals[index] = {
        name: item.name || "",
        quantity: item.quantity || "",
        calories: item.calories ? parseInt(item.calories, 10) : 0,
        protein: item.protein ? parseFloat(item.protein) : 0,
        carbs: item.carbs ? parseFloat(item.carbs) : 0,
        fat: item.fat ? parseFloat(item.fat) : 0,
      };

      return {
        ...prev,
        [day]: {
          ...prev[day],
          [meal]: updatedMeals,
        },
      };
    });
  }, []);

  const removeMealItem = useCallback((day, meal, index) => {
    setDietPlan((prev) => {
      const updatedMeals = [...(prev[day]?.[meal] || [])];
      updatedMeals.splice(index, 1);

      return {
        ...prev,
        [day]: {
          ...prev[day],
          [meal]: updatedMeals,
        },
      };
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!dietPlan.name.trim()) {
      toast.error("Diet Plan Name is required");
      return;
    }
    if (!dietPlan.goal.trim()) {
      toast.error("Goal is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("dietplan/create", dietPlan, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data?.message || "Diet Plan created successfully!");
      navigate("/plan/diet/list");
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || 
        (Array.isArray(err.response?.data?.detail) 
          ? err.response.data.detail.map((d) => d.msg).join(", ") 
          : null) || 
        err.response?.data?.message || 
        "Failed to create diet plan";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }, [dietPlan, token, navigate]);

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
    isSubmitting,
    handleMetadataChange,
    addMealItem,
    updateMealItem,
    removeMealItem,
    handleSubmit,
    getActiveDayTotals,
  };
};

export default useAddDietPlan;
