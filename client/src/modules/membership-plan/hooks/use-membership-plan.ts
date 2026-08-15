import { useEffect, useState } from "react";
import type { AppDispatch } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";

import {
  selectMembershipPlans,
  selectMembershipPlanLoading,
  selectMembershipPlanError,
} from "@/modules/membership-plan/redux/membership-plan.selector";
import { fetchMembershipPlans } from "@/modules/membership-plan/redux/membership-plan.thunks";

const useMembershipPlan = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const error = useSelector(selectMembershipPlanError);
  const loading = useSelector(selectMembershipPlanLoading);
  const membershipPlans = useSelector(selectMembershipPlans);

  useEffect(() => {
    dispatch(fetchMembershipPlans());
  }, [dispatch]);

  return {
    error,
    loading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    membershipPlans,
  };
};

export default useMembershipPlan;
