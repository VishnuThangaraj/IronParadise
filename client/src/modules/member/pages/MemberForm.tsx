import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  LuArrowLeft,
  LuCalendar,
  LuChevronLeft,
  LuChevronRight,
  LuContact,
  LuCrown,
  LuDumbbell,
  LuImage,
  LuInfo,
  LuMail,
  LuMapPin,
  LuPhone,
  LuSave,
  LuShieldAlert,
  LuUser,
  LuUserCheck,
  LuUtensils,
} from "react-icons/lu";

import Input from "@/shared/components/ui/forms/Input";
import Button from "@/shared/components/ui/buttons/Button";
import Chip from "@/shared/components/ui/chip/Chip";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import SelectDropdown, {
  type SelectOption,
} from "@/shared/components/ui/dropdown/SelectDropdown";
import { useToast } from "@/shared/components/ui/toast";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import type { UserGender } from "@/shared/types/User.types";

import { useMember } from "../hooks/use-member";
import { useMemberForm } from "../hooks/use-member-form";
import {
  initialMemberState,
  getTodayFormattedDate,
  type MemberFormState,
} from "../state/initial-member.state";

interface MemberFormInnerProps {
  initialData: MemberFormState;
  isEditMode: boolean;
  memberId?: string;
}

const GENDER_OPTIONS: SelectOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

type FormTab = "personal" | "plans" | "emergency";

