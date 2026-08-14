import LiveClock from "./components/LiveClock";
import { LuSearch, LuCommand } from "react-icons/lu";

import useClock from "@/shared/hooks/useClock";

import LogoutModal from "@/shared/components/ui/modals/LogoutModal";
import useNavbar from "@/shared/components/layout/navbar/hooks/useNavbar";
import ProfileDropdown from "@/shared/components/layout/navbar/components/ProfileDropdown";
import ThemeToggle from "./components/ThemeToggle";
import SearchModal from "./components/SearchModal";

const Navbar = () => {
  const {
    user,
    profileRef,
    searchQuery,
    userInitials,
    isSearchOpen,
    isProfileOpen,
    setSearchQuery,
    searchInputRef,
    setIsSearchOpen,
    setIsProfileOpen,
    isLogoutModalOpen,
    focusedSearchIndex,
    setIsLogoutModalOpen,
    setFocusedSearchIndex,
    handleOpenLogoutModal,
  } = useNavbar();

  const { timeString, dateString } = useClock();

  return (
    <div className="h-16 sm:h-20 bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl border-b border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between px-6 sticky top-0 z-20 select-none text-gray-800 dark:text-gray-100 transition-colors duration-300 shadow-xs dark:shadow-slate-950/20">
      {/* Nav Left */}
      <div>
        <div>Breadcrums</div>
      </div>

      {/* Nav Right */}
      <div className="flex justify-center items-center align-middle gap-4">
        <LiveClock timeString={timeString} dateString={dateString} />

        {/* Search Box */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center justify-between w-48 md:w-56 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-left text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-medium cursor-pointer transition-all duration-200 shadow-xs hover:shadow-sm active:scale-[0.99] group"
        >
          <div className="flex items-center gap-2">
            <LuSearch className="w-4 h-4 text-slate-400 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            <span>Search panels...</span>
          </div>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 tracking-wider shadow-xs transition-colors">
            <LuCommand className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>

        <ThemeToggle />

        <ProfileDropdown
          user={user}
          profileRef={profileRef}
          userInitials={userInitials}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          handleOpenLogoutModal={handleOpenLogoutModal}
        />
      </div>

      {/* Page Search Modal */}
      {/* {isSearchOpen && (
        <SearchModal
          searchQuery={searchQuery}
          isSearchOpen={isSearchOpen}
          setSearchQuery={setSearchQuery}
          setIsSearchOpen={setIsSearchOpen}
          focusedSearchIndex={focusedSearchIndex}
          setFocusedSearchIndex={setFocusedSearchIndex}
          searchInputRef={searchInputRef}
          // handleSearchKeyDown,
          // filteredSearchItems,
          // handleSearchNavigation,
        />
      )} */}

      {/* Logout Confirmation */}
      {isLogoutModalOpen && (
        <LogoutModal
          open={isLogoutModalOpen}
          onClose={() => {
            setIsLogoutModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
