import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { AppDispatch } from "@/app/store";
import { AnimatePresence, motion } from "motion/react";
import {
  LuArrowLeft,
  LuAward,
  LuBriefcase,
  LuCalendar,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuClock,
  LuContact,
  LuImage,
  LuMail,
  LuMapPin,
  LuPhone,
  LuPlus,
  LuSave,
  LuShieldAlert,
  LuSparkles,
  LuUser,
  LuUserCheck,
  LuWallet,
  LuX,
} from "react-icons/lu";

import Input from "@/shared/components/ui/forms/Input";
import Button from "@/shared/components/ui/buttons/Button";
import Chip from "@/shared/components/ui/chip/Chip";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import SelectDropdown, {
  type SelectOption,
} from "@/shared/components/ui/dropdown/SelectDropdown";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import type { UserGender } from "@/shared/types/User.types";

import useTrainer from "../hooks/use-trainer";
import {
  initialTrainerState,
  type TrainerFormState,
} from "../state/initial-trainer.state";
import { fetchTrainerById } from "../redux/trainer.thunks";
import { selectCurrentTrainer } from "../redux/trainer.selector";
import { getErrorMessage } from "@/shared/utils/error-handler";

interface TrainerFormInnerProps {
  initialData: TrainerFormState;
  isEditMode: boolean;
  userId?: string;
}

const GENDER_OPTIONS: SelectOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_leave", label: "On Leave" },
  { value: "terminated", label: "Terminated" },
];

const QUICK_SPECIALIZATIONS = [
  "Strength & Conditioning",
  "Weight Loss & Cardio",
  "Bodybuilding",
  "CrossFit & HIIT",
  "Yoga & Flexibility",
  "Rehabilitation & Mobility",
  "Sports Nutrition",
];

type FormTab = "personal" | "specialization" | "compensation";

