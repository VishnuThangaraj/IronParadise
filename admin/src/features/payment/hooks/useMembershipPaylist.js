import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";

const useMembershipPaylist = () => {
  const token = useSelector(selectToken);
  const [members, setMembers] = useState([]);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("member/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMembers(response.data || []);

      const plansResponse = await api.get("membership/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMembershipPlans(plansResponse.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to load members or plans";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchMembers();
    }
  }, [token, fetchMembers]);

  const addPaymentRecord = useCallback(
    async (memberId, paymentData) => {
      setIsSubmitting(true);
      try {
        const response = await api.post(
          `member-payment/${memberId}/add`,
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(response.data?.message || "Payment record added successfully");
        if (response.data?.member) {
          setMembers((prev) =>
            prev.map((m) =>
              m.memberId === memberId ? response.data.member : m
            )
          );
        } else {
          fetchMembers();
        }
        return true;
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || "Failed to add payment record";
        toast.error(errorMsg);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, fetchMembers]
  );

  const updatePaymentRecord = useCallback(
    async (memberId, paymentId, paymentData) => {
      setIsSubmitting(true);
      try {
        const response = await api.put(
          `member-payment/${memberId}/update/${paymentId}`,
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(
          response.data?.message || "Payment record updated successfully"
        );
        if (response.data?.member) {
          setMembers((prev) =>
            prev.map((m) =>
              m.memberId === memberId ? response.data.member : m
            )
          );
        } else {
          fetchMembers();
        }
        return true;
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || "Failed to update payment record";
        toast.error(errorMsg);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, fetchMembers]
  );

  const deletePaymentRecord = useCallback(
    async (memberId, paymentId) => {
      const result = await Swal.fire({
        title: "Remove Payment Record?",
        text: "This action cannot be undone and will permanently remove this record.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#6366f1",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, remove",
        cancelButtonText: "Cancel",
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl font-montserrat",
          title: "text-base font-bold text-slate-800",
          confirmButton: "px-4 py-2 text-xs font-bold rounded-xl cursor-pointer",
          cancelButton: "px-4 py-2 text-xs font-bold rounded-xl cursor-pointer",
        },
      });

      if (!result.isConfirmed) return;

      try {
        const response = await api.delete(
          `member-payment/${memberId}/remove/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(
          response.data?.message || "Payment record removed successfully"
        );
        if (response.data?.member) {
          setMembers((prev) =>
            prev.map((m) =>
              m.memberId === memberId ? response.data.member : m
            )
          );
        } else {
          fetchMembers();
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || "Failed to remove payment record";
        toast.error(errorMsg);
      }
    },
    [token, fetchMembers]
  );

  const bulkInvoiceMembers = useCallback(
    async (bulkData) => {
      setIsSubmitting(true);
      try {
        const response = await api.post(
          "member-payment/bulk-invoice",
          bulkData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(response.data?.message || "Bulk invoicing processed successfully");
        fetchMembers();
        return true;
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail || "Failed to process bulk invoicing";
        toast.error(errorMsg);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, fetchMembers]
  );

  return {
    members,
    membershipPlans,
    isLoading,
    isSubmitting,
    addPaymentRecord,
    updatePaymentRecord,
    deletePaymentRecord,
    bulkInvoiceMembers,
    refreshMembers: fetchMembers,
  };
};

export default useMembershipPaylist;
