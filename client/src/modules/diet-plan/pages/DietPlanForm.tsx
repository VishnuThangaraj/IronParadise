import { Checkbox } from "@mui/material";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import type { AppDispatch } from "@/app/store";

import { LuArrowLeft, LuCalendar, LuSave, LuUtensils } from "react-icons/lu";

import Chip from "@/shared/components/ui/chip/Chip";
import Input from "@/shared/components/ui/forms/Input";
import Button from "@/shared/components/ui/buttons/Button";
import { useNavigation } from "@/shared/hooks/useNavigation";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import DaySelector from "@/shared/components/ui/date/DaySelector";
import Container from "@/shared/components/ui/containers/Container";
import { WeekDay } from "@/shared/components/ui/date/constants/week-days";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";

import {
  DietPlanFormState,
  initialDietPlanState,
} from "../state/initial-diet-plan.state";
import useDietPlan from "../hooks/use-diet-plan";
import { fetchDietPlanById } from "../redux/diet-plan.thunks";
import MealCard from "@/modules/diet-plan/components/MealCard";
import DayTotals from "@/modules/diet-plan/components/DayTotals";
import { meals } from "@/modules/diet-plan/constants/diet-plan.meals";

interface DietPlanFormInnerProps {
  initialData: DietPlanFormState;
  isEditMode: boolean;
  planId?: string;
}

