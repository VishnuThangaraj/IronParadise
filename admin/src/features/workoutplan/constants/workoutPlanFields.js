export const workoutPlanFields = [
  {
    label: "Workout Plan Name",
    name: "name",
    type: "text",
    placeholder: "e.g., Push Pull Legs, Full Body Strength",
    size: 100,
  },
  {
    label: "Goal",
    name: "goal",
    type: "text",
    placeholder: "e.g., Muscle Gain, Strength, Endurance",
    size: 100,
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    placeholder: "Enter a description of the workout plan",
    size: 100,
  },
];

export const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const workoutExerciseFields = [
  {
    label: "Exercise Name",
    name: "name",
    type: "text",
    placeholder: "e.g., Barbell Squat, Bench Press",
    required: true,
  },
  {
    label: "Sets",
    name: "sets",
    type: "number",
    placeholder: "e.g., 3",
    required: false,
  },
  {
    label: "Reps",
    name: "reps",
    type: "text",
    placeholder: "e.g., 8-12, 10",
    required: false,
  },
  {
    label: "Rest",
    name: "rest",
    type: "text",
    placeholder: "e.g., 90s, 2 min",
    required: false,
  },
  {
    label: "Notes",
    name: "notes",
    type: "text",
    placeholder: "e.g., Keep back straight",
    required: false,
  },
];

export const createEmptyDayWorkout = () => ({
  focus: "",
  exercises: [],
});

export const getInitialWorkoutPlanState = () => ({
  name: "",
  goal: "",
  description: "",
  monday: createEmptyDayWorkout(),
  tuesday: createEmptyDayWorkout(),
  wednesday: createEmptyDayWorkout(),
  thursday: createEmptyDayWorkout(),
  friday: createEmptyDayWorkout(),
  saturday: createEmptyDayWorkout(),
  sunday: createEmptyDayWorkout(),
});

export default workoutPlanFields;
