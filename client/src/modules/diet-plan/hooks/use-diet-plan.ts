import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import type { AppDispatch } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";

import { useNavigation } from "@/shared/hooks/useNavigation";
import { useToast } from "@/shared/components/ui/toast";
import { getErrorMessage } from "@/shared/utils/error-handler";

import { formatDate } from "@/shared/utils/formatDate";

import {
  DietPlanFormState,
  initialDietPlanState,
} from "../state/initial-diet-plan.state";
import {
  selectCurrentDietPlan,
  selectDietPlanError,
  selectDietPlanLoading,
  selectDietPlans,
} from "../redux/diet-plan.selector";
import {
  createDietPlan,
  fetchDietPlanById,
  fetchDietPlans,
  updateDietPlan,
} from "../redux/diet-plan.thunks";
import { WeekDay } from "@/shared/components/ui/date/constants/week-days";
import { meals } from "../constants/diet-plan.meals";
import { MealItem, MacroTotals, MealType, DayDiet } from "../types/diet-plan.types";

/**
 * Pure functional utility to calculate macro totals from a DayDiet
 */
export const calculateMacroTotals = (dayData?: DayDiet): MacroTotals => {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  if (!dayData) {
    return { calories, protein, carbs, fat };
  }

  meals.forEach((meal) => {
    const items = dayData[meal] || [];
    items.forEach((item: MealItem) => {
      calories += Number(item.calories) || 0;
      protein += Number(item.protein) || 0;
      carbs += Number(item.carbs) || 0;
      fat += Number(item.fat) || 0;
    });
  });

  return {
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
  };
};