const DietPlanInner = ({
  initialData,
  isEditMode,
  planId,
}: DietPlanFormInnerProps) => {
  const { navigate } = useNavigation();
  const {
    formData,
    activeDay,
    setActiveDay,
    isSubmitting,
    removeMealItem,
    addMealItem,
    handleSubmitPlan,
    handleInputChange,
    getActiveDayTotals,
  } = useDietPlan(initialData);

  const activeTotals = getActiveDayTotals();

  return (
    <form
      onSubmit={(e) => handleSubmitPlan(e, isEditMode, planId)}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-between gap-6 w-full">
        <div className="flex flex-col w-4/12 gap-6">
          <Container variant="secondary" className="flex flex-col p-6!">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-white/10">
              <div
                className={`w-8 h-8 rounded-xl ${getDeterministicGradient(
                  planId || "1",
                )} flex items-center justify-center text-white shadow-xs shrink-0`}
              >
                <LuUtensils className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Plan Information
              </h2>
            </div>
            <div className="space-y-3.5 pt-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Diet Plan Name
                </span>
                <Input
                  name="planName"
                  type="text"
                  value={formData.planName}
                  onChange={(e) =>
                    handleInputChange("planName", e.target.value)
                  }
                  placeholder="e.g. Intermediate Fasting"
                  required
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Goal Target
                </span>
                <Input
                  name="goal"
                  type="text"
                  value={formData.goal}
                  onChange={(e) => handleInputChange("goal", e.target.value)}
                  placeholder="e.g. Weight Loss / Muscle Gain"
                  required
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Description
                </span>
                <Input
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="e.g. High protein diet designed for lean muscle growth"
                />
              </div>

              {/* Status Switch / Checkbox */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 select-none">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Plan Active Status
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {formData.isActive
                      ? "Plan is active and visible"
                      : "Plan is disabled / archived"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Chip
                    variant={formData.isActive ? "active" : "inactive"}
                    size="sm"
                    dot={true}
                    label={formData.isActive ? "Active" : "Inactive"}
                  />
                  <Checkbox
                    checked={formData.isActive}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.checked)
                    }
                    size="small"
                    sx={{
                      p: 0,
                      color: "rgba(100, 116, 139, 0.7)",
                      ".dark &": {
                        color: "rgba(255, 255, 255, 0.3)",
                      },
                      "&.Mui-checked": {
                        color: "#6366f1 !important",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </Container>
          {/* Active Day Nutrition Summary Card */}
          <DayTotals activeDay={activeDay} totals={activeTotals} />
        </div>
        <div className="flex flex-col w-8/12 gap-6">
          <DaySelector
            activeDay={activeDay as WeekDay}
            onSelectDay={setActiveDay}
          />
          <div className="flex flex-col gap-6">
            <div className="ms-3 flex gap-2.5 items-center">
              <LuCalendar className="w-4 h-4 text-primary" />
              <div className="uppercase text-sm font-semibold tracking-wider text-slate-800 dark:text-slate-100">
                Scheduled Meals {`(${activeDay})`}
              </div>
            </div>

            {/* Meals */}
            <div className="grid grid-cols-2 gap-6 w-full">
              {meals.map((meal) => {
                return (
                  <MealCard
                    key={`dpl-meal-${meal}`}
                    meal={meal}
                    items={formData?.[activeDay]?.[meal] || []}
                    onRemoveItem={(index) => removeMealItem(meal, index)}
                    onAddItem={(item) => addMealItem(meal, item)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-center gap-3 pt-6 border-t border-slate-200/80 dark:border-white/10">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => {
            if (isEditMode && planId)
              navigate(`/plan/diet/${planId.toLowerCase()}`);
            else navigate("/plan/diet");
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <LuSave size={16} />
          <span>
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Update Plan"
                : "Save Plan"}
          </span>
        </Button>
      </div>
    </form>
  );
};

const DietPlanForm = () => {
  const { planId } = useParams<{ planId: string }>();
  const isEditMode = Boolean(planId);
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigation();

  const { currentDietPlan, loading: planLoading } = useDietPlan();

  const fetchedPlanIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isEditMode && planId && fetchedPlanIdRef.current !== planId) {
      const matchesCurrent =
        currentDietPlan &&
        (currentDietPlan.dietPlanId.toLowerCase() === planId.toLowerCase() ||
          currentDietPlan._id.toLowerCase() === planId.toLowerCase());

      if (!matchesCurrent) {
        fetchedPlanIdRef.current = planId;
        dispatch(fetchDietPlanById(planId));
      } else {
        fetchedPlanIdRef.current = planId;
      }
    }
  }, [isEditMode, planId, currentDietPlan, dispatch]);

  const initialData: DietPlanFormState =
    isEditMode && currentDietPlan
      ? {
          planName: currentDietPlan.planName || "",
          goal: currentDietPlan.goal || "",
          description: currentDietPlan.description || "",

          monday: currentDietPlan.monday || initialDietPlanState.monday,
          tuesday: currentDietPlan.tuesday || initialDietPlanState.tuesday,
          wednesday:
            currentDietPlan.wednesday || initialDietPlanState.wednesday,
          thursday: currentDietPlan.thursday || initialDietPlanState.thursday,
          friday: currentDietPlan.friday || initialDietPlanState.friday,
          saturday: currentDietPlan.saturday || initialDietPlanState.saturday,
          sunday: currentDietPlan.sunday || initialDietPlanState.sunday,

          isActive: currentDietPlan.isActive ?? true,
        }
      : initialDietPlanState;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header with Back Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title={`${isEditMode ? "Update" : "Add"} Diet Plan`}
          description={
            isEditMode
              ? "Modify detail for this diet plan."
              : "Create a new diet plan."
          }
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            if (isEditMode) navigate(-1);
            else navigate("/plan/diet");
          }}
          aria-label="Back"
        >
          <LuArrowLeft size={16} />
          <span>{isEditMode ? "Back to Plan" : "View all Plans"}</span>
        </Button>
      </div>
      {/* Loading state in edit mode */}
      {isEditMode && planLoading && !currentDietPlan ? (
        <Container
          variant="secondary"
          className="rounded-3xl! p-12 flex flex-col items-center justify-center gap-4 min-h-90"
        >
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading diet plan for editing...
          </p>
        </Container>
      ) : (
        <DietPlanInner
          key={
            isEditMode ? currentDietPlan?.dietPlanId || planId : "new-diet-plan"
          }
          initialData={initialData}
          isEditMode={isEditMode}
          planId={planId}
        />
      )}
    </div>
  );
};

export default DietPlanForm;
