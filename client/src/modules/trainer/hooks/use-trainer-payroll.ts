import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/app/store";

import {
  selectTrainers,
  selectTrainerLoading,
  selectTrainerError,
} from "../redux/trainer.selector";
import { fetchTrainers } from "../redux/trainer.thunks";
import type { Trainer } from "../types/trainer.types";

export const useTrainerPayroll = () => {
  const dispatch = useDispatch<AppDispatch>();

  const trainers = useSelector(selectTrainers);
  const loading = useSelector(selectTrainerLoading);
  const error = useSelector(selectTrainerError);

  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [employmentFilter, setEmploymentFilter] = useState("all");

  // Modals state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedTrainerForPay, setSelectedTrainerForPay] =
    useState<Trainer | null>(null);

  const [receiptsModalOpen, setReceiptsModalOpen] = useState(false);
  const [selectedTrainerForReceipts, setSelectedTrainerForReceipts] =
    useState<Trainer | null>(null);

  useEffect(() => {
    dispatch(fetchTrainers());
  }, [dispatch]);

  const refetch = () => {
    dispatch(fetchTrainers());
  };

  const filteredTrainers = useMemo(() => {
    let result = trainers;

    // Filter by payment status
    if (paymentStatusFilter !== "all") {
      result = result.filter(
        (t) =>
          (t.paymentStatus || "PENDING").toUpperCase() ===
          paymentStatusFilter.toUpperCase(),
      );
    }

    // Filter by employment status
    if (employmentFilter !== "all") {
      if (employmentFilter === "active") {
        result = result.filter(
          (t) => t.isActive && t.employmentStatus !== "terminated",
        );
      } else if (employmentFilter === "inactive") {
        result = result.filter(
          (t) => !t.isActive || t.employmentStatus === "inactive",
        );
      } else if (employmentFilter === "on_leave") {
        result = result.filter((t) => t.employmentStatus === "on_leave");
      }
    }

    // Search query filter
    const query = searchQuery.trim().toLowerCase();
    if (!query) return result;

    return result.filter((t) => {
      const nameMatch = t.fullName?.toLowerCase().includes(query);
      const idMatch = t.userId?.toLowerCase().includes(query);
      const emailMatch = t.email?.toLowerCase().includes(query);
      const phoneMatch = t.phone?.toLowerCase().includes(query);
      const specMatch = t.specialization?.some((s) =>
        s.toLowerCase().includes(query),
      );
      return nameMatch || idMatch || emailMatch || phoneMatch || specMatch;
    });
  }, [trainers, searchQuery, paymentStatusFilter, employmentFilter]);

  const handleOpenPayModal = (trainer: Trainer) => {
    setSelectedTrainerForPay(trainer);
    setPayModalOpen(true);
  };

  const handleClosePayModal = () => {
    setSelectedTrainerForPay(null);
    setPayModalOpen(false);
  };

  const handleOpenReceiptsModal = (trainer: Trainer) => {
    setSelectedTrainerForReceipts(trainer);
    setReceiptsModalOpen(true);
  };

  const handleCloseReceiptsModal = () => {
    setSelectedTrainerForReceipts(null);
    setReceiptsModalOpen(false);
  };

  return {
    trainers,
    loading,
    error,
    refetch,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    paymentStatusFilter,
    setPaymentStatusFilter,
    employmentFilter,
    setEmploymentFilter,
    filteredTrainers,

    // Pay Modal
    payModalOpen,
    selectedTrainerForPay,
    handleOpenPayModal,
    handleClosePayModal,

    // Receipts Modal
    receiptsModalOpen,
    selectedTrainerForReceipts,
    handleOpenReceiptsModal,
    handleCloseReceiptsModal,
  };
};

export default useTrainerPayroll;
