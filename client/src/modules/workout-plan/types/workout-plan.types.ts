export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

export interface DayWorkout {
  focus: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  _id: string;
  workoutPlanId: string;
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
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export type WorkoutPlanFormData = Omit<
  WorkoutPlan,
  "_id" | "workoutPlanId" | "createdAt" | "updatedAt" | "__v"
> & {
  workoutPlanId?: string;
};

export type UpdateWorkoutPlanRequest = Partial<WorkoutPlanFormData>;

export interface WorkoutPlanResponse {
  success: boolean;
  message: string;
  data: WorkoutPlan[];
}

export interface SingleWorkoutPlanResponse {
  success: boolean;
  message: string;
  data: WorkoutPlan;
}
