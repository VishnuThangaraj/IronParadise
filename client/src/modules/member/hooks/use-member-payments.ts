import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMemberPayments } from "../api/member-payment.api";
import { getMembershipPlans } from "@/modules/membership-plan/api/membership-plan.api";
import { memberKeys } from "../member.keys";
import type { MemberPaymentItem } from "../types/member-payment.types";

export const useMemberPayments = () => {
  const [viewMode, setViewMode] = useState<string>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  // Pay Modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedPaymentForPay, setSelectedPaymentForPay] =
    useState<MemberPaymentItem | null>(null);

  // Receipts Modal
  const [receiptsModalOpen, setReceiptsModalOpen] = useState(false);
  const [selectedPaymentForReceipts, setSelectedPaymentForReceipts] =
    useState<MemberPaymentItem | null>(null);

  // 1. Query for Member Payments
  const {
    data: paymentsResponse,
    isLoading: loadingPayments,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: memberKeys.payments(),
    queryFn: () => getMemberPayments(),
  });

  const payments: MemberPaymentItem[] = useMemo(
    () => paymentsResponse?.data || [],
    [paymentsResponse],
  );

  // 2. Query for Membership Plans (for dynamic filter options)
  const { data: plansResponse } = useQuery({
    queryKey: ["membership-plans-list"],
    queryFn: () => getMembershipPlans(),
  });

  const plans = useMemo(() => plansResponse?.data || [], [plansResponse]);

  // Modal Handlers
  const handleOpenPayModal = useCallback((payment: MemberPaymentItem) => {
    setSelectedPaymentForPay(payment);
    setPayModalOpen(true);
  }, []);

  const handleClosePayModal = useCallback(() => {
    setPayModalOpen(false);
    setSelectedPaymentForPay(null);
  }, []);

  const handleOpenReceiptsModal = useCallback((payment: MemberPaymentItem) => {
    setSelectedPaymentForReceipts(payment);
    setReceiptsModalOpen(true);
  }, []);

  const handleCloseReceiptsModal = useCallback(() => {
    setReceiptsModalOpen(false);
    setSelectedPaymentForReceipts(null);
  }, []);

  // Filtered Payments
  const filteredPayments = useMemo(() => {
    let result = payments;

    // Filter by payment status
    if (paymentStatusFilter !== "all") {
      result = result.filter(
        (p) =>
          (p.paymentStatus || "PENDING").toUpperCase() ===
          paymentStatusFilter.toUpperCase(),
      );
    }

    // Filter by membership plan
    if (planFilter !== "all") {
      result = result.filter(
        (p) => p.membershipPlan?.membershipPlanId === planFilter,
      );
    }

    // Filter by search query (member name, user ID, email, phone, plan name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.fullName && p.fullName.toLowerCase().includes(q)) ||
          (p.userId && p.userId.toLowerCase().includes(q)) ||
          (p.email && p.email.toLowerCase().includes(q)) ||
          (p.phoneNumber && p.phoneNumber.toLowerCase().includes(q)) ||
          (p.membershipPlan &&
            p.membershipPlan.planName.toLowerCase().includes(q)) ||
          (p.paymentId && p.paymentId.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [payments, paymentStatusFilter, planFilter, searchQuery]);

  return {
    payments,
    filteredPayments,
    plans,
    loading: loadingPayments || isRefetching,
    refetch,

    // Filters & View
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    paymentStatusFilter,
    setPaymentStatusFilter,
    planFilter,
    setPlanFilter,

    // Pay Modal
    payModalOpen,
    selectedPaymentForPay,
    handleOpenPayModal,
    handleClosePayModal,

    // Receipts Modal
    receiptsModalOpen,
    selectedPaymentForReceipts,
    handleOpenReceiptsModal,
    handleCloseReceiptsModal,
  };
};

export default useMemberPayments;
