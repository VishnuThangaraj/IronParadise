import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LuX, 
  LuMail, 
  LuPhone, 
  LuUser, 
  LuCalendarClock,
  LuSend
} from "react-icons/lu";
import toast from "react-hot-toast";

import api from "@/service/api";
import { useSelector } from "react-redux";
import { selectToken } from "@/features/auth/redux/authSelector";

const EnquiryReplyModal = ({ isOpen, onClose, enquiry, onReplySuccess }) => {
  const token = useSelector(selectToken);
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !enquiry) return null;

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(
        `enquiry/reply/${enquiry.enquiryId}`,
        { replyMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reply sent successfully via email!");
      onReplySuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send reply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReplied = enquiry.status === "replied";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-montserrat"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <LuMail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 leading-tight">
                  Enquiry Details
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  ID: {enquiry.enquiryId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-xl"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>

          {/* Content Scrollable Area */}
          <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            
            {/* User Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <LuUser className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Name</p>
                  <p className="text-sm font-semibold text-slate-800">{enquiry.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LuMail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Email</p>
                  <p className="text-sm font-semibold text-slate-800">{enquiry.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LuPhone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Mobile</p>
                  <p className="text-sm font-semibold text-slate-800">{enquiry.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <LuCalendarClock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Date Received</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(enquiry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Original Message */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Subject: <span className="text-slate-700">{enquiry.subject}</span>
              </h3>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {enquiry.message}
                </p>
              </div>
            </div>

            {/* Reply Section */}
            {isReplied ? (
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Admin Reply
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Replied at: {new Date(enquiry.repliedAt).toLocaleString()}
                  </p>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 shadow-xs">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {enquiry.replyMessage}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReply} className="flex flex-col gap-3 border-t border-slate-100 pt-6">
                <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Compose Reply
                </label>
                <textarea
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                  placeholder="Type your response here. This will be emailed directly to the user..."
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm shadow-xs resize-none"
                />
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                      isSubmitting
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-slate-200 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <LuSend className="w-4 h-4" />
                    )}
                    {isSubmitting ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EnquiryReplyModal;
