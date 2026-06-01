import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import { getInitialWorkoutPlanState } from "../constants/workoutPlanFields";

const useEditWorkoutPlan = () => {
  const navigate = useNavigate();
  const { workoutPlanId } = useParams();
  const token = useSelector(selectToken);

  const [workoutPlan, setWorkoutPlan] = useState(getInitialWorkoutPlanState);
  const [activeDay, setActiveDay] = useState("monday");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleMetadataChange = useCallback((name, value) => {
    setWorkoutPlan((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleDayFocusChange = useCallback((day, value) => {
    setWorkoutPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        focus: value,
      },
    }));
  }, []);

  const addExercise = useCallback((day, exercise) => {
    if (!exercise.name?.trim()) {
      toast.error("Exercise Name is required");
      return;
    }

    setWorkoutPlan((prev) => {
      const updatedExercises = [...(prev[day]?.exercises || [])];
      
      const parsedExercise = {
        name: exercise.name || "",
        sets: exercise.sets ? parseInt(exercise.sets, 10) : 0,
        reps: exercise.reps || "",
        rest: exercise.rest || "",
        notes: exercise.notes || "",
      };

      updatedExercises.push(parsedExercise);

      return {
        ...prev,
        [day]: {
          ...prev[day],
          exercises: updatedExercises,
        },
      };
    });
  }, []);

  const updateExercise = useCallback((day, index, exercise) => {
    if (!exercise.name?.trim()) {
      toast.error("Exercise Name is required");
      return;
    }

    setWorkoutPlan((prev) => {
      const updatedExercises = [...(prev[day]?.exercises || [])];
      
      updatedExercises[index] = {
        name: exercise.name || "",
        sets: exercise.sets ? parseInt(exercise.sets, 10) : 0,
        reps: exercise.reps || "",
        rest: exercise.rest || "",
        notes: exercise.notes || "",
      };

      return {
        ...prev,
        [day]: {
          ...prev[day],
          exercises: updatedExercises,
        },
      };
    });
  }, []);

  const removeExercise = useCallback((day, index) => {
    setWorkoutPlan((prev) => {
      const updatedExercises = [...(prev[day]?.exercises || [])];
      updatedExercises.splice(index, 1);

      return {
        ...prev,
        [day]: {
          ...prev[day],
          exercises: updatedExercises,
        },
      };
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!workoutPlan.name.trim()) {
      toast.error("Workout Plan Name is required");
      return;
    }
    if (!workoutPlan.goal.trim()) {
      toast.error("Goal is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.put(`workoutplan/update/${workoutPlanId}`, workoutPlan, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data?.message || "Workout Plan updated successfully!");
      navigate("/plan/workout/list");
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || 
        (Array.isArray(err.response?.data?.detail) 
          ? err.response.data.detail.map((d) => d.msg).join(", ") 
          : null) || 
        err.response?.data?.message || 
        "Failed to update workout plan";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }, [workoutPlan, workoutPlanId, token, navigate]);

  return {
    workoutPlan,
    activeDay,
    setActiveDay,
    isLoading,
    isSubmitting,
    handleMetadataChange,
    handleDayFocusChange,
    addExercise,
    updateExercise,
    removeExercise,
    handleSubmit,
  };
};

export default useEditWorkoutPlan;
