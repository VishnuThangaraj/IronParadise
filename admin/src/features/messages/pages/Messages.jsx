import { useState, useMemo } from "react";
import { LuArrowLeft, LuSend, LuMegaphone, LuUsers, LuCircleCheck, LuEraser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import useMessages from "../hooks/useMessages";
import RecipientSelector from "../components/RecipientSelector";
import MessageForm from "../components/MessageForm";
import ButtonPrimary from "@/shared/components/ui/form/button/ButtonPrimary";
import Loader from "@/shared/components/ui/Loader";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const TEMPLATES = [
  {
    name: "General",
    subject: "Important Update from IronParadise",
    body: "<h2>Hello team,</h2><p>We have some important news to share regarding...</p>"
  },
  {
    name: "Maintenance",
    subject: "Scheduled System Maintenance",
    body: "<h2>System Maintenance Notice</h2><p>Please be advised that the IronParadise system will undergo maintenance on...</p>"
  },
  {
    name: "Event",
    subject: "You're Invited! Upcoming Event at IronParadise",
    body: "<h2>Join us for our next event!</h2><p>We are thrilled to invite you to...</p>"
  }
];

const Messages = () => {
  const navigate = useNavigate();
  const { trainers, members, isLoading, isSending, sendBulkEmail } = useMessages();
  
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSend = async () => {
    const success = await sendBulkEmail(selectedRecipients, subject, body);
    if (success) {
      setSelectedRecipients([]);
      setSubject("");
      setBody("");
    }
  };

  const applyTemplate = (template) => {
    setSubject(template.subject);
    setBody(template.body);
  };

  const handleClear = () => {
    setSelectedRecipients([]);
    setSubject("");
    setBody("");
  };

  // Stats calculation
  const stats = useMemo(() => [
    { label: "Total Trainers", value: trainers.length, icon: LuUsers, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100" },
    { label: "Total Members", value: members.length, icon: LuUsers, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Selected", value: selectedRecipients.length, icon: LuCircleCheck, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" }
  ], [trainers.length, members.length, selectedRecipients.length]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-6 pb-12 font-montserrat"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-250 cursor-pointer shadow-xs group"
          >
            <LuArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <LuMegaphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
                Broadcast Center
              </h1>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Send rich-text announcements to your community.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="px-5 py-2.5 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 text-xs font-bold rounded-xl transition-all duration-250 cursor-pointer bg-white flex items-center gap-2 shadow-xs"
          >
            <LuEraser className="w-4 h-4" />
            Clear All
          </button>
          <ButtonPrimary
            onClick={handleSend}
            loading={isSending}
            loadingText="Sending Broadcast..."
            disabled={selectedRecipients.length === 0 || !subject.trim() || !body.trim()}
            className="px-6 py-2.5 text-sm font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2 bg-linear-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 transition-all"
          >
            <LuSend className="w-4 h-4" />
            Broadcast ({selectedRecipients.length})
          </ButtonPrimary>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-3xl border ${stat.border} flex items-center gap-5 shadow-xs transition-transform hover:-translate-y-1 duration-300`}>
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-800 mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Recipients */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col h-[460px]">
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Select Recipients</h3>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md uppercase tracking-wide">
                {selectedRecipients.length} Selected
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col min-h-0">
              <RecipientSelector 
                trainers={trainers}
                members={members}
                selectedRecipients={selectedRecipients}
                setSelectedRecipients={setSelectedRecipients}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Composer */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col h-[460px]">
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-sm font-bold text-slate-800">Compose Message</h3>
              
              {/* Quick Templates */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Templates:</span>
                <div className="flex gap-2">
                  {TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyTemplate(tpl)}
                      className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col min-h-0">
              <MessageForm 
                subject={subject}
                setSubject={setSubject}
                body={body}
                setBody={setBody}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Messages;
