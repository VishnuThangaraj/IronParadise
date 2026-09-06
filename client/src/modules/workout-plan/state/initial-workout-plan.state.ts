import { DayWorkout } from "../types/workout-plan.types";

export const emptyDayWorkout: DayWorkout = {
  focus: "",
  exercises: [],
};

export interface WorkoutPlanFormState {
  planName: string;
  goal: string;
  description: string;

  monday: DayWorkout;
  tuesday: DayWorkout;
  wednesday: DayWorkout;
  thursday: DayWorkout;
  friday: DayWorkout;
  saturday: DayWorkout;
  sunday: DayWorkout;

  isActive: boolean;
}

export const initialWorkoutPlanState: WorkoutPlanFormState = {
  planName: "",
  goal: "",
  description: "",

  monday: { ...emptyDayWorkout },
  tuesday: { ...emptyDayWorkout },
  wednesday: { ...emptyDayWorkout },
  thursday: { ...emptyDayWorkout },
  friday: { ...emptyDayWorkout },
  saturday: { ...emptyDayWorkout },
  sunday: { ...emptyDayWorkout },

  isActive: true,
};

export default initialWorkoutPlanState;
