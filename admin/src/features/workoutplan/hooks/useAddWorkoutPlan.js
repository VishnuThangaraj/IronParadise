import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import { getInitialWorkoutPlanState } from "../constants/workoutPlanFields";

const useAddWorkoutPlan = () => {
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [workoutPlan, setWorkoutPlan] = useState(getInitialWorkoutPlanState);
  const [activeDay, setActiveDay] = useState("monday");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await api.post("workoutplan/create", workoutPlan, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data?.message || "Workout Plan created successfully!");
      navigate("/plan/workout/list");
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || 
        (Array.isArray(err.response?.data?.detail) 
          ? err.response.data.detail.map((d) => d.msg).join(", ") 
          : null) || 
        err.response?.data?.message || 
        "Failed to create workout plan";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }, [workoutPlan, token, navigate]);

  return {
    workoutPlan,
    activeDay,
    setActiveDay,
    isSubmitting,
    handleMetadataChange,
    handleDayFocusChange,
    addExercise,
    updateExercise,
    removeExercise,
    handleSubmit,
  };
};

export default useAddWorkoutPlan;