const TrainerFormInner = ({
  initialData,
  isEditMode,
  userId,
}: TrainerFormInnerProps) => {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<FormTab>("personal");
  const [specializationInput, setSpecializationInput] = useState("");

  const {
    formData,
    handleInputChange,
    handleShiftTimeChange,
    handleEmergencyContactChange,
    handleAddSpecialization,
    handleRemoveSpecialization,
    isSubmitting,
    handleSubmitTrainer,
  } = useTrainer(initialData);

  const onAddTag = () => {
    if (specializationInput.trim()) {
      handleAddSpecialization(specializationInput);
      setSpecializationInput("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddTag();
    }
  };

  const tabs: {
    id: FormTab;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    step: number;
  }[] = [
    { id: "personal", label: "Personal Details", icon: LuUser, step: 1 },
    {
      id: "specialization",
      label: "Specialization & Shift",
      icon: LuAward,
      step: 2,
    },
    {
      id: "compensation",
      label: "Salary & Emergency",
      icon: LuWallet,
      step: 3,
    },
  ];

  return (
    <form
      onSubmit={(e) => handleSubmitTrainer(e, isEditMode, userId)}
      className="flex flex-col gap-6"
    >
      <Container
        variant="secondary"
        className="rounded-3xl! p-6 sm:p-8 md:p-10 flex flex-col gap-8 shadow-xl relative overflow-hidden"
      >
        {/* Top Header Live Trainer Summary Banner */}
        <div className="p-5 rounded-2xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900/40 border border-indigo-200/60 dark:border-indigo-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl ${getDeterministicGradient(
                formData.fullName || "Trainer",
              )} flex items-center justify-center text-white shadow-md font-bold text-lg shrink-0`}
            >
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt={formData.fullName}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <LuUserCheck size={24} />
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  {formData.fullName || "New Trainer Profile"}
                </h3>
                <Chip
                  variant={
                    formData.employmentStatus === "active"
                      ? "active"
                      : formData.employmentStatus === "on_leave"
                        ? "warning"
                        : "inactive"
                  }
                  size="sm"
                  dot={true}
                  label={formData.employmentStatus || "Active"}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{formData.qualification || "Qualification not set"}</span>
                <span>•</span>
                <span>{formData.experienceYears || 0} Years Exp.</span>
                <span>•</span>
                <span>
                  Shift: {formData.shiftTime?.start || "09:00"} -{" "}
                  {formData.shiftTime?.end || "17:00"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Base Salary
              </span>
              <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                ₹{Number(formData.salary || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Header Selector matching DaySelector design */}
        <div className="flex flex-col gap-3">
          <Container
            variant="secondary"
            className="p-1.5! shadow-xs flex flex-wrap sm:flex-nowrap gap-1.5 rounded-2xl!"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  type="button"
                  variant={isActive ? "primary" : "transparent-pure"}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 min-w-40 py-2.5 px-4 text-[12px] font-bold rounded-xl sm:rounded-2xl transition-all duration-250 flex items-center justify-center gap-2"
                >
                  <Icon size={15} />
                  <span>
                    {tab.step}. {tab.label}
                  </span>
                </Button>
              );
            })}
          </Container>

          {/* Step Progress Line */}
          <div className="w-full bg-slate-200/60 dark:bg-white/10 h-1 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-r from-indigo-600 via-violet-600 to-purple-500 h-full transition-all duration-300 ease-out"
              style={{
                width:
                  activeTab === "personal"
                    ? "33.3%"
                    : activeTab === "specialization"
                      ? "66.6%"
                      : "100%",
              }}
            />
          </div>
        </div>

        {/* Animated Tab Content Container */}
        <AnimatePresence mode="wait">
          {activeTab === "personal" && (
            <motion.div
              key="personal-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-2 pb-2">
                <LuUser className="text-indigo-500 w-5 h-5" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuUser size={13} className="text-indigo-500" />
                    Full Name *
                  </span>
                  <Input
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuMail size={13} className="text-indigo-500" />
                    Email Address *
                  </span>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="e.g. john.doe@gym.com"
                    required
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuPhone size={13} className="text-indigo-500" />
                    Phone Number
                  </span>
                  <Input
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                    Gender
                  </span>
                  <SelectDropdown
                    options={GENDER_OPTIONS}
                    value={formData.gender || "male"}
                    onChange={(val) =>
                      handleInputChange("gender", val as UserGender)
                    }
                    className="w-full py-2.5"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuCalendar size={13} className="text-indigo-500" />
                    Date of Birth
                  </span>
                  <Input
                    name="dob"
                    type="date"
                    value={formData.dob ? formData.dob.split("T")[0] : ""}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuImage size={13} className="text-indigo-500" />
                    Profile Image URL
                  </span>
                  <Input
                    name="profileImage"
                    type="text"
                    value={formData.profileImage}
                    onChange={(e) =>
                      handleInputChange("profileImage", e.target.value)
                    }
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <LuMapPin size={13} className="text-indigo-500" />
                  Address
                </span>
                <Input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="e.g. 123 Fitness Ave, Suite 4B"
                />
              </div>
            </motion.div>
          )}

          {activeTab === "specialization" && (
            <motion.div
              key="specialization-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-2 pb-2">
                <LuAward className="text-indigo-500 w-5 h-5" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Professional Details & Shift Schedule
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuAward size={13} className="text-indigo-500" />
                    Qualification *
                  </span>
                  <Input
                    name="qualification"
                    type="text"
                    value={formData.qualification}
                    onChange={(e) =>
                      handleInputChange("qualification", e.target.value)
                    }
                    placeholder="e.g. Certified Personal Trainer (ACE / ACSM)"
                    required
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuBriefcase size={13} className="text-indigo-500" />
                    Experience (Years)
                  </span>
                  <Input
                    name="experienceYears"
                    type="number"
                    value={formData.experienceYears ?? 0}
                    onChange={(e) =>
                      handleInputChange(
                        "experienceYears",
                        e.target.value === "" ? 0 : Number(e.target.value),
                      )
                    }
                    placeholder="e.g. 5"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                    Employment Status
                  </span>
                  <SelectDropdown
                    options={STATUS_OPTIONS}
                    value={formData.employmentStatus || "active"}
                    onChange={(val) =>
                      handleInputChange("employmentStatus", val)
                    }
                    className="w-full py-2.5"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuCalendar size={13} className="text-indigo-500" />
                    Date Joined
                  </span>
                  <Input
                    name="joinDate"
                    type="date"
                    value={
                      formData.joinDate
                        ? formData.joinDate.split("T")[0]
                        : new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                      handleInputChange("joinDate", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Shift Timing Section */}
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <LuClock className="text-indigo-500" size={16} />
                  <span>Daily Shift Timing</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Shift Start Time
                    </span>
                    <Input
                      name="shiftStart"
                      type="time"
                      value={formData.shiftTime?.start || "09:00"}
                      onChange={(e) =>
                        handleShiftTimeChange("start", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Shift End Time
                    </span>
                    <Input
                      name="shiftEnd"
                      type="time"
                      value={formData.shiftTime?.end || "17:00"}
                      onChange={(e) =>
                        handleShiftTimeChange("end", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Specialization Tags & Presets */}
              <div className="flex flex-col gap-3 pt-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <LuSparkles size={13} className="text-indigo-500" />
                  Specialization Areas
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      name="specializationInput"
                      type="text"
                      value={specializationInput}
                      onChange={(e) => setSpecializationInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Type a specialization and press Enter or Add..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="blue"
                    size="md"
                    onClick={onAddTag}
                    aria-label="Add Specialization"
                  >
                    <LuPlus size={16} />
                    <span>Add</span>
                  </Button>
                </div>

                {/* Quick Add Preset Tags */}
                <div className="flex flex-wrap gap-1.5 items-center pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">
                    Quick Add:
                  </span>
                  {QUICK_SPECIALIZATIONS.map((preset) => {
                    const exists = formData.specialization?.includes(preset);
                    return (
                      <button
                        key={`preset-${preset}`}
                        type="button"
                        onClick={() => handleAddSpecialization(preset)}
                        disabled={exists}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          exists
                            ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-400 opacity-60 cursor-not-allowed"
                            : "bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                        }`}
                      >
                        + {preset}
                      </button>
                    );
                  })}
                </div>

                {formData.specialization &&
                formData.specialization.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {formData.specialization.map((spec, idx) => (
                      <span
                        key={`spec-tag-${idx}`}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs"
                      >
                        <LuCheck
                          size={14}
                          className="text-indigo-600 dark:text-indigo-400 shrink-0 font-bold"
                        />
                        <span>{spec}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpecialization(idx)}
                          className="w-4 h-4 rounded-full flex items-center justify-center text-indigo-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                          aria-label={`Remove specialization ${spec}`}
                        >
                          <LuX size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/15 text-center text-xs text-slate-400">
                    No specializations added yet. Use quick add above or type a
                    custom one.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "compensation" && (
            <motion.div
              key="compensation-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Salary Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2">
                  <LuWallet className="text-indigo-500 w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Salary & Compensation Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <LuWallet size={13} className="text-indigo-500" />
                      Monthly Base Salary (₹) *
                    </span>
                    <Input
                      name="salary"
                      type="number"
                      value={formData.salary ?? 0}
                      onChange={(e) =>
                        handleInputChange(
                          "salary",
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                      placeholder="e.g. 45000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <LuShieldAlert className="text-indigo-500 w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Emergency Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <LuUser size={13} className="text-indigo-500" />
                      Contact Full Name
                    </span>
                    <Input
                      name="emergencyName"
                      type="text"
                      value={formData.emergencyContact?.fullName || ""}
                      onChange={(e) =>
                        handleEmergencyContactChange("fullName", e.target.value)
                      }
                      placeholder="e.g. Mary Doe"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <LuPhone size={13} className="text-indigo-500" />
                      Contact Phone
                    </span>
                    <Input
                      name="emergencyPhone"
                      type="text"
                      value={formData.emergencyContact?.phone || ""}
                      onChange={(e) =>
                        handleEmergencyContactChange("phone", e.target.value)
                      }
                      placeholder="e.g. +91 98765 00000"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <LuContact size={13} className="text-indigo-500" />
                      Relationship
                    </span>
                    <Input
                      name="emergencyRelation"
                      type="text"
                      value={formData.emergencyContact?.relation || ""}
                      onChange={(e) =>
                        handleEmergencyContactChange("relation", e.target.value)
                      }
                      placeholder="e.g. Spouse / Parent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls & Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2 w-full sm:w-auto">
           {activeTab === "personal" && <Button
              key="btn-cancel"
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate("/trainer")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>}
            {activeTab !== "personal" && (
              <Button
                key="btn-prev"
                type="button"
                variant="secondary"
                size="md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab(
                    activeTab === "compensation"
                      ? "specialization"
                      : "personal",
                  );
                }}
              >
                <LuChevronLeft size={16} />
                <span>Previous</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {activeTab === "compensation" ? (
              <Button
                key="btn-submit-trainer"
                type="submit"
                variant="primary"
                size="md"
                loading={isSubmitting}
              >
                <LuSave size={16} />
                <span>{isEditMode ? "Update Trainer" : "Save Trainer"}</span>
              </Button>
            ) : (
              <Button
                key={`btn-next-${activeTab}`}
                type="button"
                variant="primary"
                size="md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab(
                    activeTab === "personal"
                      ? "specialization"
                      : "compensation",
                  );
                }}
              >
                <span>
                  {activeTab === "personal"
                    ? "Next: Specialization"
                    : "Next: Salary & Emergency"}
                </span>
                <LuChevronRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </Container>
    </form>
  );
};

const TrainerForm = () => {
  const { userId, trainerId } = useParams<{
    userId?: string;
    trainerId?: string;
  }>();
  const idToUse = (userId || trainerId)?.trim();
  const isEditMode = Boolean(idToUse);
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useNavigation();

  const currentTrainer = useSelector(selectCurrentTrainer);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const matchesCurrent = Boolean(
    isEditMode &&
    idToUse &&
    currentTrainer &&
    (currentTrainer.userId?.toLowerCase() === idToUse.toLowerCase() ||
      currentTrainer._id?.toLowerCase() === idToUse.toLowerCase()),
  );

  const isFetching = Boolean(
    isEditMode && idToUse && !matchesCurrent && !fetchError,
  );

  useEffect(() => {
    if (!isEditMode || !idToUse || matchesCurrent) {
      return;
    }

    let isSubscribed = true;

    dispatch(fetchTrainerById(idToUse))
      .unwrap()
      .catch((err: unknown) => {
        if (isSubscribed) {
          setFetchError(getErrorMessage(err, "Failed to load trainer details"));
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [isEditMode, idToUse, matchesCurrent, dispatch]);

  const initialData: TrainerFormState =
    isEditMode && currentTrainer
      ? {
          fullName: currentTrainer.fullName || "",
          dob: currentTrainer.dob ? currentTrainer.dob.split("T")[0] : "",
          profileImage: currentTrainer.profileImage || "",
          gender: currentTrainer.gender || "male",
          email: currentTrainer.email || "",
          phone: currentTrainer.phone || "",
          address: currentTrainer.address || "",
          permissions: currentTrainer.permissions || [
            "members",
            "dietplans",
            "workoutplans",
          ],
          role: currentTrainer.role || "trainer",
          emergencyContact: currentTrainer.emergencyContact || null,

          joinDate: currentTrainer.joinDate
            ? currentTrainer.joinDate.split("T")[0]
            : "",
          experienceYears: currentTrainer.experienceYears ?? 0,
          specialization: currentTrainer.specialization || ["General"],
          qualification: currentTrainer.qualification || "",
          shiftTime: currentTrainer.shiftTime || {
            start: "09:00",
            end: "17:00",
          },
          employmentStatus: currentTrainer.employmentStatus || "active",
          salary: currentTrainer.salary ?? 0,
        }
      : initialTrainerState;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title={`${isEditMode ? "Update" : "Add"} Trainer`}
          description={
            isEditMode
              ? "Modify details, qualification, shift schedule, and salary for this trainer."
              : "Register a new trainer profile and configure details, schedule, and salary."
          }
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/trainer/list")}
          aria-label="Back to Trainers"
        >
          <LuArrowLeft size={16} />
          <span>View all Trainers</span>
        </Button>
      </div>

      {/* Loading & Error states in edit mode */}
      {isEditMode && fetchError ? (
        <Container
          variant="secondary"
          className="rounded-3xl! p-12 flex flex-col items-center justify-center gap-4 min-h-90 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <LuShieldAlert size={24} />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Unable to load trainer
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {fetchError}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/trainer")}
            >
              Back to Trainers
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (idToUse) {
                  setFetchError(null);
                  dispatch(fetchTrainerById(idToUse))
                    .unwrap()
                    .catch((err: unknown) => {
                      setFetchError(
                        getErrorMessage(err, "Failed to load trainer details"),
                      );
                    });
                }
              }}
            >
              Retry
            </Button>
          </div>
        </Container>
      ) : isFetching ? (
        <Container
          variant="secondary"
          className="rounded-3xl! p-12 flex flex-col items-center justify-center gap-4 min-h-90"
        >
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading trainer details for editing...
          </p>
        </Container>
      ) : (
        <TrainerFormInner
          key={
            isEditMode ? currentTrainer?.userId || idToUse : "new-trainer-form"
          }
          initialData={initialData}
          isEditMode={isEditMode}
          userId={idToUse}
        />
      )}
    </div>
  );
};

export default TrainerForm;
