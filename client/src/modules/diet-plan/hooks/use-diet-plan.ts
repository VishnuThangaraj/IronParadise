import React, {
  useEffect,
  useMemo,
  useState,
  // type FormEvent,
  // type KeyboardEvent,
} from "react";
import type { AppDispatch } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";

import { useNavigation } from "@/shared/hooks/useNavigation";
// import { useToast } from "@/shared/components/ui/toast";

// import { formatDate } from "@/shared/utils/formatDate";

import {
  DietPlanFormState,
  initialDietPlanState,
} from "../state/initial-diet-plan.state";
import {
  selectCurrentDietPlan,
  selectDietPlanError,
  selectDietPlanLoading,
  selectDietPlans,
} from "../redux/diet-plan.selector";
import { fetchDietPlanById, fetchDietPlans } from "../redux/diet-plan.thunks";

const useDietPlan = (initialData: DietPlanFormState = initialDietPlanState) => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  // const { addToast } = useToast();

  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const error = useSelector(selectDietPlanError);
  const dietPlans = useSelector(selectDietPlans);
  const loading = useSelector(selectDietPlanLoading);
  const currentDietPlan = useSelector(selectCurrentDietPlan);

  // Form State
  const [formData, setFormData] = useState<DietPlanFormState>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchDietPlans());
  }, [dispatch]);

  // Table Filteration
  const filteredRows = useMemo(() => {
    let result = dietPlans;

    if (statusFilter === "active") {
      result = result.filter((plan) => plan.isActive);
    } else if (statusFilter === "inactive") {
      result = result.filter((plan) => !plan.isActive);
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return result;

    return result.filter((plan) => {
      const nameMatch = plan.planName?.toLowerCase().includes(query);
      const idMatch = plan.dietPlanId?.toLowerCase().includes(query);
      const goalMatch = plan.goal?.toLowerCase().includes(query);
      const descriptionMatch = plan.description?.toLowerCase().includes(query);

      return nameMatch || idMatch || goalMatch || descriptionMatch;
    });
  }, [dietPlans, searchQuery, statusFilter]);

  // fetch current diet plan with planId
  const fetchDietPlanWithPlanId = (planId: string) => {
    if (!currentDietPlan || currentDietPlan?.dietPlanId != planId) {
      dispatch(fetchDietPlanById(planId));
    }
  };

  // handle edit diet plan button click
  const handleNavigateToEdit = (planId: string) => {
    fetchDietPlanWithPlanId(planId);
    navigate(`/plan/diet/edit/${planId.toLocaleLowerCase()}`);
  };

  // handle view diet plan button click
  const handleNavigateToView = (planId: string) => {
    fetchDietPlanWithPlanId(planId);
    navigate(`/plan/diet/${planId.toLocaleLowerCase()}`);
  };

  // handle add diet plan button click
  const handleNavigateToAdd = () => {
    navigate("/plan/diet/add");
  };

  // handle form input change
  const handleInputChange = (
    name: keyof DietPlanFormState,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle diet plan status filter
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
    formData,
    setFormData,
    handleInputChange,
    currentDietPlan,
    isSubmitting,
    handleNavigateToAdd,
    handleNavigateToView,
    fetchDietPlanWithPlanId,
    handleActiveStatusFilter,
    handleNavigateToEdit,
  };
};

export default useDietPlan;
