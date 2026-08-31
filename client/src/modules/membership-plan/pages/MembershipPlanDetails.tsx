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
  LuIndianRupee,
  LuPencil,
  LuShieldCheck,
  LuSparkles,
  LuTag,
  LuTrash2,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import Chip from "@/shared/components/ui/chip/Chip";
import Container from "@/shared/components/ui/containers/Container";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import useMembershipPlan from "../hooks/use-membership-plan";
import useMembershipPlanDelete from "../hooks/use-membership-plan.delete";
import DeleteModal from "@/shared/components/ui/modals/DeleteModal";
import { fetchMembershipPlanById } from "../redux/membership-plan.thunks";

const MembershipPlanDetails = () => {
  const { planId } = useParams<{ planId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigation();
  const {
    loading,
    formatDate,
    handleNavigateToEdit,
    currentMembershipPlan,
  } = useMembershipPlan();
  const {
    isDeleting,
    handleDeletePlan,
    openDeletePlanModal,
    handleDeletePlanClick,
    setOpenDeletePlanModal,
  } = useMembershipPlanDelete();

  const fetchedPlanIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (planId && fetchedPlanIdRef.current !== planId) {
      const matchesCurrent =
        currentMembershipPlan &&
        (currentMembershipPlan.membershipPlanId.toLowerCase() ===
          planId.toLowerCase() ||
          currentMembershipPlan._id.toLowerCase() === planId.toLowerCase());

      if (!matchesCurrent) {
        fetchedPlanIdRef.current = planId;
        dispatch(fetchMembershipPlanById(planId));
      } else {
        fetchedPlanIdRef.current = planId;
      }
    }
  }, [planId, currentMembershipPlan, dispatch]);

  const monthlyEquivalent =
    currentMembershipPlan && currentMembershipPlan.durationMonths > 0
      ? (
          Number(currentMembershipPlan.price) /
          currentMembershipPlan.durationMonths
        ).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <PageHeader
            title="Membership Plan Details"
            description="View and manage detailed information, features, and pricing for this plan."
          />
        </div>
        <div className="flex items-center gap-3">


          {currentMembershipPlan && (
            <>
              <Tooltip title="Edit this plan">
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() =>
                    handleNavigateToEdit(currentMembershipPlan.membershipPlanId)
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
                    handleDeletePlanClick(
                      currentMembershipPlan.membershipPlanId,
                      true,
                    )
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
      {loading && !currentMembershipPlan ? (
        <Container
          variant="secondary"
          className="w-full! max-w-full! mx-0! rounded-3xl! p-12 flex flex-col items-center justify-center gap-4 min-h-90"
        >
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading membership plan details...
          </p>
        </Container>
      ) : !currentMembershipPlan ? (
        <Container
          variant="secondary"
          className="w-full! max-w-full! mx-0! rounded-3xl! p-12 flex flex-col items-center justify-center text-center gap-4 min-h-90"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <LuTag size={32} />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Plan Not Found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
              The requested membership plan could not be found or may have been
              removed.
            </p>
          </div>
          <Button
            variant="primary-light"
            size="sm"
            onClick={() => navigate("/membership")}
          >
            <LuArrowLeft size={16} />
            <span>Return to Membership Plans</span>
          </Button>
        </Container>
      ) : (
        <Container
          variant="secondary"
          className="w-full! max-w-full! mx-0! rounded-3xl! flex flex-col gap-8 p-6 sm:p-8 md:p-10 shadow-xl"
        >
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div
                className={`w-13 h-13 sm:w-17 sm:h-17  rounded-3xl ${getDeterministicGradient(
                  currentMembershipPlan._id ||
                    currentMembershipPlan.membershipPlanId,
                )} flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0`}
              >
                <LuCrown className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {currentMembershipPlan.planName}
                  </h2>
                  <Chip
                    variant={
                      currentMembershipPlan.isActive ? "active" : "inactive"
                    }
                    size="sm"
                    dot={true}
                    label={
                      currentMembershipPlan.isActive ? "Active" : "Inactive"
                    }
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    ID: {currentMembershipPlan.membershipPlanId}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Pricing Tag */}
            <div className="flex flex-col items-start md:items-end">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Plan Cost
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                ₹
                {Number(currentMembershipPlan.price).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Duration Card */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <LuClock size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Duration
                </span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {currentMembershipPlan.durationMonths}{" "}
                  {currentMembershipPlan.durationMonths === 1
                    ? "Month"
                    : "Months"}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Standard billing cycle
                </span>
              </div>
            </div>

            {/* Effective Rate Card */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <LuIndianRupee size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Effective Rate
                </span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {monthlyEquivalent
                    ? `₹${monthlyEquivalent}`
                    : `₹${Number(currentMembershipPlan.price).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                    {" "}
                    / mo
                  </span>
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {currentMembershipPlan.durationMonths > 1
                    ? `Calculated across ${currentMembershipPlan.durationMonths} months`
                    : "Standard monthly billing"}
                </span>
              </div>
            </div>

            {/* Status Card */}
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-sm">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  currentMembershipPlan.isActive
                    ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"
                }`}
              >
                <LuShieldCheck size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Status
                </span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {currentMembershipPlan.isActive ? "Active Plan" : "Inactive"}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {currentMembershipPlan.isActive
                    ? "Available for enrollment"
                    : "Hidden from enrollment"}
                </span>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LuSparkles className="text-indigo-500 dark:text-indigo-400 w-5 h-5" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Plan Features & Privileges
                </h3>
              </div>
              {currentMembershipPlan.features?.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                  {currentMembershipPlan.features.length}{" "}
                  {currentMembershipPlan.features.length === 1
                    ? "Feature"
                    : "Features"}
                </span>
              )}
            </div>

            {currentMembershipPlan.features &&
            currentMembershipPlan.features.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentMembershipPlan.features.map((feature, idx) => (
                  <div
                    key={`plan-feature-${idx}`}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/40 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <LuCheck size={16} className="stroke-[2.5]" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center flex flex-col items-center gap-2">
                <LuTag className="text-slate-400 dark:text-slate-500 w-6 h-6" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No specific features have been listed for this membership
                  plan.
                </p>
              </div>
            )}
          </div>

          {/* Audit & Timestamps Footer */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-1.5">
                <LuCalendar size={14} className="text-slate-400" />
                <span>
                  Created:{" "}
                  <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                    {formatDate(currentMembershipPlan.createdAt)}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <LuClock size={14} className="text-slate-400" />
                <span>
                  Last Updated:{" "}
                  <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                    {formatDate(currentMembershipPlan.updatedAt)}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </Container>
      )}

      {/* Plan Deletion Confirmation Modal */}
      <DeleteModal
        open={openDeletePlanModal}
        loading={isDeleting}
        onClose={() => setOpenDeletePlanModal(false)}
        onConfirm={handleDeletePlan}
        title="Delete Membership Plan"
        content="Are you sure you want to delete this membership plan? This action cannot be undone."
      />
    </div>
  );
};

export default MembershipPlanDetails;
