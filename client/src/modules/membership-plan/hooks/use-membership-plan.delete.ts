import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store";
import { useToast } from "@/shared/components/ui/toast";
import { deleteMembershipPlanPermanently } from "../redux/membership-plan.thunks";
import { useNavigation } from "@/shared/hooks/useNavigation";

const useMembershipPlanDelete = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();
  const { navigate } = useNavigation();

  const [isDeleting, setIsDeleting] = useState(false);
  const [navigateBack, setNavigateBack] = useState(false);
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);
  const [openDeletePlanModal, setOpenDeletePlanModal] = useState(false);

  // Handle Membership Plan delete click
  const handleDeletePlanClick = (
    planId: string,
    navigateBack: boolean = false,
  ) => {
    setDeletePlanId(planId);
    setOpenDeletePlanModal(true);
    setNavigateBack(navigateBack);
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
      if (navigateBack) navigate(-1);
      setIsDeleting(false);
      setNavigateBack(false);
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
