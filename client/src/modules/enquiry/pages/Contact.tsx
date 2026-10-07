import { useState } from "react";
import {
  FiSun,
  FiMoon,
  FiArrowLeft,
  FiMessageSquare,
  FiSend,
} from "react-icons/fi";

import { useTheme } from "@/shared/hooks/useTheme";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { useToast } from "@/shared/components/ui/toast";

import { loginBg } from "@/modules/auth/assets";
import HeaderButton from "@/shared/components/ui/buttons/HeaderButton";

const Contact = () => {
  const { isDark, toggleTheme } = useTheme();
  const { navigate } = useNavigation();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Trainer",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      addToast({ type: "error", message: "Please enter your full name." });
      return;
    }
    if (!formData.email.trim()) {
      addToast({ type: "error", message: "Please enter your email address." });
      return;
    }
    if (!formData.phone.trim()) {
      addToast({ type: "error", message: "Please enter your mobile number." });
      return;
    }
    if (!formData.subject.trim()) {
      addToast({ type: "error", message: "Please enter a subject." });
      return;
    }
    if (!formData.message.trim()) {
      addToast({ type: "error", message: "Please enter your message." });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast({
        type: "success",
        message:
          "Your enquiry has been submitted! Our team will contact you shortly.",
      });
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        role: "Trainer",
        subject: "",
        message: "",
      });
    }, 600);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      {/* Light Mode Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-white/90 via-slate-50/85 to-indigo-50/80 pointer-events-none transition-opacity duration-500 opacity-100 dark:opacity-0" />
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

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen items-center justify-center px-4 py-20 sm:py-24">
        <div className="flex flex-col items-center gap-8 w-full max-w-xl sm:max-w-2xl">
          {/* Header */}
          <div className="flex flex-col gap-4 items-center text-center">
            <div className="bg-primary-light p-3.5 rounded-2xl border-2 border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10">
              <FiMessageSquare className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <h1 className="uppercase font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-800 dark:text-white">
              CONTACT & ENQUIRY
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              Have a question or feedback? Fill out the form below and our admin
              team will get back to you shortly.
            </p>
          </div>

          {/* Form Card (Styled to match design mockup) */}
          <div className="w-full bg-white/90 dark:bg-[#0d121f]/95 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-2xl transition-all duration-300">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              {/* Row 1: Full Name & Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="fullName"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    FULL NAME <span className="text-indigo-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    EMAIL ADDRESS <span className="text-indigo-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Mobile Number & I AM A... */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="phone"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    MOBILE NUMBER <span className="text-indigo-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    className="w-full bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="role"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    I AM A... <span className="text-indigo-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Trainer">Trainer</option>
                      <option value="Member">Member</option>
                      <option value="Visitor">Visitor</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
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
              </div>

              {/* Row 3: Subject */}
              <div className="flex flex-col gap-2 w-full">
                <label
                  htmlFor="subject"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  SUBJECT <span className="text-indigo-500">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  className="w-full bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              {/* Row 4: Message */}
              <div className="flex flex-col gap-2 w-full">
                <label
                  htmlFor="message"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  MESSAGE <span className="text-indigo-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="w-full bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Row 5: Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-4 rounded-xl font-bold uppercase tracking-wider text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none"
              >
                <FiSend className="w-4 h-4" />
                <span>
                  {isSubmitting ? "Submitting..." : "SUBMIT ENQUIRY"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
