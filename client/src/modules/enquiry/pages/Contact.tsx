import { useState } from "react";
import { FiSun, FiMoon, FiArrowLeft, FiSend } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";

import { loginBg } from "@/modules/auth/assets";
import logoDark from "@/shared/assets/images/logo-dark.webp";
import logoWhite from "@/shared/assets/images/logo-white.webp";

import { useTheme } from "@/shared/hooks/useTheme";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { useToast } from "@/shared/components/ui/toast";
import { developerGithubURL } from "@/config/appConfig";

import Input from "@/shared/components/ui/forms/Input";
import FormField from "@/shared/components/ui/forms/FormField";
import Button from "@/shared/components/ui/buttons/Button";
import HeaderButton from "@/shared/components/ui/buttons/HeaderButton";
import Container from "@/shared/components/ui/containers/Container";

import { createEnquiry } from "../api/enquiry.api";
import { initialEnqiryFormState } from "../state/initial-enquiry-state";
import type { EnquiryForm } from "../types/enquiry.types";

const Contact = () => {
  const { isDark, toggleTheme } = useTheme();
  const { navigate, openInNewTab } = useNavigation();
  const { addToast } = useToast();

  const [formData, setFormData] = useState<EnquiryForm>(initialEnqiryFormState);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { isFetching: isSubmitting, refetch } = useQuery({
    queryKey: ["contact-us-submit"],
    queryFn: async () => {
      const response = await createEnquiry(formData);
      return response ?? null;
    },
    enabled: false,
    retry: false,
  });

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      addToast({ type: "error", message: "Please enter your full name" });
      return;
    }
    if (!formData.email.trim()) {
      addToast({ type: "error", message: "Please enter your email address" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      addToast({
        type: "error",
        message: "Please enter a valid email address",
      });
      return;
    }
    if (!formData.subject.trim()) {
      addToast({ type: "error", message: "Please enter a subject" });
      return;
    }
    if (!formData.message.trim()) {
      addToast({ type: "error", message: "Please enter your message" });
      return;
    }

    try {
      const result = await refetch();
      if (result.isSuccess && result.data) {
        addToast({
          type: "success",
          message:
            result.data.message ||
            "Enquiry submitted successfully! We'll get back to you shortly.",
        });
        setFormData(initialEnqiryFormState);
      } else if (result.error) {
        throw result.error;
      }
    } catch (err: unknown) {
      const errorObj = err as {
        response?: {
          data?: {
            message?: string;
            errors?: {
              fieldErrors?: Record<string, string[]>;
              formErrors?: string[];
            };
          };
        };
        message?: string;
      };

      const fieldError = errorObj?.response?.data?.errors?.fieldErrors
        ? Object.values(errorObj.response.data.errors.fieldErrors).flat()[0]
        : undefined;

      const formError = errorObj?.response?.data?.errors?.formErrors?.[0];

      const errorMessage =
        fieldError ||
        formError ||
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        "Failed to submit enquiry. Please try again.";
      addToast({ type: "error", message: errorMessage });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      {/* Light Mode Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-300/70 via-slate-400/50 to-indigo-300/60 pointer-events-none transition-opacity duration-500 opacity-100 dark:opacity-0" />
      {/* Dark Mode Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/90 via-slate-950/85 to-indigo-950/90 pointer-events-none transition-opacity duration-500 opacity-0 dark:opacity-100" />

      {/* Theme Toggle */}
      <div className="flex flex-col absolute top-6 left-6 z-20 gap-2">
        <HeaderButton
          variant="secondary"
          onClick={toggleTheme}
          ariaLabel="Toggle Theme"
          iconClassName="text-indigo-600 dark:text-amber-400"
          icon={isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
          text={isDark ? "LIGHT MODE" : "DARK MODE"}
        />
      </div>

      {/* Navigation Switch */}
      <div className="flex flex-col absolute top-6 right-6 z-20 gap-2">
        <HeaderButton
          variant="blue"
          ariaLabel="back to login"
          icon={<FiArrowLeft />}
          onClick={() => navigate("/authenticate")}
          text="Back to Login"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center py-16 px-4">
        <div className="flex flex-col justify-between items-center gap-10 w-full max-w-xl sm:max-w-2xl">
          {/* Logo */}
          <div
            onClick={() => openInNewTab(developerGithubURL)}
            className="flex items-center justify-center hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
          >
            <img
              src={logoDark}
              alt="IronParadise Logo"
              draggable={false}
              className="h-12 w-auto block dark:hidden object-contain select-none"
            />
            <img
              src={logoWhite}
              alt="IronParadise Logo"
              draggable={false}
              className="h-12 w-auto hidden dark:block object-contain select-none"
            />
          </div>

          {/* Contact Fields */}
          <Container className="flex-col align-middle items-center gap-2 py-10 px-8 sm:p-6 w-full">
            <div className="text-2xl font-bold text-gray-700 dark:text-white">
              Contact & Enquiry
            </div>
            <div className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-400 text-center">
              Have a question or feedback? Fill out the form below and our admin
              team will get back to you shortly.
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitEnquiry} className="w-full">
              <div className="grid w-full grid-cols-1 sm:grid-cols-12 gap-0 sm:gap-4 pt-5">
                {/* Full Name */}
                <FormField size={50}>
                  <Input
                    label="Full Name *"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    labelClassName="font-semibold"
                  />
                </FormField>

                {/* Email Address */}
                <FormField size={50}>
                  <Input
                    label="Email Address *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    labelClassName="font-semibold"
                  />
                </FormField>

                {/* Mobile Number */}
                <FormField size={50}>
                  <Input
                    label="Mobile Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    labelClassName="font-semibold"
                  />
                </FormField>

                {/* I AM A... */}
                <FormField size={50}>
                  <div className="relative">
                    <label
                      htmlFor="role"
                      className="mb-1 ps-1 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      I am a...
                    </label>
                    <div className="relative">
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="block w-full rounded-md border border-white/60 px-3 py-2 bg-white/40 backdrop-blur-md text-slate-900 shadow-sm hover:bg-white/50 focus:bg-white/70 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 sm:text-sm transition-all duration-300 dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:hover:bg-slate-900/70 dark:focus:bg-slate-900/80 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/50 cursor-pointer appearance-none"
                      >
                        <option
                          value="trainer"
                          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          Trainer
                        </option>
                        <option
                          value="member"
                          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          Member
                        </option>
                        <option
                          value="visitor"
                          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          Visitor
                        </option>
                        <option
                          value="other"
                          className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          Other
                        </option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400">
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                            fillRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </FormField>

                {/* Subject */}
                <FormField size={100}>
                  <Input
                    label="Subject *"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    labelClassName="font-semibold"
                  />
                </FormField>

                {/* Message */}
                <FormField size={100}>
                  <Input
                    as="textarea"
                    rows={4}
                    label="Message *"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    labelClassName="font-semibold"
                  />
                </FormField>

                {/* Submit Button */}
                <div className="col-span-1 sm:col-span-12 w-full mt-3 mb-1.5">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    className="w-full font-semibold text-sm gap-2"
                  >
                    <FiSend className="w-4 h-4" />
                    <span>{isSubmitting ? "Submitting..." : "SUBMIT ENQUIRY"}</span>
                  </Button>
                </div>
              </div>
            </form>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Contact;
