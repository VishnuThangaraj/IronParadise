import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import { getInitialMemberState } from "../constants/memberFields";

const useAddMember = () => {
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [member, setMember] = useState(getInitialMemberState());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMetadataChange = useCallback((name, value) => {
    setMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      if (!member.name?.trim()) {
        toast.error("Member Name is required");
        return;
      }
      if (!member.email?.trim()) {
        toast.error("Email is required");
        return;
      }
      if (!member.mobile?.trim()) {
        toast.error("Mobile is required");
        return;
      }
      if (!member.address?.trim()) {
        toast.error("Address is required");
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = { ...member };
        
        // Format dates or clear if empty
        if (!payload.dob) {
          payload.dob = null;
        } else {
          payload.dob = new Date(payload.dob).toISOString();
        }
        
        if (!payload.joinDate) {
          payload.joinDate = new Date().toISOString();
        } else {
          payload.joinDate = new Date(payload.joinDate).toISOString();
        }

        const response = await api.post("member/create", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(response.data?.message || "Member created successfully!");
        navigate("/member/list");
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail ||
          (Array.isArray(err.response?.data?.detail)
            ? err.response.data.detail.map((d) => d.msg).join(", ")
            : null) ||
          err.response?.data?.message ||
          "Failed to create member";
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [member, token, navigate]
  );

  return {
    member,
    isSubmitting,
    handleMetadataChange,
    handleSubmit,
  };
};

export default useAddMember;
