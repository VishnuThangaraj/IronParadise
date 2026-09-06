import React, { useEffect, useMemo, useState, type FormEvent } from "react";
import type { AppDispatch } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";

import { useNavigation } from "@/shared/hooks/useNavigation";
import { useToast } from "@/shared/components/ui/toast";
import { getErrorMessage } from "@/shared/utils/error-handler";

import { formatDate } from "@/shared/utils/formatDate";

import {
  WorkoutPlanFormState,
  initialWorkoutPlanState,
} from "../state/initial-workout-plan.state";
import {
  selectCurrentWorkoutPlan,
  selectWorkoutPlanError,
  selectWorkoutPlanLoading,
  selectWorkoutPlans,
} from "../redux/workout-plan.selector";
import {
  createWorkoutPlan,
  fetchWorkoutPlanById,
  fetchWorkoutPlans,
  updateWorkoutPlan,
} from "../redux/workout-plan.thunks";
import { WeekDay } from "@/shared/components/ui/date/constants/week-days";

const useWorkoutPlan = (initialData?: WorkoutPlanFormState) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const error = useSelector(selectWorkoutPlanError);
  const workoutPlans = useSelector(selectWorkoutPlans);
  const loading = useSelector(selectWorkoutPlanLoading);
  const currentWorkoutPlan = useSelector(selectCurrentWorkoutPlan);

  const [activeDay, setActiveDay] = useState<WeekDay>("monday");

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<WorkoutPlanFormState>(
    initialData ?? initialWorkoutPlanState,
  );

  useEffect(() => {
    dispatch(fetchWorkoutPlans());
  }, [dispatch]);

  // Table Filteration
  const filteredRows = useMemo(() => {
    let result = workoutPlans;

    if (statusFilter === "active") {
      result = result.filter((plan) => plan.isActive);
    } else if (statusFilter === "inactive") {
      result = result.filter((plan) => !plan.isActive);
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return result;

    return result.filter((plan) => {
      const nameMatch = plan.planName?.toLowerCase().includes(query);
      const idMatch = plan.workoutPlanId?.toLowerCase().includes(query);
      const goalMatch = plan.goal?.toLowerCase().includes(query);
      const descriptionMatch = plan.description?.toLowerCase().includes(query);

      return nameMatch || idMatch || goalMatch || descriptionMatch;
    });
  }, [workoutPlans, searchQuery, statusFilter]);

  // fetch current workout plan with planId
  const fetchWorkoutPlanWithPlanId = (planId: string) => {
    if (!currentWorkoutPlan || currentWorkoutPlan?.workoutPlanId != planId) {
      dispatch(fetchWorkoutPlanById(planId));
    }
  };

  // handle edit workout plan button click
  const handleNavigateToEdit = (planId: string) => {
    fetchWorkoutPlanWithPlanId(planId);
    navigate(`/plan/workout/edit/${planId.toLocaleLowerCase()}`);
  };

  // handle view workout plan button click
  const handleNavigateToView = (planId: string) => {
    fetchWorkoutPlanWithPlanId(planId);
    navigate(`/plan/workout/${planId.toLocaleLowerCase()}`);
  };

  // handle add workout plan button click
  const handleNavigateToAdd = () => {
    navigate("/plan/workout/add");
  };

  // handle form input change
  const handleInputChange = (
    name: keyof WorkoutPlanFormState,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle workout plan status filter
  const handleActiveStatusFilter = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const activeStatus = event?.target?.value || "all";
    setStatusFilter(activeStatus);
  };

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
          updateWorkoutPlan({
            workoutPlanId: planId,
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
          message: "Workout plan updated successfully.",
        });
        navigate(`/plan/workout/${planId.toLowerCase()}`);
      } else {
        await dispatch(
          createWorkoutPlan({
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
          message: "Workout plan created successfully.",
        });
        navigate("/plan/workout");
      }
    } catch (err: unknown) {
      addToast({
        type: "error",
        message: getErrorMessage(err, "Failed to save workout plan."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

    // handle add exercise
    const addExercise = (exercise: any) => {
      setFormData((prev) => {
        const currentDay = prev[activeDay];
        return {
          ...prev,
          [activeDay]: {
            ...currentDay,
            exercises: [...(currentDay.exercises || []), exercise],
          },
        };
      });
    };
  
    // handle remove exercise
    const removeExercise = (index: number) => {
      setFormData((prev) => {
        const currentDay = prev[activeDay];
        const newExercises = [...(currentDay.exercises || [])];
        newExercises.splice(index, 1);
        return {
          ...prev,
          [activeDay]: {
            ...currentDay,
            exercises: newExercises,
          },
        };
      });
    };

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
      fetchWorkoutPlanWithPlanId,
      currentWorkoutPlan,
  
      // Form-specific state and actions
      formData,
      setFormData,
      isSubmitting,
      handleInputChange,
      handleSubmitPlan,
      addExercise,
      removeExercise,
    };
};

export default useWorkoutPlan;
