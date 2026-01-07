export const initialWorkoutPlanState = {
  workoutPlanId: "",
  workoutPlanName: "",
  goal: "",
  description: "",

  mondayWorkout: "",
  tuesdayWorkout: "",
  wednesdayWorkout: "",
  thursdayWorkout: "",
  fridayWorkout: "",
  saturdayWorkout: "",
  sundayWorkout: "",
};

const WEEK_DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export const WorkoutPlanFieldGroup = [
  {
    title: "Workout Plan Details",
    fields: [
      {
        label: "Workout Plan ID",
        name: "workoutPlanId",
        placeholder: "WPL-000",
        disabled: true,
        size: 50,
      },
      {
        label: "Plan Name",
        name: "workoutPlanName",
        placeholder: "Workout Plan Name",
        size: 50,
      },
      {
        label: "Goal",
        name: "goal",
        placeholder: "Workout Plan Goal",
        size: 50,
      },
      {
        label: "Description",
        name: "description",
        placeholder: "Workout Plan Description",
        size: 50,
      },
    ],
  },
  {
    title: "Weekly Workout Schedule",
    classes: "text-center",
    fields: WEEK_DAYS.map((day) => ({
      label: `${day.label} Plan`,
      name: `${day.key}Workout`,
      type: "textbox",
      rows: 2,
      placeholder: `Enter ${day.label}'s Workout Plan`,
      size: 50,
    })),
  },
];
