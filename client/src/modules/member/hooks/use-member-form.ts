import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import { useToast } from "@/shared/components/ui/toast";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { getErrorMessage } from "@/shared/utils/error-handler";
import type { SelectOption } from "@/shared/components/ui/dropdown/SelectDropdown";
import { getMembershipPlans } from "@/modules/membership-plan/api/membership-plan.api";
import { getTrainers } from "@/modules/trainer/api/trainer.api";
import { getDietPlans } from "@/modules/diet-plan/api/diet-plan.api";
import { getWorkoutPlans } from "@/modules/workout-plan/api/workout-plan.api";

import {
  initialMemberState,
  type MemberFormState,
} from "../state/initial-member.state";
import { useCreateMember } from "./use-member.create";
import { useUpdateMember } from "./use-member.update";
import type { MemberFormData } from "../types/member.types";

/**
 * Calculates end date in YYYY-MM-DD format based on start date and duration in months.
 */
export const calculateSubscriptionEndDate = (
  startDateStr: string,
  durationMonths: number,
): string => {
  if (!startDateStr || !durationMonths || durationMonths <= 0) return "";
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return "";

  const end = new Date(start);
  end.setMonth(end.getMonth() + durationMonths);
  return end.toISOString().split("T")[0];
};

export const useMemberForm = (initialData?: MemberFormState) => {
  const { navigate } = useNavigation();
  const { addToast } = useToast();

  const [formData, setFormData] = useState<MemberFormState>(
    initialData ?? initialMemberState,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TanStack Query Mutations
  const createMemberMutation = useCreateMember();
  const updateMemberMutation = useUpdateMember();

  // 1. Fetch Membership Plans
  const {
    data: membershipPlansResponse,
    isLoading: isLoadingPlans,
  } = useQuery({
    queryKey: ["membership-plans", "dropdown"],
    queryFn: getMembershipPlans,
    staleTime: 5 * 60 * 1000,
  });

  const membershipPlans = useMemo(() => {
    return (membershipPlansResponse?.data || []).filter(
      (plan) => plan.isActive !== false,
    );
  }, [membershipPlansResponse]);

  // 2. Fetch Trainers
  const {
    data: trainersResponse,
    isLoading: isLoadingTrainers,
  } = useQuery({
    queryKey: ["trainers", "dropdown"],
    queryFn: getTrainers,
    staleTime: 5 * 60 * 1000,
  });

  const trainers = useMemo(() => {
    return (trainersResponse?.data || []).filter(
      (trainer) => trainer.isActive !== false,
    );
  }, [trainersResponse]);

  // 3. Fetch Diet Plans
  const {
    data: dietPlansResponse,
    isLoading: isLoadingDietPlans,
  } = useQuery({
    queryKey: ["diet-plans", "dropdown"],
    queryFn: getDietPlans,
    staleTime: 5 * 60 * 1000,
  });

  const dietPlans = useMemo(() => {
    return (dietPlansResponse?.data || []).filter(
      (plan) => plan.isActive !== false,
    );
  }, [dietPlansResponse]);

  // 4. Fetch Workout Plans
  const {
    data: workoutPlansResponse,
    isLoading: isLoadingWorkoutPlans,
  } = useQuery({
    queryKey: ["workout-plans", "dropdown"],
    queryFn: getWorkoutPlans,
    staleTime: 5 * 60 * 1000,
  });

  const workoutPlans = useMemo(() => {
    return (workoutPlansResponse?.data || []).filter(
      (plan) => plan.isActive !== false,
    );
  }, [workoutPlansResponse]);

  // Formatted Dropdown Options
  const membershipPlanOptions: SelectOption[] = useMemo(() => {
    const list: SelectOption[] = [
      { value: "", label: "-- Select Membership Plan --" },
    ];
    membershipPlans.forEach((plan) => {
      const durationLabel =
        plan.durationMonths === 1
          ? "1 Month"
          : `${plan.durationMonths} Months`;
      const priceLabel = `₹${plan.price.toLocaleString("en-IN")}`;
      list.push({
        value: plan.membershipPlanId,
        label: `${plan.planName} (${durationLabel} - ${priceLabel})`,
      });
    });
    return list;
  }, [membershipPlans]);

  const trainerOptions: SelectOption[] = useMemo(() => {
    const list: SelectOption[] = [
      { value: "", label: "None / No Trainer Assigned" },
    ];
    trainers.forEach((trainer) => {
      const spec =
        trainer.specialization && trainer.specialization.length > 0
          ? ` (${trainer.specialization[0]})`
          : "";
      list.push({
        value: trainer.userId,
        label: `${trainer.fullName}${spec}`,
      });
    });
    return list;
  }, [trainers]);

  const dietPlanOptions: SelectOption[] = useMemo(() => {
    const list: SelectOption[] = [
      { value: "", label: "None / No Diet Plan" },
    ];
    dietPlans.forEach((plan) => {
      list.push({
        value: plan.dietPlanId,
        label: plan.planName,
      });
    });
    return list;
  }, [dietPlans]);

  const workoutPlanOptions: SelectOption[] = useMemo(() => {
    const list: SelectOption[] = [
      { value: "", label: "None / No Workout Plan" },
    ];
    workoutPlans.forEach((plan) => {
      list.push({
        value: plan.workoutPlanId,
        label: plan.planName,
      });
    });
    return list;
  }, [workoutPlans]);

  // Input Handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === "startDate") {
      setFormData((prev) => {
        let newEndDate = prev.endDate;
        if (prev.membershipPlanId) {
          const selectedPlan = membershipPlans.find(
            (p) => p.membershipPlanId === prev.membershipPlanId,
          );
          if (selectedPlan) {
            newEndDate = calculateSubscriptionEndDate(
              value,
              selectedPlan.durationMonths,
            );
          }
        }
        return { ...prev, startDate: value, endDate: newEndDate };
      });
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (
    field: keyof MemberFormState,
    value: string,
  ) => {
    if (field === "membershipPlanId") {
      setFormData((prev) => {
        let newEndDate = prev.endDate;
        if (value) {
          const selectedPlan = membershipPlans.find(
            (p) => p.membershipPlanId === value,
          );
          if (selectedPlan && prev.startDate) {
            newEndDate = calculateSubscriptionEndDate(
              prev.startDate,
              selectedPlan.durationMonths,
            );
          }
        }
        return {
          ...prev,
          membershipPlanId: value,
          endDate: newEndDate,
        };
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  // Submit Handler
  const handleSubmitMember = async (
    e: FormEvent<HTMLFormElement>,
    isEditMode: boolean,
    memberId?: string,
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    const hasEmergencyContact =
      formData.emergencyContact?.fullName?.trim() &&
      formData.emergencyContact?.phone?.trim() &&
      formData.emergencyContact?.relation?.trim();

    const payload: MemberFormData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      gender: formData.gender,
      role: "member",
      permissions: formData.permissions,
      isActive: formData.isActive,
      ...(formData.phone?.trim() ? { phone: formData.phone.trim() } : {}),
      ...(formData.dob ? { dob: formData.dob } : {}),
      ...(formData.address?.trim() ? { address: formData.address.trim() } : {}),
      ...(formData.profileImage?.trim()
        ? { profileImage: formData.profileImage.trim() }
        : {}),
      ...(formData.membershipPlanId?.trim()
        ? { membershipPlanId: formData.membershipPlanId.trim() }
        : {}),
      ...(formData.dietPlanId?.trim()
        ? { dietPlanId: formData.dietPlanId.trim() }
        : {}),
      ...(formData.workoutPlanId?.trim()
        ? { workoutPlanId: formData.workoutPlanId.trim() }
        : {}),
      ...(formData.trainerId?.trim()
        ? { trainerId: formData.trainerId.trim() }
        : {}),
      ...(formData.startDate ? { startDate: formData.startDate } : {}),
      ...(formData.endDate ? { endDate: formData.endDate } : {}),
      emergencyContact: hasEmergencyContact
        ? {
            fullName: formData.emergencyContact!.fullName.trim(),
            phone: formData.emergencyContact!.phone.trim(),
            relation: formData.emergencyContact!.relation.trim(),
          }
        : null,
    };

    try {
      if (isEditMode && memberId) {
        await updateMemberMutation.mutateAsync({
          id: memberId,
          data: payload,
        });
        addToast({
          type: "success",
          message: "Member updated successfully!",
        });
      } else {
        await createMemberMutation.mutateAsync(payload);
        addToast({
          type: "success",
          message: "Member registered successfully!",
        });
      }
      navigate("/member/list");
    } catch (err: unknown) {
      addToast({
        type: "error",
        message: getErrorMessage(err, "Failed to save member"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting:
      isSubmitting ||
      createMemberMutation.isPending ||
      updateMemberMutation.isPending,
    isLoadingDependencies:
      isLoadingPlans ||
      isLoadingTrainers ||
      isLoadingDietPlans ||
      isLoadingWorkoutPlans,
    membershipPlans,
    membershipPlanOptions,
    trainerOptions,
    dietPlanOptions,
    workoutPlanOptions,
    handleInputChange,
    handleSelectChange,
    handleEmergencyContactChange,
    handleSubmitMember,
  };
};

export default useMemberForm;
