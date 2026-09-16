import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import DataTable from "@/shared/components/ui/table/DataTable";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import SearchBar from "@/shared/components/ui/search/SearchBar";
import DeleteModal from "@/shared/components/ui/modals/DeleteModal";
import Container from "@/shared/components/ui/containers/Container";
import SelectDropdown from "@/shared/components/ui/dropdown/SelectDropdown";
import ViewModeToggle from "@/shared/components/ui/view-mode-toggle/ViewModeToggle";

import { useMemberFetch } from "../hooks/use-member.fetch";
import { useMemberDelete } from "../hooks/use-member.delete";
import { getMemberColumns } from "../constants/member.columns";

const statusFilterOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active Members" },
  { value: "inactive", label: "Inactive Members" },
];

const MemberList = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<string>("list");

  // Delete modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  // TanStack Query Hooks
  const {
    data: memberResponse,
    isLoading,
    isError,
    error,
  } = useMemberFetch({
    search: searchQuery.trim() || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { mutate: deleteMemberMutate, isPending: isDeleting } = useMemberDelete(
    {
      onSuccess: () => {
        setOpenDeleteModal(false);
        setMemberToDelete(null);
      },
    },
  );

  const members = useMemo(
    () => memberResponse?.data ?? [],
    [memberResponse?.data],
  );

  // Client-side filtering as fallback if API doesn't filter server-side
  const filteredRows = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        !searchQuery.trim() ||
        member.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone?.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && member.isActive) ||
        (statusFilter === "inactive" && !member.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, statusFilter]);

  const handleNavigateToAdd = useCallback(
    () => navigate("/member/add"),
    [navigate],
  );
  const handleNavigateToEdit = useCallback(
    (id: string) => navigate(`/member/edit/${id}`),
    [navigate],
  );
  const handleNavigateToView = useCallback(
    (id: string) => navigate(`/member/${id}`),
    [navigate],
  );

  const handleDeleteClick = useCallback((id: string) => {
    setMemberToDelete(id);
    setOpenDeleteModal(true);
  }, []);

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      deleteMemberMutate({ id: memberToDelete, permanent: true });
    }
  };

  const handleInActiveConfirm = () => {
    if (memberToDelete) {
      deleteMemberMutate({ id: memberToDelete, permanent: false });
    }
  };

  const columns = useMemo(
    () =>
      getMemberColumns({
        onView: handleNavigateToView,
        onEdit: handleNavigateToEdit,
        onDelete: handleDeleteClick,
      }),
    [handleNavigateToView, handleNavigateToEdit, handleDeleteClick],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Members" description="Manage your gym's members.">
        <div className="justify-center align-center">
          <Button
            variant="primary"
            className="font-semibold text-sm px-4!"
            onClick={handleNavigateToAdd}
            aria-label="Add Member"
          >
            <div className="flex justify-between items-center gap-2">
              <FiPlus /> <span>Add Member</span>
            </div>
          </Button>
        </div>
      </PageHeader>

      <Container
        variant="secondary"
        className="w-full! max-w-full! mx-0! flex justify-between items-center p-3.5! sm:p-3! rounded-2xl! shadow-xs relative! z-30! overflow-visible!"
      >
        <div>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search members by id, name, email or phone..."
          />
        </div>
        <div className="flex justify-between gap-6 items-center">
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          <SelectDropdown
            options={statusFilterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            icon={<LuFilter className="w-4 h-4" />}
          />
        </div>
      </Container>

      {/* Error Feedback */}
      {isError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm">
          Failed to load members: {error?.message || "Unknown error occurred"}
        </div>
      )}

      {/* Data Table */}
      <div className="relative z-0">
        <Container
          variant="secondary"
          className="w-full! max-w-full! p-0! overflow-hidden rounded-2xl! flex-col shadow-xs"
        >
          <DataTable
            loading={isLoading}
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row.userId || row._id}
            className="border-none! rounded-none! shadow-none! bg-transparent!"
          />
        </Container>
      </div>

      {/* Member Deletion Confirmation Modal */}
      <DeleteModal
        open={openDeleteModal}
        loading={isDeleting}
        onClose={() => {
          setOpenDeleteModal(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        inActiveBtn={true}
        inActiveConfirm={handleInActiveConfirm}
        title="Delete Member"
        content="Are you sure you want to delete this member? This action can be undone by an administrator."
      />
    </div>
  );
};

export default MemberList;
