import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";

const useMemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector(selectToken);

  const [member, setMember] = useState(null);
  const [memberPlans, setMemberPlans] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  
  // Options for plan assignments
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isPlansLoading, setIsPlansLoading] = useState(false);
  const [isMeasurementsLoading, setIsMeasurementsLoading] = useState(false);
  
  // AI Plan states
  const [aiFitnessPlan, setAiFitnessPlan] = useState(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const fetchMember = useCallback(async () => {
    try {
      const response = await api.get(`member/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMember(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Failed to load member profile";
      toast.error(errorMsg);
      navigate("/member/list");
    }
  }, [id, token, navigate]);

  const fetchMemberPlans = useCallback(async () => {
    setIsPlansLoading(true);
    try {
      const response = await api.get(`member-plans/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMemberPlans(response.data);
    } catch (err) {
      // 404 means no plans assigned yet, which is expected for new members.
      if (err.response?.status === 404) {
        setMemberPlans({
          memberId: id,
          membershipId: null,
          trainerId: null,
          dietPlanId: null,
          workoutPlanId: null,
        });
      } else {
        toast.error("Failed to load assigned plans");
      }
    } finally {
      setIsPlansLoading(false);
    }
  }, [id, token]);

  const fetchMeasurements = useCallback(async () => {
    setIsMeasurementsLoading(true);
    try {
      const response = await api.get(`member-measurement/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMeasurements(response.data?.measurements || []);
    } catch (err) {
      toast.error("Failed to load physical measurements");
    } finally {
      setIsMeasurementsLoading(false);
    }
  }, [id, token]);

  const fetchOptions = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [membershipsRes, trainersRes, dietsRes, workoutsRes] = await Promise.all([
        api.get("membership/all", { headers }).catch(() => ({ data: [] })),
        api.get("trainer/all", { headers }).catch(() => ({ data: [] })),
        api.get("dietplan/all", { headers }).catch(() => ({ data: [] })),
        api.get("workoutplan/all", { headers }).catch(() => ({ data: [] })),
      ]);

      setMembershipPlans(membershipsRes.data || []);
      setTrainers(trainersRes.data || []);
      setDietPlans(dietsRes.data || []);
      setWorkoutPlans(workoutsRes.data || []);
    } catch (err) {
      toast.error("Failed to load plan assignment dropdown options");
    }
  }, [token]);

  const fetchAIFitnessPlan = useCallback(async () => {
    setIsAILoading(true);
    try {
      const response = await api.get(`fitness/plan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAiFitnessPlan(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setAiFitnessPlan(null);
      } else {
        toast.error("Failed to load AI fitness plan");
      }
    } finally {
      setIsAILoading(false);
    }
  }, [id, token]);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      fetchMember(),
      fetchMemberPlans(),
      fetchMeasurements(),
      fetchOptions(),
      fetchAIFitnessPlan(),
    ]);
    setIsLoading(false);
  }, [fetchMember, fetchMemberPlans, fetchMeasurements, fetchOptions, fetchAIFitnessPlan]);

  useEffect(() => {
    if (token && id) {
      loadAllData();
    }
  }, [token, id, loadAllData]);

  // Actions
  const assignPlans = async (payload) => {
    try {
      const response = await api.post("member-plans/assign", {
        memberId: id,
        ...payload
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data?.message || "Plans assigned successfully");
      fetchMemberPlans();
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to assign plans";
      toast.error(errMsg);
      return false;
    }
  };

  const removePlans = async () => {
    try {
      const response = await api.delete(`member-plans/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data?.message || "Plans unassigned successfully");
      fetchMemberPlans();
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to remove plans";
      toast.error(errMsg);
      return false;
    }
  };

  const addMeasurement = async (payload) => {
    try {
      const response = await api.post("member-measurement/add", {
        memberId: id,
        ...payload
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data?.message || "Measurement logged successfully");
      fetchMeasurements();
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to record measurement";
      toast.error(errMsg);
      return false;
    }
  };

  const deleteMeasurement = async (date) => {
    try {
      const response = await api.delete(`member-measurement/delete/${id}/${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(response.data?.message || "Measurement deleted successfully");
      fetchMeasurements();
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to delete measurement";
      toast.error(errMsg);
      return false;
    }
  };

  const generateAIFitnessPlan = async (payload) => {
    setIsGeneratingPlan(true);
    try {
      const response = await api.post("fitness/generate-plan", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("AI Fitness Plan generated successfully!");
      setAiFitnessPlan(response.data);
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to generate AI plan";
      toast.error(errMsg);
      return false;
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return {
    member,
    memberPlans,
    measurements,
    membershipPlans,
    trainers,
    dietPlans,
    workoutPlans,
    aiFitnessPlan,
    isLoading,
    isPlansLoading,
    isMeasurementsLoading,
    isAILoading,
    isGeneratingPlan,
    assignPlans,
    removePlans,
    addMeasurement,
    deleteMeasurement,
    generateAIFitnessPlan,
    refreshAllData: loadAllData,
  };
};

export default useMemberDetails;
