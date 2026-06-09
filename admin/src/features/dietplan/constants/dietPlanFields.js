export const dietPlanFields = [
  {
    label: "Diet Plan Name",
    name: "name",
    type: "text",
    placeholder: "e.g., Summer Shredding, Muscle Building Plan",
    size: 100,
  },
  {
    label: "Goal",
    name: "goal",
    type: "text",
    placeholder: "e.g., Weight Loss, Muscle Gain, Maintenance",
    size: 100,
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    placeholder: "Enter a description of the diet plan",
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

export const meals = ["breakfast", "lunch", "dinner", "snacks"];

export const mealItemFields = [
  {
    label: "Item Name",
    name: "name",
    type: "text",
    placeholder: "e.g., Oats, Chicken Breast",
    required: true,
  },
  {
    label: "Quantity",
    name: "quantity",
    type: "text",
    placeholder: "e.g., 100g, 2 pieces",
    required: false,
  },
  {
    label: "Calories (kcal)",
    name: "calories",
    type: "number",
    placeholder: "e.g., 350",
    required: false,
  },
  {
    label: "Protein (g)",
    name: "protein",
    type: "number",
    placeholder: "e.g., 25",
    required: false,
  },
  {
    label: "Carbs (g)",
    name: "carbs",
    type: "number",
    placeholder: "e.g., 40",
    required: false,
  },
  {
    label: "Fat (g)",
    name: "fat",
    type: "number",
    placeholder: "e.g., 8",
    required: false,
  },
];

export const createEmptyDayDiet = () => ({
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
});

export const getInitialDietPlanState = () => ({
  name: "",
  goal: "",
  description: "",
  monday: createEmptyDayDiet(),
  tuesday: createEmptyDayDiet(),
  wednesday: createEmptyDayDiet(),
  thursday: createEmptyDayDiet(),
  friday: createEmptyDayDiet(),
  saturday: createEmptyDayDiet(),
  sunday: createEmptyDayDiet(),
});

export default dietPlanFields;
