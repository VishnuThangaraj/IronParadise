import { useEffect, useState } from "react";
import type { AppDispatch } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";

import {
  selectMembershipPlans,
  selectMembershipPlanLoading,
  selectMembershipPlanError,
} from "@/modules/membership-plan/redux/membership-plan.selector";
import { fetchMembershipPlans } from "@/modules/membership-plan/redux/membership-plan.thunks";
import { useNavigation } from "@/shared/hooks/useNavigation";

const useMembershipPlan = () => {
  const { navigate } = useNavigation();

  const dispatch = useDispatch<AppDispatch>();
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");

  const error = useSelector(selectMembershipPlanError);
  const loading = useSelector(selectMembershipPlanLoading);
  const membershipPlans = useSelector(selectMembershipPlans);

  useEffect(() => {
    dispatch(fetchMembershipPlans());
  }, [dispatch]);

  // Handle Membership plan Edit button Click
  const handleNavigateToEdit = (planId: string) => {
    navigate(`/membership/${planId.toLowerCase()}`);
  };

  // Fire Delete Plan Modal and get confirmation
  // const handleDeletePlanConfirmation =

  // Handle Membership Plan delete
  const handleDeletePlan = async (planId: string) => {
    // const deleteConfirmation = await
  };

  return {
    error,
    loading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    membershipPlans,
    handleDeletePlan,
    handleNavigateToEdit,
  };
};

export default useMembershipPlan;
