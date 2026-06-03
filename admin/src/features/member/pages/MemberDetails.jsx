import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  LuArrowLeft,
  LuPencil,
  LuUser,
  LuMail,
  LuPhone,
  LuMapPin,
  LuCalendar,
  LuCrown,
  LuDumbbell,
  LuFolderHeart,
  LuScale,
  LuRuler,
  LuPlus,
  LuTrash2,
  LuActivity,
} from "react-icons/lu";

import useMemberDetails from "../hooks/useMemberDetails";
import Loader from "@/shared/components/ui/Loader";

const MemberDetails = () => {
  const navigate = useNavigate();
  const {
    member,
    memberPlans,
    measurements,
    membershipPlans,
    trainers,
    dietPlans,
    workoutPlans,
    isLoading,
    assignPlans,
    addMeasurement,
    deleteMeasurement,
  } = useMemberDetails();

  // Modal states
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isMeasureModalOpen, setIsMeasureModalOpen] = useState(false);

  // Form states for Plan Assignment
  const [planForm, setPlanForm] = useState({
    membershipId: "",
    trainerId: "",
    dietPlanId: "",
    workoutPlanId: "",
    membershipStartDate: "",
    membershipEndDate: "",
  });

  // Form states for Measurements
  const [measureForm, setMeasureForm] = useState({
    date: new Date().toISOString().split("T")[0],
    height: "",
    weight: "",
    bodyFat: "",
    chest: "",
    arms: "",
    waist: "",
    thighs: "",
  });

  // Handle open plan modal
  const openPlanModal = () => {
    if (memberPlans) {
      setPlanForm({
        membershipId: memberPlans.membershipId || "",
        trainerId: memberPlans.trainerId || "",
        dietPlanId: memberPlans.dietPlanId || "",
        workoutPlanId: memberPlans.workoutPlanId || "",
        membershipStartDate: memberPlans.membershipStartDate
          ? new Date(memberPlans.membershipStartDate).toISOString().split("T")[0]
          : "",
        membershipEndDate: memberPlans.membershipEndDate
          ? new Date(memberPlans.membershipEndDate).toISOString().split("T")[0]
          : "",
      });
    }
    setIsPlanModalOpen(true);
  };

  // Handle open measurement modal
  const openMeasureModal = () => {
    setMeasureForm({
      date: new Date().toISOString().split("T")[0],
      height: "",
      weight: "",
      bodyFat: "",
      chest: "",
      arms: "",
      waist: "",
      thighs: "",
    });
    setIsMeasureModalOpen(true);
  };

  const updateCalculatedEndDate = (membershipId, startDate) => {
    if (!membershipId || !startDate) return "";
    const selectedPlan = membershipPlans.find((p) => p.membershipId === membershipId);
    if (!selectedPlan || !selectedPlan.duration) return "";

    const date = new Date(startDate);
    if (isNaN(date.getTime())) return "";

    const durationStr = selectedPlan.duration.toLowerCase().trim();
    const match = durationStr.match(/^(\d+)\s*(day|week|month|year)s?$/);

    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];

      if (unit === "day") {
        date.setDate(date.getDate() + value);
      } else if (unit === "week") {
        date.setDate(date.getDate() + value * 7);
      } else if (unit === "month") {
        date.setMonth(date.getMonth() + value);
      } else if (unit === "year") {
        date.setFullYear(date.getFullYear() + value);
      }
    } else {
      const value = parseInt(durationStr, 10);
      if (!isNaN(value)) {
        date.setMonth(date.getMonth() + value);
      } else {
        date.setMonth(date.getMonth() + 1);
      }
    }

    return date.toISOString().split("T")[0];
  };

  const handleMembershipChange = (newMembershipId) => {
    const startDate = planForm.membershipStartDate || new Date().toISOString().split("T")[0];
    const endDate = updateCalculatedEndDate(newMembershipId, startDate);
    setPlanForm((prev) => ({
      ...prev,
      membershipId: newMembershipId,
      membershipStartDate: startDate,
      membershipEndDate: endDate,
    }));
  };

  const handleStartDateChange = (newStartDate) => {
    const endDate = updateCalculatedEndDate(planForm.membershipId, newStartDate);
    setPlanForm((prev) => ({
      ...prev,
      membershipStartDate: newStartDate,
      membershipEndDate: endDate,
    }));
  };

  // Submit Plan Assignment
  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      membershipId: planForm.membershipId || null,
      trainerId: planForm.trainerId || null,
      dietPlanId: planForm.dietPlanId || null,
      workoutPlanId: planForm.workoutPlanId || null,
      membershipStartDate: planForm.membershipStartDate
        ? new Date(planForm.membershipStartDate).toISOString()
        : null,
      membershipEndDate: planForm.membershipEndDate
        ? new Date(planForm.membershipEndDate).toISOString()
        : null,
    };
    const success = await assignPlans(payload);
    if (success) {
      setIsPlanModalOpen(false);
    }
  };

  // Submit Measurement
  const handleMeasureSubmit = async (e) => {
    e.preventDefault();
    const h = parseFloat(measureForm.height);
    const w = parseFloat(measureForm.weight);
    
    // Auto-calculate BMI if height & weight exist
    let bmi = null;
    if (h && w) {
      const heightInMeters = h / 100;
      bmi = parseFloat((w / (heightInMeters * heightInMeters)).toFixed(2));
    }

    const payload = {
      date: measureForm.date,
      height: h || null,
      weight: w || null,
      bmi: bmi,
      bodyFat: parseFloat(measureForm.bodyFat) || null,
      chest: parseFloat(measureForm.chest) || null,
      arms: parseFloat(measureForm.arms) || null,
      waist: parseFloat(measureForm.waist) || null,
      thighs: parseFloat(measureForm.thighs) || null,
    };

    const success = await addMeasurement(payload);
    if (success) {
      setIsMeasureModalOpen(false);
    }
  };

  // Live BMI preview
  const liveBmi = useMemo(() => {
    const h = parseFloat(measureForm.height);
    const w = parseFloat(measureForm.weight);
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      return (w / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  }, [measureForm.height, measureForm.weight]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-montserrat">
        <LuUser className="w-12 h-12 mb-4 text-slate-300" />
        <h2 className="text-lg font-bold text-slate-700">Member Not Found</h2>
        <p className="text-sm">The member you are looking for does not exist.</p>
        <button
          onClick={() => navigate("/member/list")}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          Back to List
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  // Find plan & trainer display names
  const assignedMembershipName = memberPlans?.membershipId
    ? membershipPlans.find((p) => p.membershipId === memberPlans.membershipId)?.name || "Unknown Plan"
    : "Not Assigned";

  const assignedTrainerName = memberPlans?.trainerId
    ? trainers.find((t) => t.trainerID === memberPlans.trainerId || t.trainerId === memberPlans.trainerId)?.name || "Unknown Trainer"
    : "Not Assigned";

  const assignedDietPlanName = memberPlans?.dietPlanId
    ? dietPlans.find((d) => d.dietPlanId === memberPlans.dietPlanId || d.planId === memberPlans.dietPlanId)?.name || "Unknown Plan"
    : "Not Assigned";

  const assignedWorkoutPlanName = memberPlans?.workoutPlanId
    ? workoutPlans.find((w) => w.workoutPlanId === memberPlans.workoutPlanId || w.planId === memberPlans.workoutPlanId)?.name || "Unknown Plan"
    : "Not Assigned";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-montserrat animate-fade-in">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/member/list")}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-250 cursor-pointer shadow-xs animate-slide-in"
          >
            <LuArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
              Member Profile Dashboard
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Manage plans, view metrics history, and edit details.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/member/edit/${member.memberId}`)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors text-sm font-bold shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <LuPencil className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col justify-between">
          <div>
            <div className="relative h-24 bg-linear-to-r from-indigo-500 to-purple-600">
              <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center">
                    <LuUser className="w-8 h-8 text-slate-400" />
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 right-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm border ${
                    member.isActive !== false
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-slate-50 text-slate-600 border-slate-200"
                  }`}
                >
                  {member.isActive !== false ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="pt-12 pb-6 px-6">
              <h2 className="text-lg font-bold text-slate-800">{member.name}</h2>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mt-0.5">
                ID: {member.memberId}
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <LuMail className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <LuPhone className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium">{member.mobile}</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <LuMapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <span className="text-xs font-medium leading-relaxed">
                    {member.address || "No address provided"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50/60 p-5 space-y-2">
            <div className="flex justify-between text-[11px] font-medium text-slate-500">
              <span>Gender:</span>
              <span className="font-bold text-slate-700">{member.gender}</span>
            </div>
            <div className="flex justify-between text-[11px] font-medium text-slate-500">
              <span>DOB:</span>
              <span className="font-bold text-slate-700">{formatDate(member.dob)}</span>
            </div>
            <div className="flex justify-between text-[11px] font-medium text-slate-500">
              <span>Member Since:</span>
              <span className="font-bold text-slate-700">{formatDate(member.joinDate)}</span>
            </div>
          </div>
        </div>

        {/* PLAN ASSIGNMENTS CARD */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-4.5 bg-indigo-500 rounded-full"></span>
                Assigned Plans & Trainer
              </h3>
              <button
                onClick={openPlanModal}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-150 px-3 py-1 rounded-xl transition-all duration-200"
              >
                Manage Assignments
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              
              {/* Membership Plan */}
              <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100/80">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
                  <LuCrown className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Membership Plan</p>
                  <p className="font-bold text-slate-700 text-xs mt-0.5 truncate">{assignedMembershipName}</p>
                  {memberPlans?.membershipStartDate && (
                    <p className="text-[9px] text-slate-400 mt-1">
                      {formatDate(memberPlans.membershipStartDate)} to {formatDate(memberPlans.membershipEndDate)}
                    </p>
                  )}
                </div>
              </div>

              {/* Trainer */}
              <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100/80">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                  <LuUser className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Trainer</p>
                  <p className="font-bold text-slate-700 text-xs mt-0.5 truncate">{assignedTrainerName}</p>
                </div>
              </div>

              {/* Diet Plan */}
              <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100/80">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                  <LuFolderHeart className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diet Plan</p>
                  <p className="font-bold text-slate-700 text-xs mt-0.5 truncate">{assignedDietPlanName}</p>
                </div>
              </div>

              {/* Workout Plan */}
              <div className="flex items-start gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100/80">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg shrink-0">
                  <LuDumbbell className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workout Plan</p>
                  <p className="font-bold text-slate-700 text-xs mt-0.5 truncate">{assignedWorkoutPlanName}</p>
                </div>
              </div>

            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 mt-6 flex justify-between items-center text-[10px] text-slate-400">
            <span>Last plan update: {memberPlans?.updatedAt ? formatDate(memberPlans.updatedAt) : "Never"}</span>
            <span>Created: {memberPlans?.createdAt ? formatDate(memberPlans.createdAt) : "N/A"}</span>
          </div>
        </div>

      </div>

      {/* PHYSICAL MEASUREMENTS HISTORY SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-4.5 bg-indigo-500 rounded-full"></span>
            Physical Measurements Progress
          </h3>
          <button
            onClick={openMeasureModal}
            className="flex items-center gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl shadow-xs transition-all duration-200 cursor-pointer animate-pulse-subtle"
          >
            <LuPlus className="w-3.5 h-3.5" />
            <span>Log Daily Metrics</span>
          </button>
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-3">Height (cm)</th>
                <th className="py-3 px-3">Weight (kg)</th>
                <th className="py-3 px-3">BMI</th>
                <th className="py-3 px-3">Body Fat (%)</th>
                <th className="py-3 px-3">Chest (in)</th>
                <th className="py-3 px-3">Arms (in)</th>
                <th className="py-3 px-3">Waist (in)</th>
                <th className="py-3 px-3">Thighs (in)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {measurements.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-8 text-center text-xs font-semibold text-slate-400">
                    No physical measurements recorded yet.
                  </td>
                </tr>
              ) : (
                measurements.map((m) => (
                  <tr key={m.date} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors text-xs font-medium text-slate-600">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{formatDate(m.date)}</td>
                    <td className="py-3.5 px-3">{m.height || "-"}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{m.weight || "-"}</td>
                    <td className="py-3.5 px-3">
                      {m.bmi ? (
                        <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                          m.bmi < 18.5 ? "text-amber-700 bg-amber-50" :
                          m.bmi < 25 ? "text-emerald-700 bg-emerald-50" :
                          m.bmi < 30 ? "text-amber-700 bg-amber-50" : "text-rose-700 bg-rose-50"
                        }`}>
                          {m.bmi}
                        </span>
                      ) : "-"}
                    </td>
                    <td className="py-3.5 px-3">{m.bodyFat ? `${m.bodyFat}%` : "-"}</td>
                    <td className="py-3.5 px-3">{m.chest || "-"}</td>
                    <td className="py-3.5 px-3">{m.arms || "-"}</td>
                    <td className="py-3.5 px-3">{m.waist || "-"}</td>
                    <td className="py-3.5 px-3">{m.thighs || "-"}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => deleteMeasurement(m.date)}
                        title="Delete log"
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      >
                        <LuTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PLAN ASSIGNMENT MODAL */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto font-montserrat">
            <h3 className="text-base font-bold text-slate-800 mb-4">Manage Member Plan & Trainer Assignments</h3>
            
            <form onSubmit={handlePlanSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Membership Plan Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Membership Plan</label>
                  <select
                    value={planForm.membershipId}
                    onChange={(e) => handleMembershipChange(e.target.value)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  >
                    <option value="">Select Plan</option>
                    {membershipPlans.map((p) => (
                      <option key={p.membershipId} value={p.membershipId}>
                        {p.name} - ₹{p.amount?.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trainer Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Personal Trainer</label>
                  <select
                    value={planForm.trainerId}
                    onChange={(e) => setPlanForm({ ...planForm, trainerId: e.target.value })}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  >
                    <option value="">Select Trainer</option>
                    {trainers.map((t) => {
                      const tId = t.trainerID || t.trainerId;
                      return (
                        <option key={tId} value={tId}>
                          {t.name} ({t.specialization || "General"})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Diet Plan Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Diet Plan</label>
                  <select
                    value={planForm.dietPlanId}
                    onChange={(e) => setPlanForm({ ...planForm, dietPlanId: e.target.value })}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  >
                    <option value="">Select Diet Plan</option>
                    {dietPlans.map((d) => {
                      const dId = d.dietPlanId || d.planId;
                      return (
                        <option key={dId} value={dId}>
                          {d.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Workout Plan Select */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Workout Plan</label>
                  <select
                    value={planForm.workoutPlanId}
                    onChange={(e) => setPlanForm({ ...planForm, workoutPlanId: e.target.value })}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  >
                    <option value="">Select Workout Plan</option>
                    {workoutPlans.map((w) => {
                      const wId = w.workoutPlanId || w.planId;
                      return (
                        <option key={wId} value={wId}>
                          {w.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Start Date */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Membership Start Date</label>
                  <input
                    type="date"
                    value={planForm.membershipStartDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                {/* End Date */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Membership End Date</label>
                  <input
                    type="date"
                    value={planForm.membershipEndDate}
                    onChange={(e) => setPlanForm({ ...planForm, membershipEndDate: e.target.value })}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save Assignments
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEASUREMENTS MODAL */}
      {isMeasureModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto font-montserrat">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-800">Log Daily Physical Metrics</h3>
              {liveBmi && (
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg">
                  BMI Estimate: <span className="text-sm">{liveBmi}</span>
                </span>
              )}
            </div>

            <form onSubmit={handleMeasureSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Date */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Log Date *</label>
                  <input
                    type="date"
                    required
                    value={measureForm.date}
                    onChange={(e) => setMeasureForm({ ...measureForm, date: e.target.value })}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                {/* Weight */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 72.5"
                    value={measureForm.weight}
                    onChange={(e) => setMeasureForm({ ...measureForm, weight: e.target.value })}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                {/* Height */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 178"
                    value={measureForm.height}
                    onChange={(e) => setMeasureForm({ ...measureForm, height: e.target.value })}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                {/* Body Fat */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Body Fat (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 14.5"
                    value={measureForm.bodyFat}
                    onChange={(e) => setMeasureForm({ ...measureForm, bodyFat: e.target.value })}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                {/* Chest */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Chest (inches)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 40"
                    value={measureForm.chest}
                    onChange={(e) => setMeasureForm({ ...measureForm, chest: e.target.value })}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                {/* Arms */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Arms (inches)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 15.2"
                    value={measureForm.arms}
                    onChange={(e) => setMeasureForm({ ...measureForm, arms: e.target.value })}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                {/* Waist */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Waist (inches)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 32"
                    value={measureForm.waist}
                    onChange={(e) => setMeasureForm({ ...measureForm, waist: e.target.value })}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                {/* Thighs */}
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Thighs (inches)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 22.4"
                    value={measureForm.thighs}
                    onChange={(e) => setMeasureForm({ ...measureForm, thighs: e.target.value })}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white"
                  />
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMeasureModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetails;
