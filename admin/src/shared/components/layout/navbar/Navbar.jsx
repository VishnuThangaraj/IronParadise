import { LuSearch, LuCommand } from "react-icons/lu";

import useNavbar from "./hooks/useNavbar";
import useClock from "./hooks/useClock";
import Breadcrumbs from "./components/Breadcrumbs";
import LiveClock from "./components/LiveClock";
import ProfileDropdown from "./components/ProfileDropdown";
import SearchModal from "./components/SearchModal";

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
    <div className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-20 select-none">
      {/* Left: Dynamic Breadcrumbs & Section Title */}
      <Breadcrumbs breadcrumbs={breadcrumbs} navigate={navigate} />

      {/* Right: Actions, Search, Alerts, Clock, Profile */}
      <div className="flex items-center gap-4">
        {/* Live Clock / Calendar */}
        <LiveClock timeString={timeString} dateString={dateString} />

        {/* Search Action Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-between w-48 md:w-56 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-300 text-left text-slate-400 text-xs font-medium cursor-pointer transition-all duration-200 shadow-xs hover:shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <LuSearch className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span>Search panels...</span>
          </div>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-500 tracking-wider shadow-xs">
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
