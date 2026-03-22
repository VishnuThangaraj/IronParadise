export const initialDietPlanState = {
    dietPlanId: "",
    dietPlanName: "",
    goal: "",
    description: "",

    mondayBreakfast: "",
    mondayLunch: "",
    mondayDinner: "",
    tuesdayBreakfast: "",
    tuesdayLunch: "",
    tuesdayDinner: "",
    wednesdayBreakfast: "",
    wednesdayLunch: "",
    wednesdayDinner: "",
    thursdayBreakfast: "",
    thursdayLunch: "",
    thursdayDinner: "",
    fridayBreakfast: "",
    fridayLunch: "",
    fridayDinner: "",
    saturdayBreakfast: "",
    saturdayLunch: "",
    saturdayDinner: "",
    sundayBreakfast: "",
    sundayLunch: "",
    sundayDinner: "",
};

const WEEK_DAYS = [
    {key: "monday", label: "Monday"},
    {key: "tuesday", label: "Tuesday"},
    {key: "wednesday", label: "Wednesday"},
    {key: "thursday", label: "Thursday"},
    {key: "friday", label: "Friday"},
    {key: "saturday", label: "Saturday"},
    {key: "sunday", label: "Sunday"},
];

const MEALS = ["Breakfast", "Lunch", "Dinner"];

const DietPlanDetailsGroup = {
    title: "Diet Plan Details",
    fields: [
        {
            label: "Diet Plan ID",
            name: "dietPlanId",
            placeholder: "DPL-000",
            disabled: true,
            size: 50,
        },
        {
            label: "Plan Name",
            name: "dietPlanName",
            placeholder: "Diet Plan Name",
            size: 50,
        },
        {
            label: "Goal",
            name: "goal",
            placeholder: "Diet Plan Goal",
            size: 50,
        },
        {
            label: "Description",
            name: "description",
            placeholder: "Diet Plan Description",
            size: 50,
        },
    ],
};

const WeeklyDietGroups = WEEK_DAYS.map((day) => ({
    title: `${day.label}'s Plan`,
    classes: "text-center",
    fields: MEALS.map((meal) => ({
        label: meal,
        name: `${day.key}${meal}`,
        type: "textbox",
        rows: 3,
        placeholder: `Enter ${meal} Plan`,
        size: 30,
    })),
}));

export const DietPlanFieldGroup = [DietPlanDetailsGroup, ...WeeklyDietGroups];

export const DietPlanRules = {
    dietPlanName: {
        type: "string",
        maxLength: 20,
        pattern: /^[A-Za-z0-9\s-]+$/,
    },
    goal: {
        type: "string",
        maxLength: 25
    },
    description: {
        type: "string",
        maxLength: 100
    }
};
