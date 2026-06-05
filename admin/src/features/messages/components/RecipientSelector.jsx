import { useState, useMemo } from "react";
import { FaUser, FaDumbbell } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";

const RecipientSelector = ({
  trainers,
  members,
  selectedRecipients,
  setSelectedRecipients
}) => {
  const [activeTab, setActiveTab] = useState("trainers"); // "trainers" or "members"
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggle = (email) => {
    setSelectedRecipients(prev => 
      prev.includes(email) 
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  // Filter based on query
  const filteredData = useMemo(() => {
    const list = activeTab === "trainers" ? trainers : members;
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(item => 
      (item.name && item.name.toLowerCase().includes(q)) || 
      (item.email && item.email.toLowerCase().includes(q))
    );
  }, [activeTab, trainers, members, searchQuery]);

  const filteredEmails = useMemo(() => {
    return filteredData.map(item => item.email).filter(Boolean);
  }, [filteredData]);

  const allFilteredSelected = useMemo(() => {
    return filteredEmails.length > 0 && filteredEmails.every(email => selectedRecipients.includes(email));
  }, [filteredEmails, selectedRecipients]);

  const handleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedRecipients(prev => prev.filter(e => !filteredEmails.includes(e)));
    } else {
      setSelectedRecipients(prev => {
        const set = new Set([...prev, ...filteredEmails]);
        return Array.from(set);
      });
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 gap-4 font-montserrat">
      {/* Tabs Selector */}
      <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 shrink-0">
        <button
          type="button"
          onClick={() => { setActiveTab("trainers"); setSearchQuery(""); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === "trainers"
              ? "bg-white text-indigo-600 shadow-xs"
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
          }`}
        >
          <FaDumbbell className="text-xs" />
          Trainers
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            activeTab === "trainers" ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-600"
          }`}>
            {trainers.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("members"); setSearchQuery(""); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === "members"
              ? "bg-white text-indigo-600 shadow-xs"
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
          }`}
        >
          <FaUser className="text-xs" />
          Members
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            activeTab === "members" ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-600"
          }`}>
            {members.length}
          </span>
        </button>
      </div>

      {/* Search Input and Bulk Selector */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shrink-0">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <LuSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === "trainers" ? "trainers" : "members"} by name or email...`}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
          />
        </div>
        
        {filteredEmails.length > 0 && (
          <button
            type="button"
            onClick={handleSelectAllFiltered}
            className="px-4 py-2.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 rounded-xl transition-colors cursor-pointer text-center whitespace-nowrap"
          >
            {allFilteredSelected ? "Deselect Filtered" : "Select All Filtered"}
          </button>
        )}
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto border border-slate-100 bg-slate-50/20 rounded-2xl p-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent min-h-0">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-xs text-slate-400 italic">No {activeTab === "trainers" ? "trainers" : "members"} found matching search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredData.map(item => {
              if (!item.email) return null;
              const isSelected = selectedRecipients.includes(item.email);
              const initials = item.name ? item.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "?";
              return (
                <label 
                  key={item.email}
                  className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                    isSelected 
                      ? "bg-indigo-50/70 border-indigo-200 shadow-xs" 
                      : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggle(item.email)}
                    className="w-4.5 h-4.5 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer shrink-0"
                  />
                  
                  {/* Initial Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : activeTab === "trainers"
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {initials}
                  </div>
                  
                  <div className="flex flex-col min-w-0">
                    <span className={`text-xs font-bold truncate ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                      {item.name}
                    </span>
                    <span className={`text-[10px] truncate ${isSelected ? "text-indigo-600/80" : "text-slate-400"} mt-0.5`}>
                      {item.email}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientSelector;
