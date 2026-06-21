import { LuSearch, LuCommand } from "react-icons/lu";

import useClock from "@/shared/components/layout/navbar/hooks/useClock";
import useNavbar from "@/shared/components/layout/navbar/hooks/useNavbar";
import LiveClock from "@/shared/components/layout/navbar/components/LiveClock";
import Breadcrumbs from "@/shared/components/layout/navbar/components/Breadcrumbs";
import SearchModal from "@/shared/components/layout/navbar/components/SearchModal";
import ProfileDropdown from "@/shared/components/layout/navbar/components/ProfileDropdown";

const Navbar = () => {
  const { timeString, dateString } = useClock();
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    isProfileOpen,
    setIsProfileOpen,
    focusedSearchIndex,
    setFocusedSearchIndex,
    profileRef,
    searchInputRef,
    handleLogout,
    filteredSearchItems,
    handleSearchNavigation,
    handleSearchKeyDown,
    breadcrumbs,
    adminInitials,
    adminName,
    user,
    adminEmail,
    navigate,
  } = useNavbar();

  return (
    <div className="top-0 z-20 sticky flex justify-between items-center bg-white/70 backdrop-blur-md px-6 border-slate-100 border-b h-20 select-none">
      {/* Left: Dynamic Breadcrumbs & Section Title */}
      <Breadcrumbs breadcrumbs={breadcrumbs} navigate={navigate} />

      {/* Right: Actions, Search, Alerts, Clock, Profile */}
      <div className="flex items-center gap-4">
        {/* Live Clock / Calendar */}
        <LiveClock timeString={timeString} dateString={dateString} />

        {/* Search Action Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="group flex justify-between items-center bg-slate-50 hover:bg-slate-100/50 shadow-xs hover:shadow-sm px-3 py-1.5 border border-slate-200/80 hover:border-slate-300 rounded-xl w-48 md:w-56 font-medium text-slate-400 text-xs text-left transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LuSearch className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span>Search panels...</span>
          </div>
          <div className="flex items-center gap-0.5 bg-white shadow-xs px-1.5 py-0.5 border border-slate-200 rounded-md font-bold text-[10px] text-slate-500 tracking-wider">
            <LuCommand className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>

        {/* Profile Dropdown */}
        <ProfileDropdown
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          profileRef={profileRef}
          adminName={adminName}
          adminEmail={adminEmail}
          adminInitials={adminInitials}
          navigate={navigate}
          handleLogout={handleLogout}
          user={user}
        />
      </div>

      {/* Global Command Palette / Search Modal */}
      <SearchModal
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        focusedSearchIndex={focusedSearchIndex}
        setFocusedSearchIndex={setFocusedSearchIndex}
        searchInputRef={searchInputRef}
        handleSearchKeyDown={handleSearchKeyDown}
        filteredSearchItems={filteredSearchItems}
        handleSearchNavigation={handleSearchNavigation}
      />
    </div>
  );
};

export default Navbar;
