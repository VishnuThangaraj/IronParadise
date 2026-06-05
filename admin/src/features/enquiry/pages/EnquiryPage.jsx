import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Paper } from "@mui/material";
import { 
  LuArrowLeft,
  LuMail,
  LuMessageSquare,
  LuSend
} from "react-icons/lu";

import { fadeUp, fadeIn } from "@/shared/animations";
import useEnquiry from "../hooks/useEnquiry";

const MotionPaper = motion.create(Paper);

const EnquiryPage = () => {
  const { formData, handleChange, handleSubmit, isSubmitting } = useEnquiry();

  return (
    <motion.div
      {...fadeIn}
      className="relative flex flex-col items-center justify-center min-h-screen w-full gap-5 overflow-y-auto bg-slate-950 font-montserrat py-10"
    >
      {/* Dark overlay & blur blobs */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/90 via-slate-950/85 to-indigo-950/90 pointer-events-none fixed" />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none fixed" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none fixed" />

      {/* Back to Home Link */}
      <Link to="/authentication" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-md fixed">
        <LuArrowLeft className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Back</span>
      </Link>

      {/* Header */}
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="flex flex-col items-center justify-center relative z-10 mb-2 mt-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <LuMessageSquare className="w-8 h-8" />
        </div>
        <h1 className="text-white text-xl sm:text-3xl font-bold tracking-wider">CONTACT & ENQUIRY</h1>
        <p className="text-indigo-300 text-xs sm:text-sm font-medium mt-2 max-w-md text-center opacity-80 leading-relaxed">
          Have a question or feedback? Fill out the form below and our admin team will get back to you shortly.
        </p>
      </motion.div>

      <MotionPaper
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.2 }}
        sx={{
          py: { xs: 4, sm: 5 },
          px: { xs: 3, sm: 4 },
          borderRadius: "24px",
          bgcolor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
        className="w-[90%] max-w-2xl relative z-10 my-auto"
        elevation={0}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all font-medium text-sm shadow-inner"
              />
            </div>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all font-medium text-sm shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Mobile */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Mobile Number *</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                placeholder="+1 234 567 8900"
                className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all font-medium text-sm shadow-inner"
              />
            </div>
            {/* User Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">I am a... *</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all font-medium text-sm shadow-inner appearance-none cursor-pointer"
              >
                <option value="member">Gym Member</option>
                <option value="trainer">Trainer</option>
                <option value="guest">Guest / New Visitor</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="What is this regarding?"
              className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all font-medium text-sm shadow-inner"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              placeholder="How can we help you?"
              className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all font-medium text-sm shadow-inner resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
              isSubmitting
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <LuSend className="w-5 h-5" />
            )}
            {isSubmitting ? "Sending..." : "Submit Enquiry"}
          </button>
        </form>
      </MotionPaper>
    </motion.div>
  );
};

export default EnquiryPage;
