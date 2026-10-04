import { useMemo, useState } from "react";
import Button from "@/shared/components/ui/buttons/Button";
import Container from "@/shared/components/ui/containers/Container";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import { useToast } from "@/shared/components/ui/toast";

import { FiSend } from "react-icons/fi";
import {
  LuUsers,
  LuDumbbell,
  LuUserCheck,
  LuCircleCheck,
  LuInfo,
  LuSearch,
} from "react-icons/lu";
import { useUserDetailsFetch } from "../hooks/use-messages.fetch";
import { MailTemplates } from "../templates/mail-template";

const getInitials = (fullName: string): string => {
  if (!fullName) return "U";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Messages = () => {
  const { addToast } = useToast();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"trainers" | "members">(
    "trainers",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const defaultTemplate = MailTemplates[2] || MailTemplates[0];
  const [subject, setSubject] = useState(defaultTemplate?.subject || "");
  const [content, setContent] = useState(defaultTemplate?.body || "");

  const { data: userDetailsResponse, isLoading } = useUserDetailsFetch();
  const users = useMemo(
    () => userDetailsResponse?.data || [],
    [userDetailsResponse?.data],
  );

  const totalUsers = users.length;
  const trainers = useMemo(
    () => users.filter((u) => u.role === "trainer"),
    [users],
  );
  const members = useMemo(
    () => users.filter((u) => u.role === "member"),
    [users],
  );

  const totalTrainers = trainers.length;
  const totalMembers = members.length;

  const currentTabUsers = activeTab === "trainers" ? trainers : members;

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return currentTabUsers;
    return currentTabUsers.filter(
      (u) =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q),
    );
  }, [currentTabUsers, searchQuery]);

  const isAllFilteredSelected = useMemo(() => {
    if (filteredUsers.length === 0) return false;
    return filteredUsers.every((u) =>
      selectedUserIds.includes(u.userId || u._id),
    );
  }, [filteredUsers, selectedUserIds]);

  const handleToggleUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAllFiltered = () => {
    const filteredIds = filteredUsers.map((u) => u.userId || u._id);
    if (filteredIds.length === 0) return;

    if (isAllFilteredSelected) {
      setSelectedUserIds((prev) =>
        prev.filter((id) => !filteredIds.includes(id)),
      );
    } else {
      setSelectedUserIds((prev) =>
        Array.from(new Set([...prev, ...filteredIds])),
      );
    }
  };

  const handleSelectTemplate = (template: (typeof MailTemplates)[number]) => {
    setSubject(template.subject);
    setContent(template.body);
  };

  const handleSendMail = () => {
    if (selectedUserIds.length === 0) {
      addToast({
        type: "error",
        message: "Please select at least one recipient to send the message.",
      });
      return;
    }
    if (!subject.trim()) {
      addToast({
        type: "error",
        message: "Please enter a subject line for your message.",
      });
      return;
    }
    if (!content.trim()) {
      addToast({
        type: "error",
        message: "Please enter message content.",
      });
      return;
    }

    addToast({
      type: "success",
      message: `Broadcast message queued for ${selectedUserIds.length} recipient(s)!`,
    });
  };

  const kpiCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: LuUsers,
      iconBg: "bg-indigo-50 dark:bg-indigo-950/60",
      iconText: "text-indigo-600 dark:text-indigo-400",
      borderColor: "border-indigo-100 dark:border-indigo-900/60",
    },
    {
      title: "Total Trainers",
      value: totalTrainers,
      icon: LuDumbbell,
      iconBg: "bg-violet-50 dark:bg-violet-950/60",
      iconText: "text-violet-600 dark:text-violet-400",
      borderColor: "border-violet-100 dark:border-violet-900/60",
    },
    {
      title: "Total Members",
      value: totalMembers,
      icon: LuUserCheck,
      iconBg: "bg-sky-50 dark:bg-sky-950/60",
      iconText: "text-sky-600 dark:text-sky-400",
      borderColor: "border-sky-100 dark:border-sky-900/60",
    },
    {
      title: "Selected",
      value: selectedUserIds.length,
      icon: LuCircleCheck,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/60",
      iconText: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-100 dark:border-emerald-900/60",
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex justify-between w-full items-center">
          <PageHeader
            title="Message & Broadcast"
            description="Send rich-text announcements to your community."
          />
          <Button className="px-4!" onClick={handleSendMail}>
            <FiSend />
            Send Mail
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Container
              key={card.title}
              variant="secondary"
              className="w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconText} border ${card.borderColor} shadow-xs group-hover:scale-105 transition-transform duration-300`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {card.title}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mt-0.5">
                  {isLoading ? "—" : card.value}
                </span>
              </div>
            </Container>
          );
        })}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
        {/* Left Column: Select Recipients */}
        <Container
          variant="secondary"
          className="w-full! max-w-none! mx-0! p-5! sm:p-6! rounded-2xl! flex flex-col gap-5 justify-start"
        >
          {/* Header */}
          <div className="flex justify-between items-center w-full">
            <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white">
              Select Recipients
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/60 px-2.5 py-1 rounded-lg">
              {selectedUserIds.length} SELECTED
            </span>
          </div>

          {/* Pill Toggle (Trainers vs Members) */}
          <div className="w-full p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl flex items-center border border-slate-200/80 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab("trainers");
                setSearchQuery("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "trainers"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs scale-100"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <LuDumbbell className="w-4 h-4" />
              <span>Trainers</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === "trainers"
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-300"
                    : "bg-slate-200/80 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                }`}
              >
                {totalTrainers}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("members");
                setSearchQuery("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                activeTab === "members"
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs scale-100"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <LuUsers className="w-4 h-4" />
              <span>Members</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === "members"
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-300"
                    : "bg-slate-200/80 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                }`}
              >
                {totalMembers}
              </span>
            </button>
          </div>

          {/* Search & Select All Filtered */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
            <div className="relative flex-1">
              <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab} by name or email...`}
                className="w-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={handleToggleSelectAllFiltered}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 px-3 py-2 rounded-xl transition-colors shrink-0 cursor-pointer self-end sm:self-auto"
            >
              {isAllFilteredSelected
                ? "Deselect All Filtered"
                : "Select All Filtered"}
            </button>
          </div>

          {/* Recipients List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[376px] overflow-y-auto pr-1 w-full">
            {isLoading ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
                <div className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mb-2" />
                <span className="text-xs">Loading recipients...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
                <LuUsers className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-xs font-semibold">No {activeTab} found</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const id = user.userId || user._id;
                const isSelected = selectedUserIds.includes(id);

                return (
                  <div
                    key={id}
                    onClick={() => handleToggleUser(id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                      isSelected
                        ? "border-indigo-500/60 bg-indigo-50/70 dark:bg-indigo-950/50 dark:border-indigo-500/60 shadow-xs"
                        : "border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="w-4 h-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer shrink-0"
                    />

                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100/80 dark:border-indigo-900/60">
                        {getInitials(user.fullName)}
                      </div>
                    )}

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                        {user.fullName}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Container>

        {/* Right Column: Compose Message */}
        <Container
          variant="secondary"
          className="w-full! max-w-none! mx-0! p-5! sm:p-6! rounded-2xl! flex flex-col gap-5 justify-start"
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white">
              Compose Message
            </h3>
            <div className="flex items-center gap-2">
              <span className="uppercase text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                TEMPLATES:
              </span>
              <div className="flex items-center gap-1.5">
                {MailTemplates.map((template) => {
                  const isCurrent =
                    subject === template.subject && content === template.body;
                  return (
                    <button
                      key={template.name}
                      type="button"
                      onClick={() => handleSelectTemplate(template)}
                      className={`cursor-pointer px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                        isCurrent
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-indigo-50/80 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/60"
                      }`}
                    >
                      {template.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Subject Line */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter announcement subject line..."
              className="w-full bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
            />
          </div>

          {/* Message Content */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Message Content (HTML Supported)
            </label>
            <textarea
              rows={13}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="<h2>Announcement Title</h2><p>Write your message content...</p>"
              className="w-full bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm font-mono leading-relaxed text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all resize-none"
            />
          </div>

          {/* Info Banner */}
          <div className="flex items-center gap-2.5 text-xs bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 p-3 rounded-xl mt-auto">
            <LuInfo className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>
              This message will be styled automatically using the IronParadise
              system email template.
            </span>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Messages;