const MemberFormInner = ({
  initialData,
  isEditMode,
  memberId,
}: MemberFormInnerProps) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<FormTab>("personal");

  const {
    formData,
    isSubmitting,
    membershipPlans,
    membershipPlanOptions,
    trainerOptions,
    dietPlanOptions,
    workoutPlanOptions,
    handleInputChange,
    handleSelectChange,
    handleEmergencyContactChange,
    handleSubmitMember,
  } = useMemberForm(initialData);

  // Tab definitions
  const tabs: {
    id: FormTab;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    step: number;
  }[] = [
    { id: "personal", label: "Personal Details", icon: LuUser, step: 1 },
    {
      id: "plans",
      label: "Membership & Plans",
      icon: LuCrown,
      step: 2,
    },
    {
      id: "emergency",
      label: "Emergency & Status",
      icon: LuShieldAlert,
      step: 3,
    },
  ];

  // Selected Plan metadata for the live banner and info card
  const selectedPlan = useMemo(() => {
    return membershipPlans.find(
      (p) => p.membershipPlanId === formData.membershipPlanId,
    );
  }, [membershipPlans, formData.membershipPlanId]);

  // Selected Trainer metadata for the live banner
  const selectedTrainer = useMemo(() => {
    const opt = trainerOptions.find((t) => t.value === formData.trainerId);
    return opt && opt.value ? opt.label : "None Assigned";
  }, [trainerOptions, formData.trainerId]);

  // Step 1 basic validation before moving to step 2
  const validateStep1 = (): boolean => {
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      addToast({
        type: "error",
        message: "Please enter a valid full name (at least 2 characters).",
      });
      return false;
    }
    if (!formData.email || !formData.email.includes("@")) {
      addToast({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return false;
    }
    return true;
  };

  const handleNextTab = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (activeTab === "personal") {
      if (!validateStep1()) return;
      setActiveTab("plans");
    } else if (activeTab === "plans") {
      setActiveTab("emergency");
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmitMember(e, isEditMode, memberId)}
      className="flex flex-col gap-6"
    >
      <Container
        variant="secondary"
        className="rounded-3xl! p-6 sm:p-8 md:p-10 flex flex-col gap-8 shadow-xl relative overflow-hidden"
      >
        {/* Top Header Live Member Summary Banner */}
        <div className="p-5 rounded-2xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900/40 border border-indigo-200/60 dark:border-indigo-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl ${getDeterministicGradient(
                formData.fullName || "Member",
              )} flex items-center justify-center text-white shadow-md font-bold text-lg shrink-0 overflow-hidden`}
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
                <LuUserCheck size={26} />
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  {formData.fullName || "New Member Profile"}
                </h3>
                <Chip
                  variant={formData.isActive ? "active" : "inactive"}
                  size="sm"
                  dot={true}
                  label={formData.isActive ? "Active Account" : "Inactive"}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {selectedPlan ? selectedPlan.planName : "No Plan Selected"}
                </span>
                <span>•</span>
                <span>Trainer: {selectedTrainer}</span>
                {formData.startDate && (
                  <>
                    <span>•</span>
                    <span>
                      Valid: {formData.startDate} →{" "}
                      {formData.endDate || "Ongoing"}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Subscription Fee
              </span>
              <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                {selectedPlan
                  ? `₹${Number(selectedPlan.price || 0).toLocaleString("en-IN")}`
                  : "₹0"}
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
                  onClick={() => {
                    if (tab.id !== "personal" && !validateStep1()) return;
                    setActiveTab(tab.id);
                  }}
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
                    : activeTab === "plans"
                      ? "66.6%"
                      : "100%",
              }}
            />
          </div>
        </div>

        {/* Animated Tab Content Container */}
        <AnimatePresence mode="wait">
          {/* TAB 1: Personal Details */}
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
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
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
                    onChange={handleInputChange}
                    placeholder="e.g. rahul.sharma@example.com"
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
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210"
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
                      handleSelectChange("gender", val as UserGender)
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
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuImage size={13} className="text-indigo-500" />
                    Profile Picture URL
                  </span>
                  <Input
                    name="profileImage"
                    type="text"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <LuMapPin size={13} className="text-indigo-500" />
                  Residential Address
                </span>
                <Input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. 42 MG Road, Bangalore, Karnataka"
                />
              </div>
            </motion.div>
          )}

          {/* TAB 2: Membership & Plans */}
          {activeTab === "plans" && (
            <motion.div
              key="plans-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-2 pb-2">
                <LuCrown className="text-indigo-500 w-5 h-5" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Membership & Fitness Subscriptions
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuCrown size={13} className="text-indigo-500" />
                    Membership Package
                  </span>
                  <SelectDropdown
                    options={membershipPlanOptions}
                    value={formData.membershipPlanId}
                    onChange={(val) =>
                      handleSelectChange("membershipPlanId", val)
                    }
                    placeholder="Select Membership Plan"
                    className="w-full py-2.5"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuUserCheck size={13} className="text-indigo-500" />
                    Assigned Trainer
                  </span>
                  <SelectDropdown
                    options={trainerOptions}
                    value={formData.trainerId}
                    onChange={(val) => handleSelectChange("trainerId", val)}
                    placeholder="Select Trainer (Optional)"
                    className="w-full py-2.5"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuCalendar size={13} className="text-indigo-500" />
                    Subscription Start Date
                  </span>
                  <Input
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuCalendar size={13} className="text-indigo-500" />
                    Subscription End Date (Auto-Calculated)
                  </span>
                  <Input
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuUtensils size={13} className="text-indigo-500" />
                    Diet Plan (Optional)
                  </span>
                  <SelectDropdown
                    options={dietPlanOptions}
                    value={formData.dietPlanId}
                    onChange={(val) => handleSelectChange("dietPlanId", val)}
                    placeholder="Select Diet Plan"
                    className="w-full py-2.5"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LuDumbbell size={13} className="text-indigo-500" />
                    Workout Plan (Optional)
                  </span>
                  <SelectDropdown
                    options={workoutPlanOptions}
                    value={formData.workoutPlanId}
                    onChange={(val) => handleSelectChange("workoutPlanId", val)}
                    placeholder="Select Workout Plan"
                    className="w-full py-2.5"
                  />
                </div>
              </div>

              {/* Informative Plan Card */}
              {selectedPlan && (
                <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-200/50 dark:border-indigo-500/20 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <LuInfo size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Selected Plan Details
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <div>
                      <span className="font-bold">{selectedPlan.planName}</span>
                      {" — "}
                      <span>{selectedPlan.durationMonths} Months Access</span>
                    </div>
                    <div className="font-extrabold text-indigo-600 dark:text-indigo-400">
                      ₹{selectedPlan.price.toLocaleString("en-IN")}
                    </div>
                  </div>
                  {selectedPlan.features && selectedPlan.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedPlan.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: Emergency Contact & Status */}
          {activeTab === "emergency" && (
            <motion.div
              key="emergency-tab"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Emergency Contact Section */}
              <div className="flex flex-col gap-4">
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
                      placeholder="e.g. Sunita Sharma"
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
                      placeholder="e.g. 9876543211"
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
                      placeholder="e.g. Spouse / Parent / Friend"
                    />
                  </div>
                </div>
              </div>

              {/* Account Status Section */}
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <LuUserCheck className="text-indigo-500 w-5 h-5" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Account Status & Permissions
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                      Account Status
                    </span>
                    <SelectDropdown
                      options={STATUS_OPTIONS}
                      value={formData.isActive ? "active" : "inactive"}
                      onChange={(val) =>
                        handleSelectChange("isActive" as any, val === "active" ? (true as any) : (false as any))
                      }
                      className="w-full py-2.5"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                      User Role
                    </span>
                    <div className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Member (Standard Gym Access)
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Controls & Navigation Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {activeTab === "personal" ? (
              <Button
                key="btn-cancel"
                type="button"
                variant="secondary"
                size="md"
                onClick={() => navigate("/member/list")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            ) : (
              <Button
                key="btn-prev"
                type="button"
                variant="secondary"
                size="md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab(
                    activeTab === "emergency" ? "plans" : "personal",
                  );
                }}
              >
                <LuChevronLeft size={16} />
                <span>Previous</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {activeTab === "emergency" ? (
              <Button
                key="btn-submit-member"
                type="submit"
                variant="primary"
                size="md"
                loading={isSubmitting}
              >
                <LuSave size={16} />
                <span>{isEditMode ? "Update Member" : "Register Member"}</span>
              </Button>
            ) : (
              <Button
                key={`btn-next-${activeTab}`}
                type="button"
                variant="primary"
                size="md"
                onClick={handleNextTab}
              >
                <span>
                  {activeTab === "personal"
                    ? "Next: Membership & Plans"
                    : "Next: Emergency & Status"}
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

const extractIdString = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  return (
    val.membershipPlanId ||
    val.dietPlanId ||
    val.workoutPlanId ||
    val.userId ||
    val._id ||
    ""
  );
};

const MemberForm = () => {
  const { memberId, id } = useParams<{
    memberId?: string;
    id?: string;
  }>();
  const idToUse = (memberId || id)?.trim();
  const isEditMode = Boolean(idToUse);
  const navigate = useNavigate();

  const {
    data: memberResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useMember(idToUse || "", {
    enabled: isEditMode,
  });

  const member = memberResponse?.data;

  const initialData: MemberFormState = useMemo(() => {
    if (!isEditMode || !member) {
      return initialMemberState;
    }

    return {
      fullName: member.fullName || "",
      dob: member.dob ? member.dob.split("T")[0] : "",
      profileImage: member.profileImage || "",
      gender: member.gender || "male",
      email: member.email || "",
      phone: member.phone || "",
      address: member.address || "",
      permissions: member.permissions || ["members"],
      role: member.role || "member",
      isActive: member.isActive ?? true,
      emergencyContact: member.emergencyContact || {
        fullName: "",
        phone: "",
        relation: "",
      },

      membershipPlanId: extractIdString(member.assignment?.membershipPlanId),
      dietPlanId: extractIdString(member.assignment?.dietPlanId),
      workoutPlanId: extractIdString(member.assignment?.workoutPlanId),
      trainerId: extractIdString(member.assignment?.trainerId),
      startDate: member.assignment?.startDate
        ? member.assignment.startDate.split("T")[0]
        : getTodayFormattedDate(),
      endDate: member.assignment?.endDate
        ? member.assignment.endDate.split("T")[0]
        : "",
    };
  }, [isEditMode, member]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title={`${isEditMode ? "Update" : "Add"} Member`}
          description={
            isEditMode
              ? "Modify member personal details, active subscriptions, assignments, and status."
              : "Register a new gym member, assign membership packages, personal trainers, and schedules."
          }
        />
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/member/list")}
          aria-label="Back to Members"
        >
          <LuArrowLeft size={16} />
          <span>View all Members</span>
        </Button>
      </div>

      {/* Loading & Error States in Edit Mode */}
      {isEditMode && isError ? (
        <Container
          variant="secondary"
          className="rounded-3xl! p-12 flex flex-col items-center justify-center gap-4 min-h-90 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <LuShieldAlert size={24} />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Unable to load member profile
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {error?.message || "Member details could not be retrieved."}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/member/list")}
            >
              Back to Members
            </Button>
            <Button variant="primary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </Container>
      ) : isEditMode && isLoading ? (
        <Container
          variant="secondary"
          className="rounded-3xl! p-12 flex flex-col items-center justify-center gap-4 min-h-90"
        >
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading member profile for editing...
          </p>
        </Container>
      ) : (
        <MemberFormInner
          key={isEditMode ? member?.userId || idToUse : "new-member-form"}
          initialData={initialData}
          isEditMode={isEditMode}
          memberId={idToUse}
        />
      )}
    </div>
  );
};

export default MemberForm;
