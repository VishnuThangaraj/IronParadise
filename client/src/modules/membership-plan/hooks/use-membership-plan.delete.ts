import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { useToast } from "@/shared/components/ui/toast";
import { deleteMembershipPlanPermanently } from "../redux/membership-plan.thunks";

const useMembershipPlanDelete = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();

  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);
  const [openDeletePlanModal, setOpenDeletePlanModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Membership Plan delete click
  const handleDeletePlanClick = (planId: string) => {
    setDeletePlanId(planId);
    setOpenDeletePlanModal(true);
  };

  // Handle Membership Plan delete
  const handleDeletePlan = async () => {
    if (!deletePlanId) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteMembershipPlanPermanently(deletePlanId)).unwrap();
      addToast({
        type: "success",
        message: "Membership plan deleted successfully.",
      });
      setOpenDeletePlanModal(false);
      setDeletePlanId(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : (err as { message?: string })?.message ||
              "Failed to permanently delete membership plan.";
      addToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deletePlanId,
    handleDeletePlan,
    openDeletePlanModal,
    handleDeletePlanClick,
    setOpenDeletePlanModal,
  };
};

export default useMembershipPlanDelete;

