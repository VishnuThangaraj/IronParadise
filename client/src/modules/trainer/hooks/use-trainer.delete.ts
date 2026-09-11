import { useState } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/app/store";

import { useToast } from "@/shared/components/ui/toast";
import { useNavigation } from "@/shared/hooks/useNavigation";

import { deleteTrainerPermanently } from "@/modules/trainer/redux/trainer.thunks";

const useTrainerDelete = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();
  const { navigate } = useNavigation();

  const [isDeleting, setIsDeleting] = useState(false);
  const [navigateBack, setNavigateBack] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [openDeleteTrainerModal, setOpenDeleteTrainerModal] = useState(false);

  // Handle Trainer delete click
  const handleDeleteTrainerClick = (
    userId: string,
    navigateBack: boolean = false,
  ) => {
    setDeleteUserId(userId);
    setOpenDeleteTrainerModal(true);
    setNavigateBack(navigateBack);
  };

  // Handle Trainer delete
  const handleDeleteTrainer = async () => {
    if (!deleteUserId) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteTrainerPermanently(deleteUserId)).unwrap();
      addToast({
        type: "success",
        message: "Trainer deleted successfully.",
      });
      setOpenDeleteTrainerModal(false);
      setDeleteUserId(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : (err as { message?: string })?.message ||
              "Failed to permanently delete trainer.";
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
    deleteUserId,
    handleDeleteTrainer,
    openDeleteTrainerModal,
    handleDeleteTrainerClick,
    setOpenDeleteTrainerModal,
  };
};

export default useTrainerDelete;
