import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTrainerPaymentReceipts } from "../api/trainer.api";
import type { TrainerPaymentReceipt } from "../types/trainer-payment-receipt.types";
import type { Trainer } from "../types/trainer.types";

export interface UseTrainerTransactionsProps {
  trainers?: Trainer[];
}

export const useTrainerTransactions = ({
  trainers = [],
}: UseTrainerTransactionsProps = {}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [salaryMonthFilter, setSalaryMonthFilter] = useState("all");

  // Selected receipt for Invoice Preview/Print
  const [selectedReceipt, setSelectedReceipt] =
    useState<TrainerPaymentReceipt | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // TanStack Query for all receipts
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["trainer-transactions"],
    queryFn: () => getTrainerPaymentReceipts(),
  });

  const rawReceipts: TrainerPaymentReceipt[] = response?.data || [];

  // Trainer lookup map
  const trainerMap = useMemo(() => {
    const map = new Map<string, Trainer>();
    trainers.forEach((t) => {
      if (t.userId) map.set(t.userId.toUpperCase(), t);
    });
    return map;
  }, [trainers]);

  // Enriched receipts (fallback to trainerMap if trainer not enriched from backend)
  const enrichedReceipts = useMemo(() => {
    return rawReceipts.map((r) => {
      const fallbackTrainer = trainerMap.get(r.userId?.toUpperCase());
      const trainerInfo =
        r.trainer ||
        (fallbackTrainer
          ? {
              userId: fallbackTrainer.userId,
              fullName: fallbackTrainer.fullName,
              email: fallbackTrainer.email,
              phone: fallbackTrainer.phone,
              profileImage: fallbackTrainer.profileImage,
              gender: fallbackTrainer.gender,
              specialization: fallbackTrainer.specialization,
              qualification: fallbackTrainer.qualification,
              employmentStatus: fallbackTrainer.employmentStatus,
            }
          : null);

      return {
        ...r,
        trainer: trainerInfo,
      };
    });
  }, [rawReceipts, trainerMap]);

  // Unique salary months for dropdown filter
  const salaryMonths = useMemo(() => {
    const months = new Set<string>();
    enrichedReceipts.forEach((r) => {
      if (r.salaryMonth) months.add(r.salaryMonth);
    });
    return Array.from(months);
  }, [enrichedReceipts]);

  // Filtered receipts
  const filteredReceipts = useMemo(() => {
    let result = enrichedReceipts;

    // Payment method filter
    if (paymentMethodFilter !== "all") {
      result = result.filter(
        (r) =>
          (r.paymentMethod || "").toUpperCase() ===
          paymentMethodFilter.toUpperCase(),
      );
    }

    // Salary month filter
    if (salaryMonthFilter !== "all") {
      result = result.filter((r) => r.salaryMonth === salaryMonthFilter);
    }

    // Search query
    const q = searchQuery.trim().toLowerCase();
    if (!q) return result;

    return result.filter((r) => {
      const matchReceiptNo = r.receiptNumber?.toLowerCase().includes(q);
      const matchUserId = r.userId?.toLowerCase().includes(q);
      const matchTxn = r.transactionId?.toLowerCase().includes(q);
      const matchMonth = r.salaryMonth?.toLowerCase().includes(q);
      const matchNotes = r.notes?.toLowerCase().includes(q);
      const matchName = r.trainer?.fullName?.toLowerCase().includes(q);
      const matchEmail = r.trainer?.email?.toLowerCase().includes(q);

      return (
        matchReceiptNo ||
        matchUserId ||
        matchTxn ||
        matchMonth ||
        matchNotes ||
        matchName ||
        matchEmail
      );
    });
  }, [enrichedReceipts, paymentMethodFilter, salaryMonthFilter, searchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalDisbursed = filteredReceipts.reduce(
      (sum, r) => sum + (Number(r.amount) || 0),
      0,
    );
    const count = filteredReceipts.length;
    const avg = count > 0 ? Math.round(totalDisbursed / count) : 0;

    return {
      totalDisbursed,
      totalCount: count,
      averagePayout: avg,
    };
  }, [filteredReceipts]);

  const handleOpenInvoice = (receipt: TrainerPaymentReceipt) => {
    setSelectedReceipt(receipt);
    setInvoiceModalOpen(true);
  };

  const handleCloseInvoice = () => {
    setSelectedReceipt(null);
    setInvoiceModalOpen(false);
  };

  return {
    receipts: filteredReceipts,
    allReceiptsCount: rawReceipts.length,
    isLoading,
    isError,
    refetch,
    searchQuery,
    setSearchQuery,
    paymentMethodFilter,
    setPaymentMethodFilter,
    salaryMonthFilter,
    setSalaryMonthFilter,
    salaryMonths,
    metrics,
    selectedReceipt,
    invoiceModalOpen,
    handleOpenInvoice,
    handleCloseInvoice,
  };
};

export default useTrainerTransactions;