const useDietPlan = (initialData?: DietPlanFormState) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const error = useSelector(selectDietPlanError);
  const dietPlans = useSelector(selectDietPlans);
  const loading = useSelector(selectDietPlanLoading);
  const currentDietPlan = useSelector(selectCurrentDietPlan);

  const [activeDay, setActiveDay] = useState<WeekDay>("monday");

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<DietPlanFormState>(
    initialData ?? initialDietPlanState,
  );

  useEffect(() => {
    dispatch(fetchDietPlans());
  }, [dispatch]);

  // Table Filteration
  const filteredRows = useMemo(() => {
    let result = dietPlans;

    if (statusFilter === "active") {
      result = result.filter((plan) => plan.isActive);
    } else if (statusFilter === "inactive") {
      result = result.filter((plan) => !plan.isActive);
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return result;

    return result.filter((plan) => {
      const nameMatch = plan.planName?.toLowerCase().includes(query);
      const idMatch = plan.dietPlanId?.toLowerCase().includes(query);
      const goalMatch = plan.goal?.toLowerCase().includes(query);
      const descriptionMatch = plan.description?.toLowerCase().includes(query);

      return nameMatch || idMatch || goalMatch || descriptionMatch;
    });
  }, [dietPlans, searchQuery, statusFilter]);

  // fetch current diet plan with planId
  const fetchDietPlanWithPlanId = (planId: string) => {
    if (!currentDietPlan || currentDietPlan?.dietPlanId != planId) {
      dispatch(fetchDietPlanById(planId));
    }
  };

  // handle edit diet plan button click
  const handleNavigateToEdit = (planId: string) => {
    fetchDietPlanWithPlanId(planId);
    navigate(`/plan/diet/edit/${planId.toLocaleLowerCase()}`);
  };

  // handle view diet plan button click
  const handleNavigateToView = (planId: string) => {
    fetchDietPlanWithPlanId(planId);
    navigate(`/plan/diet/${planId.toLocaleLowerCase()}`);
  };

  // handle add diet plan button click
  const handleNavigateToAdd = () => {
    navigate("/plan/diet/add");
  };

  // handle form input change
  const handleInputChange = (
    name: keyof DietPlanFormState,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle diet plan status filter
  const handleActiveStatusFilter = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const activeStatus = event?.target?.value || "all";
    setStatusFilter(activeStatus);
  };

  // macro totals of active day
  const getActiveDayTotals = useCallback(
    (targetDayData?: DayDiet): MacroTotals => {
      if (targetDayData) {
        return calculateMacroTotals(targetDayData);
      }

      // In form mode (initialData explicitly provided), calculate from formData
      // In view mode, calculate from currentDietPlan
      const dayData =
        initialData !== undefined
          ? formData?.[activeDay]
          : currentDietPlan?.[activeDay] ?? formData?.[activeDay];

      return calculateMacroTotals(dayData);
    },
    [activeDay, formData, currentDietPlan, initialData],
  );

  // handle form submission (Create or Update)
  const handleSubmitPlan = async (
    e: FormEvent<HTMLFormElement>,
    isEditMode: boolean,
    planId?: string,
  ) => {
    e.preventDefault();

    if (!formData.planName.trim()) {
      addToast({
        type: "error",
        message: "Plan name is required.",
      });
      return;
    }

    if (!formData.goal.trim()) {
      addToast({
        type: "error",
        message: "Goal is required.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && planId) {
        await dispatch(
          updateDietPlan({
            dietPlanId: planId,
            planData: {
              planName: formData.planName.trim(),
              goal: formData.goal.trim(),
              description: formData.description.trim(),
              monday: formData.monday,
              tuesday: formData.tuesday,
              wednesday: formData.wednesday,
              thursday: formData.thursday,
              friday: formData.friday,
              saturday: formData.saturday,
              sunday: formData.sunday,
              isActive: formData.isActive,
            },
          }),
        ).unwrap();

        addToast({
          type: "success",
          message: "Diet plan updated successfully.",
        });
        navigate(`/plan/diet/${planId.toLowerCase()}`);
      } else {
        await dispatch(
          createDietPlan({
            planName: formData.planName.trim(),
            goal: formData.goal.trim(),
            description: formData.description.trim(),
            monday: formData.monday,
            tuesday: formData.tuesday,
            wednesday: formData.wednesday,
            thursday: formData.thursday,
            friday: formData.friday,
            saturday: formData.saturday,
            sunday: formData.sunday,
            isActive: formData.isActive,
          }),
        ).unwrap();

        addToast({
          type: "success",
          message: "Diet plan created successfully.",
        });
        navigate("/plan/diet");
      }
    } catch (err: unknown) {
      addToast({
        type: "error",
        message: getErrorMessage(err, "Failed to save diet plan."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // remove meal item from form state immutably
  const removeMealItem = useCallback(
    (meal: MealType, index: number) => {
      setFormData((prev) => {
        const currentDay = prev[activeDay];
        const currentMealItems = currentDay?.[meal] || [];

        return {
          ...prev,
          [activeDay]: {
            ...currentDay,
            [meal]: currentMealItems.filter((_, i) => i !== index),
          },
        };
      });
    },
    [activeDay],
  );

  // add meal item to form state immutably
  const addMealItem = useCallback(
    (meal: MealType, item: MealItem) => {
      setFormData((prev) => {
        const currentDay = prev[activeDay];
        const currentMealItems = currentDay?.[meal] || [];

        return {
          ...prev,
          [activeDay]: {
            ...currentDay,
            [meal]: [...currentMealItems, item],
          },
        };
      });
    },
    [activeDay],
  );

  return {
    error,
    loading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredRows,
    activeDay,
    setActiveDay,
    formatDate,
    handleActiveStatusFilter,
    handleNavigateToAdd,
    handleNavigateToEdit,
    handleNavigateToView,
    fetchDietPlanWithPlanId,
    currentDietPlan,
    getActiveDayTotals,

    // Form-specific state and actions
    formData,
    setFormData,
    handleInputChange,
    isSubmitting,
    removeMealItem,
    addMealItem,
    handleSubmitPlan,
  };
};

export default useDietPlan;
