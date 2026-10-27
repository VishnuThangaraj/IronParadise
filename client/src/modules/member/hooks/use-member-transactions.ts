import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMemberPaymentReceipts } from "../api/member-payment.api";
import { memberKeys } from "../member.keys";
import type { MemberPaymentReceipt } from "../types/member-payment.types";

export const useMemberTransactions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");

  // Selected receipt for Invoice Preview/Print Modal
  const [selectedReceipt, setSelectedReceipt] =
    useState<MemberPaymentReceipt | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // TanStack Query for all member receipts
  const {
    data: response,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: memberKeys.receipts(),
    queryFn: () => getMemberPaymentReceipts(),
  });

  const receipts: MemberPaymentReceipt[] = useMemo(
    () => response?.data || [],
    [response],
  );

  // Unique payment months for filter dropdown
  const paymentMonths = useMemo(() => {
    const set = new Set<string>();
    receipts.forEach((r) => {
      if (r.paymentDate) {
        const d = new Date(r.paymentDate);
        if (!isNaN(d.getTime())) {
          const m = d.toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          });
          set.add(m);
        }
      }
    });
    return Array.from(set);
  }, [receipts]);

  // Aggregate Metrics for Transactions
  const metrics = useMemo(() => {
    let totalCollected = 0;
    let upiTotal = 0;
    let bankTransferTotal = 0;
    let cashCardTotal = 0;
    let todayTotal = 0;

    const todayStr = new Date().toISOString().slice(0, 10);

    receipts.forEach((r) => {
      const amt = Number(r.amountPaid) || 0;
      totalCollected += amt;

      const method = (r.paymentMethod || "").toUpperCase();
      if (method === "UPI") {
        upiTotal += amt;
      } else if (method === "BANK_TRANSFER") {
        bankTransferTotal += amt;
      } else {
        cashCardTotal += amt;
      }

      if (r.paymentDate) {
        const dateStr = new Date(r.paymentDate).toISOString().slice(0, 10);
        if (dateStr === todayStr) {
          todayTotal += amt;
        }
      }
    });

    return {
      totalCollected,
      upiTotal,
      bankTransferTotal,
      cashCardTotal,
      todayTotal,
      count: receipts.length,
    };
  }, [receipts]);

  // Filtered receipts
  const filteredReceipts = useMemo(() => {
    let list = receipts;

    // Filter by payment method
    if (paymentMethodFilter !== "all") {
      list = list.filter(
        (r) =>
          (r.paymentMethod || "").toUpperCase() ===
          paymentMethodFilter.toUpperCase(),
      );
    }

    // Filter by month
    if (monthFilter !== "all") {
      list = list.filter((r) => {
        if (!r.paymentDate) return false;
        const d = new Date(r.paymentDate);
        if (isNaN(d.getTime())) return false;
        const m = d.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });
        return m === monthFilter;
      });
    }

    // Filter by search query (receipt number, member name, user ID, reference number)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          (r.receiptNumber && r.receiptNumber.toLowerCase().includes(q)) ||
          (r.fullName && r.fullName.toLowerCase().includes(q)) ||
          (r.userId && r.userId.toLowerCase().includes(q)) ||
          (r.paymentId && r.paymentId.toLowerCase().includes(q)) ||
          (r.referenceNumber && r.referenceNumber.toLowerCase().includes(q)) ||
          (r.planName && r.planName.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [receipts, paymentMethodFilter, monthFilter, searchQuery]);

  // Invoice Handlers
  const handleOpenInvoice = useCallback((receipt: MemberPaymentReceipt) => {
    setSelectedReceipt(receipt);
    setInvoiceModalOpen(true);
  }, []);

  const handleCloseInvoice = useCallback(() => {
    setInvoiceModalOpen(false);
    setSelectedReceipt(null);
  }, []);

  return {
    receipts: filteredReceipts,
    allReceiptsCount: receipts.length,
    isLoading: isLoading || isRefetching,
    refetch,
    searchQuery,
    setSearchQuery,
    paymentMethodFilter,
    setPaymentMethodFilter,
    monthFilter,
    setMonthFilter,
    paymentMonths,
    metrics,
    selectedReceipt,
    invoiceModalOpen,
    handleOpenInvoice,
    handleCloseInvoice,
  };
};

export default useMemberTransactions;
