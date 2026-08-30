import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import type { AppDispatch } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";

import {
  selectMembershipPlans,
  selectMembershipPlanLoading,
  selectMembershipPlanError,
  selectCurrentMembershipPlan,
} from "@/modules/membership-plan/redux/membership-plan.selector";
import {
  fetchMembershipPlans,
  fetchMembershipPlanById,
  createMembershipPlan,
  updateMembershipPlan,
} from "@/modules/membership-plan/redux/membership-plan.thunks";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { useToast } from "@/shared/components/ui/toast";
import initialMembershipPlanState, {
  type MembershipPlanFormState,
} from "../state/initial-membership-plan.state";
import { formatDate } from "@/shared/utils/formatDate";

const useMembershipPlan = (
  initialData: MembershipPlanFormState = initialMembershipPlanState,
) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const error = useSelector(selectMembershipPlanError);
  const loading = useSelector(selectMembershipPlanLoading);
  const membershipPlans = useSelector(selectMembershipPlans);
  const currentMembershipPlan = useSelector(selectCurrentMembershipPlan);

  // Form State
  const [formData, setFormData] =
    useState<MembershipPlanFormState>(initialData);
  const [featureInput, setFeatureInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMembershipPlans());
  }, [dispatch]);

  // Table Filteration
  const filteredRows = useMemo(() => {
    let result = membershipPlans;

    if (statusFilter === "active") {
      result = result.filter((plan) => plan.isActive);
    } else if (statusFilter === "inactive") {
      result = result.filter((plan) => !plan.isActive);
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return result;

    return result.filter((plan) => {
      const nameMatch = plan.planName?.toLowerCase().includes(query);
      const idMatch = plan.membershipPlanId?.toLowerCase().includes(query);
      const durationMatch =
        String(plan.durationMonths).includes(query) ||
        `${plan.durationMonths} month`.includes(query);
      const priceMatch = String(plan.price).includes(query);
      const featuresMatch = plan.features?.some((feature) =>
        feature.toLowerCase().includes(query),
      );

      return (
        nameMatch || idMatch || durationMatch || priceMatch || featuresMatch
      );
    });
  }, [membershipPlans, searchQuery, statusFilter]);

  // Fetch current Membership Plan with PlanId
  const fetchMembershipPlanWithPlanId = (planId: string) => {
    if (
      !currentMembershipPlan ||
      currentMembershipPlan?.membershipPlanId !== planId
    ) {
      dispatch(fetchMembershipPlanById(planId));
    }
  };

  // Handle Membership plan Edit button Click
  const handleNavigateToEdit = (planId: string) => {
    fetchMembershipPlanWithPlanId(planId);
    navigate(`/membership/edit/${planId.toLowerCase()}`);
  };

  // Handle View Membership Plan button click
  const handleNavigateToView = (planId: string) => {
    fetchMembershipPlanWithPlanId(planId);
    navigate(`/membership/${planId.toLowerCase()}`);
  };

  // handle add membership plan button click
  const handleNavigateToAdd = () => {
    navigate("/membership/add");
  };

  // Handle form input change
  const handleInputChange = (
    name: keyof MembershipPlanFormState,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding a feature
  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) {
      addToast({
        type: "warning",
        message: "Please enter a feature description before adding.",
      });
      return;
    }

    if (
      formData.features.some((f) => f.toLowerCase() === trimmed.toLowerCase())
    ) {
      addToast({
        type: "warning",
        message: "This feature is already added.",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, trimmed],
    }));
    setFeatureInput("");
  };

  // Handle Enter key on feature input
  const handleFeatureKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  // Handle removing a feature
  const handleRemoveFeature = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Handle form submission (Create or Update)
  const handleSubmitPlan = async (
    e: FormEvent<HTMLFormElement>,
    isEditMode: boolean,
    planId?: string,
  ) => {
    e.preventDefault();

    if (!formData.planName.trim()) {
      addToast({
        type: "error",
        message: "Plan name is required.",
      });
      return;
    }

    const duration = Number(formData.durationMonths);
    if (!duration || duration <= 0 || !Number.isInteger(duration)) {
      addToast({
        type: "error",
        message:
          "Please enter a valid duration (positive whole number of months).",
      });
      return;
    }

    const price = Number(formData.price);
    if (formData.price === "" || Number.isNaN(price) || price < 0) {
      addToast({
        type: "error",
        message: "Please enter a valid plan price (0 or greater).",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && planId) {
        await dispatch(
          updateMembershipPlan({
            membershipPlanId: planId,
            planData: {
              planName: formData.planName.trim(),
              durationMonths: duration,
              price,
              features: formData.features,
              isActive: formData.isActive,
            },
          }),
        ).unwrap();

        addToast({
          type: "success",
          message: "Membership plan updated successfully!",
        });
        navigate(`/membership/${planId.toLowerCase()}`);
      } else {
        await dispatch(
          createMembershipPlan({
            membershipPlanId: "",
            planName: formData.planName.trim(),
            durationMonths: duration,
            price,
            features: formData.features,
            isActive: formData.isActive,
          }),
        ).unwrap();

        addToast({
          type: "success",
          message: "Membership plan created successfully!",
        });
        navigate("/membership");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message ||
            `Failed to ${isEditMode ? "update" : "create"} membership plan.`;
      addToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // handle membership plan status filter
  const handleActiveStatusFilter = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const activeStatus = event?.target?.value || "all";
    setStatusFilter(activeStatus);
  };

  return {
    error,
    loading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filteredRows,
    currentMembershipPlan,
    formData,
    setFormData,
    featureInput,
    formatDate,
    setFeatureInput,
    isSubmitting,
    handleInputChange,
    handleAddFeature,
    handleFeatureKeyDown,
    handleRemoveFeature,
    handleSubmitPlan,
    handleNavigateToAdd,
    handleNavigateToEdit,
    handleNavigateToView,
    handleActiveStatusFilter,
    fetchMembershipPlanWithPlanId,
  };
};

export default useMembershipPlan;
