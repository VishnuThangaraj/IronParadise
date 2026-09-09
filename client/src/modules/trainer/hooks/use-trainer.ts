import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import type { AppDispatch } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";

import { formatDate } from "@/shared/utils/formatDate";
import { useToast } from "@/shared/components/ui/toast";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { getErrorMessage } from "@/shared/utils/error-handler";

import {
  initialTrainerState,
  TrainerFormState,
} from "../state/initial-trainer.state";
import {
  selectCurrentTrainer,
  selectTrainerError,
  selectTrainerLoading,
  selectTrainers,
} from "../redux/trainer.selector";
import { fetchTrainerById, fetchTrainers } from "../redux/trainer.thunks";

const useTrainer = (initialData?: TrainerFormState) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const trainers = useSelector(selectTrainers);
  const error = useSelector(selectTrainerError);
  const loading = useSelector(selectTrainerLoading);
  const currentTrainer = useSelector(selectCurrentTrainer);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TrainerFormState>(
    initialData ?? initialTrainerState,
  );

  useEffect(() => {
    dispatch(fetchTrainers());
  }, [dispatch]);

  // table filteration
  const filteredRows = useMemo(() => {
    let result = trainers;

    if (statusFilter === "active") {
      result = result.filter((trainer) => trainer.isActive);
    } else if (statusFilter === "inactive") {
      result = result.filter((trainer) => !trainer.isActive);
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return result;

    return result.filter((trainer) => {
      const nameMatch = trainer.fullName?.toLowerCase().includes(query);
      const idMatch = trainer.userId?.toLowerCase().includes(query);
      const emailMatch = trainer.email?.toLowerCase().includes(query);
      const phoneMatch = trainer.phone?.toLowerCase().includes(query);

      return nameMatch || idMatch || emailMatch || phoneMatch;
    });
  }, [trainers, searchQuery, statusFilter]);

  // fetch current trainer with userId
  const fetchTrainerWithUserId = (userId: string) => {
    if (!currentTrainer || currentTrainer?.userId != userId) {
      dispatch(fetchTrainerById(userId));
    }
  };

  // handle edit trainer button click
  const handleNavigateToEdit = (userId: string) => {
    fetchTrainerWithUserId(userId);
    navigate(`/trainer/edit/${userId.toLocaleLowerCase()}`);
  };

  // handle view trainer button click
  const handleNavigateToView = (userId: string) => {
    fetchTrainerWithUserId(userId);
    navigate(`/trainer/${userId.toLocaleLowerCase()}`);
  };

  // handle add trainer button click
  const handleNavigateToAdd = () => {
    navigate("/trainer/add");
  };

  // handle form input change
  const handleInputChange = (
    name: keyof TrainerFormState,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle traienr status filter
  const handleActiveStatusFilter = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const activeStatus = event?.target?.value || "all";
    setStatusFilter(activeStatus);
  };

  // handle form submission (Create or Update)
  const handleSubmitTrainer = async (
    e: FormEvent<HTMLFormElement>,
    isEditMode: boolean,
    userId?: string,
  ) => {};

  return {
    error,
    loading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    formatDate,
    statusFilter,
    setStatusFilter,
    filteredRows,
    fetchTrainerWithUserId,
    handleNavigateToEdit,
    handleNavigateToView,
    handleNavigateToAdd,
    handleActiveStatusFilter,

    // Form-specific state and actions
    formData,
    setFormData,
    handleInputChange,
    isSubmitting,
    handleSubmitTrainer,
  };
};

export default useTrainer;
