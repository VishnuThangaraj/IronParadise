import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import { getInitialMemberState } from "../constants/memberFields";

const useEditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [member, setMember] = useState(getInitialMemberState());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMember = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`member/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        const fetchedData = { ...response.data };
        if (fetchedData.dob) {
          fetchedData.dob = new Date(fetchedData.dob).toISOString().split("T")[0];
        }
        if (fetchedData.joinDate) {
          fetchedData.joinDate = new Date(fetchedData.joinDate).toISOString().split("T")[0];
        }
        setMember(fetchedData);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to load member details";
      toast.error(errorMsg);
      navigate("/member/list");
    } finally {
      setIsLoading(false);
    }
  }, [id, token, navigate]);

  useEffect(() => {
    if (token && id) {
      const timer = setTimeout(() => {
        fetchMember();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [token, id, fetchMember]);

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

        const response = await api.put(`member/update/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(response.data?.message || "Member updated successfully!");
        navigate("/member/list");
      } catch (err) {
        const errorMsg =
          err.response?.data?.detail ||
          (Array.isArray(err.response?.data?.detail)
            ? err.response.data.detail.map((d) => d.msg).join(", ")
            : null) ||
          err.response?.data?.message ||
          "Failed to update member";
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [member, token, id, navigate]
  );

  return {
    member,
    isLoading,
    isSubmitting,
    handleMetadataChange,
    handleSubmit,
  };
};

export default useEditMember;
