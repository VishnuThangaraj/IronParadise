import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import {
  LuArrowLeft,
  LuCalendar,
  LuCheck,
  LuClock,
  LuCrown,
  LuFileText,
  LuIndianRupee,
  LuPencil,
  LuShieldCheck,
  LuSparkles,
  LuTag,
  LuTrash2,
} from "react-icons/lu";

import { LuUtensils } from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import DeleteModal from "@/shared/components/ui/modals/DeleteModal";
import Container from "@/shared/components/ui/containers/Container";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";

import useDietPlan from "@/modules/diet-plan/hooks/use-diet-plan";
import useDietPlanDelete from "@/modules/diet-plan/hooks/use-diet-plan.delete";
import { fetchDietPlanById } from "@/modules/diet-plan/redux/diet-plan.thunks";
import Skeleton from "@/shared/components/ui/feedback/Skeleton";
import DaySelector from "@/shared/components/ui/date/DaySelector";
import type { WeekDay } from "@/shared/components/ui/date/constants/week-days";
import { meals } from "../constants/diet-plan.meals";

const DietPlanDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { planId } = useParams<{ planId: string }>();

  const {
    loading,
    activeDay,
    setActiveDay,
    currentDietPlan,
    handleNavigateToEdit,
  } = useDietPlan();
  const {
    isDeleting,
    handleDeletePlan,
    openDeletePlanModal,
    handleDeletePlanClick,
    setOpenDeletePlanModal,
  } = useDietPlanDelete();

  const fetchedPlanIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (planId && fetchedPlanIdRef.current !== planId) {
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
  }, [planId, currentDietPlan, dispatch]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Actions Bar */}{" "}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <PageHeader
            title="Diet Plan Details"
            description="View and manage detailed information, goal, and description for this plan."
          />
        </div>
        <div className="flex items-center gap-3">
          {currentDietPlan && (
            <>
              <Tooltip title="Edit this plan">
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() =>
                    handleNavigateToEdit(currentDietPlan.dietPlanId)
                  }
                  aria-label="Edit Plan"
                >
                  <LuPencil size={15} /> Edit
                </Button>
              </Tooltip>
              <Tooltip title="Delete this plan">
                <Button
                  variant="red"
                  size="sm"
                  onClick={() =>
                    handleDeletePlanClick(currentDietPlan.dietPlanId, true)
                  }
                  aria-label="Delete Plan"
                >
                  <LuTrash2 size={15} />
                </Button>
              </Tooltip>
            </>
          )}
        </div>
      </div>
      {/* Main Content Area */}
      <div className="flex justify-between gap-6 w-full">
        <div className="w-4/12">
          <Container className="flex flex-col p-6!">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <LuUtensils className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Plan Information
              </h2>
            </div>
            <div className="space-y-3.5 pt-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Diet Plan Name
                </span>
                <Skeleton loading={loading}>
                  <span className="text-sm font-bold text-slate-800 block mt-0.5">
                    {currentDietPlan?.planName || "-"}
                  </span>
                </Skeleton>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Goal Target
                </span>
                <Skeleton loading={loading}>
                  <span className="text-xs font-bold text-primary bg-indigo-50/70 border border-indigo-100 px-2 py-0.5 rounded-md inline-block mt-1 uppercase tracking-wider">
                    {currentDietPlan?.goal || "-"}
                  </span>
                </Skeleton>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Description
                </span>
                <Skeleton loading={loading}>
                  <p className="text-xs font-medium text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">
                    {currentDietPlan?.description || "No description provided."}
                  </p>
                </Skeleton>
              </div>
            </div>
            {/* Active Day Nutrition Summary Card */}
          </Container>
          {/* <DayTotals activeDay={activeDay} totals={activeTotals} /> */}
          <div>f</div>
        </div>
        <div className="flex flex-col w-8/12 gap-6">
          <DaySelector
            activeDay={activeDay as WeekDay}
            onSelectDay={setActiveDay}
          />
          <div className="flex flex-col gap-6">
            <div className="ms-3 flex gap-2.5 items-center">
              <LuCalendar className="w-4 h-4 text-primary" />
              <div className="uppercase text-sm font-semibold tracking-wider">
                Scheduled Meals {`(${activeDay})`}
              </div>
            </div>

            {/* Meals */}
            <div className="grid grid-cols-2 gap-6 w-full">
              {meals.map((meal) => {
                const items = currentDietPlan?.[activeDay]?.[meal] || [];

                return (
                  <Container
                    key={`dpl-meal-${meal}`}
                    className="flex-col p-5! gap-2"
                  >
                    <div className="flex gap-2.5 items-center">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <div className="uppercase font-semibold text-sm">
                        {meal}
                      </div>
                    </div>

                    {/* Meal Items */}
                    <div className="flex-1 space-y-3 min-h-20">
                      {items.length === 0 ? (
                        <div className="h-full min-h-20 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[10px] font-medium p-4 text-center">
                          No items scheduled for this meal.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {items.map((item, index) => {
                            return (
                              <div
                                key={`dpl-item-${index}`}
                                className="flex bg-slate-200/60 border border-slate-300/80 rounded-xl p-3 flex-col items-start justify-between gap-2.5 hover:bg-slate-200 transition-all duration-200"
                              >
                                <div className="text-[11px] font-semibold">
                                  {item.name}
                                </div>
                                {/* metrics */}
                                <div className="flex flex-col gap-1.5 text-[10px] font-bold">
                                  {item.quantity && (
                                    <div>
                                      <span className="bg-slate-300/60 px-1.5 py-0.5 rounded-md">
                                        Qty: {item.quantity}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex gap-1.5 ps-0.5 tracking-wide">
                                    <span className="text-orange-600">
                                      {item.calories} kcal
                                    </span>
                                    <span>•</span>
                                    <span>P: {item.protein}g</span>
                                    <span>•</span>
                                    <span>C: {item.carbs}g</span>
                                    <span>•</span>
                                    <span>F: {item.fat}g</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </Container>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Plan Deletion Confirmation Modal */}
      <DeleteModal
        open={openDeletePlanModal}
        loading={isDeleting}
        onClose={() => setOpenDeletePlanModal(false)}
        onConfirm={handleDeletePlan}
        title="Delete Diet Plan"
        content="Are you sure you want to delete this diet plan? This action cannot be undone."
      />
    </div>
  );
};

export default DietPlanDetails;
