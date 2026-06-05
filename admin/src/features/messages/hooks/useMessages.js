import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";

const useMessages = () => {
  const token = useSelector(selectToken);
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [trainersRes, membersRes] = await Promise.all([
        api.get("trainer/all", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("member/all", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setTrainers(trainersRes.data || []);
      setMembers(membersRes.data || []);
    } catch (err) {
      toast.error("Failed to load recipients");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  const sendBulkEmail = async (recipients, subject, body) => {
    if (!recipients || recipients.length === 0) {
      toast.error("Please select at least one recipient");
      return false;
    }
    if (!subject || !body) {
      toast.error("Subject and body are required");
      return false;
    }

    setIsSending(true);
    try {
      const response = await api.post(
        "email/send/bulk",
        { recipients, subject, body },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data?.message || "Emails sent successfully!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send emails");
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    trainers,
    members,
    isLoading,
    isSending,
    sendBulkEmail
  };
};

export default useMessages;
