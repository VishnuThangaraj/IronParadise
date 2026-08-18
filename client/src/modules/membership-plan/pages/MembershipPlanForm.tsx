import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuCheck,
  LuCrown,
  LuPlus,
  LuSave,
  LuSparkles,
  LuTag,
  LuX,
} from "react-icons/lu";
import { Checkbox } from "@mui/material";

import Button from "@/shared/components/ui/buttons/Button";
import Chip from "@/shared/components/ui/chip/Chip";
import Container from "@/shared/components/ui/containers/Container";
import FormField from "@/shared/components/ui/forms/FormField";
import Input from "@/shared/components/ui/forms/Input";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";

import membershipPlanFields, {
  type MembershipPlanField,
} from "../constants/membership-plan.fields";
import useMembershipPlan from "../hooks/use-membership-plan";
import initialMembershipPlanState, {
  type MembershipPlanFormState,
} from "../state/initial-membership-plan.state";

interface MembershipPlanFormInnerProps {
  initialData: MembershipPlanFormState;
  isEditMode: boolean;
  planId?: string;
}

const MembershipPlanFormInner = ({
  initialData,
  isEditMode,
  planId,
}: MembershipPlanFormInnerProps) => {
  const { navigate } = useNavigation();
  const {
    formData,
    featureInput,
    isSubmitting,
    setFeatureInput,
    handleInputChange,
    handleAddFeature,
    handleFeatureKeyDown,
    handleRemoveFeature,
    handleSubmitPlan,
  } = useMembershipPlan(initialData);

  return (
    <form
      onSubmit={(e) => handleSubmitPlan(e, isEditMode, planId)}
      className="flex flex-col gap-6"
    >
      <Container
        variant="secondary"
        className="rounded-3xl! p-6 sm:p-8 md:p-10 flex flex-col gap-8 shadow-xl"
      >
        {/* Section 1: Basic Information */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200/80 dark:border-white/10">
            <LuTag className="text-indigo-500 dark:text-indigo-400 w-5 h-5" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Plan Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
            {membershipPlanFields.map((field: MembershipPlanField) => {
              const value =
                formData[field.name as keyof MembershipPlanFormState];
              return (
                <FormField key={`form-field-${field.name}`} size={field.size}>
                  <Input
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    value={value !== undefined ? String(value) : ""}
                    onChange={(e) =>
                      handleInputChange(
                        field.name as keyof MembershipPlanFormState,
                        field.type === "number"
                          ? e.target.value === ""
                            ? ""
                            : Number(e.target.value)
                          : e.target.value,
                      )
                    }
                    placeholder={field.placeholder}
                    labelClassName="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider"
                    required
                  />
                </FormField>
              );
            })}
          </div>

          {/* Status Switch / Checkbox */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 select-none">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Plan Active Status
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formData.isActive
                  ? "Plan is active and visible for new member enrollments"
                  : "Plan is disabled / archived and hidden from public catalog"}
              </span>
            </div>
            <div className="flex items-center gap-3">
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

        {/* Section 2: Features & Inclusions */}
        <div className="flex flex-col gap-5 pt-4 border-t border-slate-200/80 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LuSparkles className="text-indigo-500 dark:text-indigo-400 w-5 h-5" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Plan Features & Privileges
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {formData.features.length}{" "}
              {formData.features.length === 1 ? "Feature" : "Features"} added
            </span>
          </div>

          {/* Add Feature Input Row */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                name="featureInput"
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={handleFeatureKeyDown}
                placeholder="e.g. Free Personal Trainer Consultation, 24/7 Access..."
              />
            </div>
            <Button
              type="button"
              variant="blue"
              size="md"
              onClick={handleAddFeature}
              aria-label="Add Feature"
            >
              <LuPlus size={16} />
              <span>Add</span>
            </Button>
          </div>

          {/* Features Chip List */}
          {formData.features.length > 0 ? (
            <div className="flex flex-wrap gap-2.5 pt-2">
              {formData.features.map((feature, idx) => (
                <span
                  key={`feature-tag-${idx}`}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/70 dark:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-white/15 shadow-xs transition-all hover:border-indigo-500/40"
                >
                  <LuCheck
                    size={14}
                    className="text-emerald-500 shrink-0 font-bold"
                  />
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="w-4 h-4 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                    aria-label={`Remove feature ${feature}`}
                  >
                    <LuX size={12} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50/60 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/15 text-center text-xs text-slate-400 dark:text-slate-500">
              No features added yet. Type a feature above and click{" "}
              <strong>Add</strong> or press <strong>Enter</strong>.
            </div>
          )}
        </div>

        {/* Section 3: Live Preview Box */}
        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-500/20">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
            <LuCrown size={15} />
            <span>Live Card Preview</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${getDeterministicGradient(
                  formData.planName || "New Plan",
                )} flex items-center justify-center text-white shadow-sm shrink-0`}
              >
                <LuCrown size={18} />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {formData.planName || "Untitled Membership Plan"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formData.durationMonths
                    ? `${formData.durationMonths} ${
                        Number(formData.durationMonths) === 1
                          ? "Month"
                          : "Months"
                      }`
                    : "Duration not set"}{" "}
                  • {formData.features.length} perks included
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                ₹
                {formData.price !== ""
                  ? Number(formData.price).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Action Buttons */}
        <div className="flex justify-end items-center gap-3 pt-6 border-t border-slate-200/80 dark:border-white/10">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() =>
              navigate(
                isEditMode && planId
                  ? `/membership/${planId.toLowerCase()}`
                  : "/membership",
              )
            }
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
          >
            <LuSave size={16} />
            <span>{isEditMode ? "Update Plan" : "Create Plan"}</span>
          </Button>
        </div>
      </Container>
    </form>
  );
};

const MembershipPlanForm = () => {
  const { planId } = useParams<{ planId: string }>();
  const isEditMode = Boolean(planId);
  const { navigate } = useNavigation();

  const {
    currentMembershipPlan,
    loading: planLoading,
    handleFetchPlanById,
  } = useMembershipPlan();

  useEffect(() => {
    if (
      isEditMode &&
      planId &&
      (!currentMembershipPlan ||
        currentMembershipPlan.membershipPlanId.toLowerCase() !==
          planId.toLowerCase())
    ) {
      handleFetchPlanById(planId);
    }
  }, [isEditMode, planId, currentMembershipPlan, handleFetchPlanById]);

  const initialData: MembershipPlanFormState =
    isEditMode && currentMembershipPlan
      ? {
          planName: currentMembershipPlan.planName || "",
          durationMonths: currentMembershipPlan.durationMonths ?? "",
          price: currentMembershipPlan.price ?? "",
          features: currentMembershipPlan.features
            ? [...currentMembershipPlan.features]
            : [],
          isActive: currentMembershipPlan.isActive ?? true,
        }
      : initialMembershipPlanState;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header with Back Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title={`${isEditMode ? "Update" : "Add"} Membership Plan`}
          description={
            isEditMode
              ? "Modify details, pricing, and features for this membership plan."
              : "Create a new membership tier and configure its pricing and perks."
          }
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            navigate(
              isEditMode && planId
                ? `/membership/${planId.toLowerCase()}`
                : "/membership",
            )
          }
          aria-label="Back"
        >
          <LuArrowLeft size={16} />
          <span>{isEditMode ? "Back to Details" : "Back to Plans"}</span>
        </Button>
      </div>

      {/* Loading state in edit mode */}
      {isEditMode && planLoading && !currentMembershipPlan ? (
        <Container
          variant="secondary"
          className="rounded-3xl! p-12 flex flex-col items-center justify-center gap-4 min-h-90"
        >
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading membership plan for editing...
          </p>
        </Container>
      ) : (
        <MembershipPlanFormInner
          key={
            isEditMode
              ? currentMembershipPlan?.membershipPlanId || planId
              : "new-membership-plan"
          }
          initialData={initialData}
          isEditMode={isEditMode}
          planId={planId}
        />
      )}
    </div>
  );
};

export default MembershipPlanForm;
