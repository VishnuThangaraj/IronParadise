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
      <div className="flex justify-between gap-5 w-full">
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
          </Container>
        </div>
        <div className="w-8/12">
          <DaySelector
            activeDay={activeDay as WeekDay}
            onSelectDay={setActiveDay}
          />
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
