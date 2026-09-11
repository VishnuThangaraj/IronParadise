import React, {
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
import {
  fetchTrainerById,
  fetchTrainers,
  createTrainer,
  updateTrainer,
} from "../redux/trainer.thunks";
import type { TrainerFormData } from "../types/trainer.types";

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
    if (!initialData) {
      dispatch(fetchTrainers());
    }
  }, [dispatch, initialData]);

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
    if (
      !currentTrainer ||
      (currentTrainer.userId?.toLowerCase() !== userId.toLowerCase() &&
        currentTrainer._id?.toLowerCase() !== userId.toLowerCase())
    ) {
      dispatch(fetchTrainerById(userId));
    }
  };

  // handle edit trainer button click
  const handleNavigateToEdit = (userId: string) => {
    fetchTrainerWithUserId(userId);
    navigate(`/trainer/edit/${userId}`);
  };

  // handle view trainer button click
  const handleNavigateToView = (userId: string) => {
    fetchTrainerWithUserId(userId);
    navigate(`/trainer/${userId}`);
  };

  // handle add trainer button click
  const handleNavigateToAdd = () => {
    navigate("/trainer/add");
  };

  // handle form input change
  const handleInputChange = (
    name: keyof TrainerFormState,
    value: string | number | boolean | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle shift time change
  const handleShiftTimeChange = (field: "start" | "end", value: string) => {
    setFormData((prev) => ({
      ...prev,
      shiftTime: {
        ...(prev.shiftTime || { start: "09:00", end: "17:00" }),
        [field]: value,
      },
    }));
  };

  // handle emergency contact change
  const handleEmergencyContactChange = (
    field: "fullName" | "phone" | "relation",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        fullName: prev.emergencyContact?.fullName || "",
        phone: prev.emergencyContact?.phone || "",
        relation: prev.emergencyContact?.relation || "",
        [field]: value,
      },
    }));
  };

  // handle specialization add/remove
  const handleAddSpecialization = (tag: string) => {
    const cleanTag = tag.trim();
    if (!cleanTag) return;
    setFormData((prev) => {
      if (prev.specialization?.includes(cleanTag)) return prev;
      return {
        ...prev,
        specialization: [...(prev.specialization || []), cleanTag],
      };
    });
  };

  const handleRemoveSpecialization = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialization: (prev.specialization || []).filter((_, i) => i !== index),
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
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: TrainerFormData = {
      fullName: formData.fullName,
      email: formData.email,
      gender: formData.gender,
      role: formData.role,
      permissions: formData.permissions,
      qualification: formData.qualification?.trim() || "General",
      specialization:
        formData.specialization && formData.specialization.length > 0
          ? formData.specialization
          : ["General"],
      shiftTime: {
        start:
          (formData.shiftTime?.start && formData.shiftTime.start.trim()) ||
          "09:00",
        end:
          (formData.shiftTime?.end && formData.shiftTime.end.trim()) || "17:00",
      },
      salary: Number(formData.salary) || 0,
      experienceYears: Number(formData.experienceYears) || 0,
      employmentStatus: formData.employmentStatus || "active",
      ...(formData.dob ? { dob: formData.dob } : {}),
      ...(formData.joinDate ? { joinDate: formData.joinDate } : {}),
      ...(formData.phone ? { phone: formData.phone } : {}),
      ...(formData.address ? { address: formData.address } : {}),
      ...(formData.profileImage ? { profileImage: formData.profileImage } : {}),
      emergencyContact:
        formData.emergencyContact?.fullName &&
        formData.emergencyContact?.phone &&
        formData.emergencyContact?.relation
          ? formData.emergencyContact
          : null,
    };

    try {
      if (isEditMode && userId) {
        await dispatch(
          updateTrainer({ userId, trainerData: payload }),
        ).unwrap();
        addToast({
          type: "success",
          message: "Trainer updated successfully!",
        });
      } else {
        await dispatch(createTrainer(payload)).unwrap();
        addToast({
          type: "success",
          message: "Trainer created successfully!",
        });
      }
      navigate("/trainer");
    } catch (err: unknown) {
      addToast({
        type: "error",
        message: getErrorMessage(err, "Failed to save trainer"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    handleShiftTimeChange,
    handleEmergencyContactChange,
    handleAddSpecialization,
    handleRemoveSpecialization,
    isSubmitting,
    handleSubmitTrainer,
  };
};

export default useTrainer;
