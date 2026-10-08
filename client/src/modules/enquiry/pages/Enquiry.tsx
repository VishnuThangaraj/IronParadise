import { useState, useMemo, useCallback } from "react";
import { LuFilter, LuUserCheck } from "react-icons/lu";

import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import SearchBar from "@/shared/components/ui/search/SearchBar";
import SelectDropdown from "@/shared/components/ui/dropdown/SelectDropdown";
import ViewModeToggle from "@/shared/components/ui/view-mode-toggle/ViewModeToggle";
import DataTable from "@/shared/components/ui/table/DataTable";
import DeleteModal from "@/shared/components/ui/modals/DeleteModal";

import { useEnquiriesFetch } from "../hooks/use-enquiry.fetch";
import {
  useEnquiryReply,
  useEnquiryDelete,
} from "../hooks/use-enquiry.actions";
import { getEnquiryColumns } from "../constants/enquiry.columns";
import EnquiryKPI from "../components/EnquiryKPI";
import EnquiryGrid from "../components/EnquiryGrid";
import EnquiryViewModal from "../components/EnquiryViewModal";
import EnquiryReplyModal from "../components/EnquiryReplyModal";
import type { EnquiryData } from "../types/enquiry.types";

const statusFilterOptions = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "replied", label: "Replied" },
];

const roleFilterOptions = [
  { value: "all", label: "All Roles" },
  { value: "trainer", label: "Trainer" },
  { value: "member", label: "Member" },
  { value: "visitor", label: "Visitor" },
  { value: "other", label: "Other" },
];

const Enquiry = () => {
  // Filters & display state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewMode, setViewMode] = useState<string>("list");

  // Modal states
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryData | null>(
    null,
  );
  const [replyEnquiry, setReplyEnquiry] = useState<EnquiryData | null>(null);
  const [deleteEnquiry, setDeleteEnquiry] = useState<EnquiryData | null>(null);

  // TanStack Query Hooks
  const {
    data: enquiryResponse,
    isLoading,
    isError,
    error,
  } = useEnquiriesFetch();

  const replyMutation = useEnquiryReply();
  const deleteMutation = useEnquiryDelete();

  // All enquiries from server
  const enquiries = useMemo(
    () => enquiryResponse?.data ?? [],
    [enquiryResponse?.data],
  );

  // Filtered rows for table & grid display
  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return enquiries.filter((item) => {
      // Search matching across multiple fields
      const matchesSearch =
        !query ||
        item.enquiryId?.toLowerCase().includes(query) ||
        item.fullName?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.phone?.includes(query) ||
        item.subject?.toLowerCase().includes(query) ||
        item.message?.toLowerCase().includes(query);

      // Status matching
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "replied" && item.replied) ||
        (statusFilter === "pending" && !item.replied);

      // Role matching
      const matchesRole =
        roleFilter === "all" ||
        item.role?.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [enquiries, searchQuery, statusFilter, roleFilter]);

  // Modal actions
  const handleView = useCallback((enquiry: EnquiryData) => {
    setSelectedEnquiry(enquiry);
  }, []);

  const handleReplyClick = useCallback((enquiry: EnquiryData) => {
    setReplyEnquiry(enquiry);
  }, []);

  const handleDeleteClick = useCallback((enquiry: EnquiryData) => {
    setDeleteEnquiry(enquiry);
  }, []);

  const handleSendReply = async (replyData: {
    subject: string;
    message: string;
  }) => {
    if (!replyEnquiry) return;
    try {
      await replyMutation.mutateAsync({
        id: replyEnquiry.enquiryId || replyEnquiry._id,
        replyData,
      });
      setReplyEnquiry(null);
    } catch {
      // Error handled by mutation hook toast
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteEnquiry) return;
    try {
      await deleteMutation.mutateAsync(
        deleteEnquiry.enquiryId || deleteEnquiry._id,
      );
      setDeleteEnquiry(null);
    } catch {
      // Error handled by mutation hook toast
    }
  };

  // Table columns definition
  const columns = useMemo(
    () =>
      getEnquiryColumns({
        onView: handleView,
        onReply: handleReplyClick,
        onDelete: handleDeleteClick,
      }),
    [handleView, handleReplyClick, handleDeleteClick],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Component */}
      <PageHeader
        title="Enquiries"
        description="Manage, review, and reply to customer inquiries and questions."
      />

      {/* 2. KPI Section */}
      <EnquiryKPI enquiries={enquiries} loading={isLoading} />

      {/* 3. Search Bar with Filters & View Switch */}
      <Container
        variant="secondary"
        className="w-full! max-w-full! mx-0! flex flex-col md:flex-row justify-between items-stretch md:items-center p-3.5! sm:p-3! gap-3.5 rounded-2xl! shadow-xs relative! z-30! overflow-visible!"
      >
        <div className="flex-1 min-w-0">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search by ID, name, email, phone, or message..."
            containerClassName="w-full! md:w-80!"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-end">
          {/* View Mode Switch */}
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

          {/* Role Filter */}
          <SelectDropdown
            options={roleFilterOptions}
            value={roleFilter}
            onChange={setRoleFilter}
            icon={<LuUserCheck className="w-4 h-4" />}
          />

          {/* Status Filter */}
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
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm">
          Failed to load enquiries: {error?.message || "Unknown error occurred"}
        </div>
      )}

      {/* 4. Enquiries Content: List or Grid View */}
      <div className="relative z-0">
        {viewMode === "grid" ? (
          <EnquiryGrid
            rows={filteredRows}
            loading={isLoading}
            onView={handleView}
            onReply={handleReplyClick}
            onDelete={handleDeleteClick}
          />
        ) : (
          <Container
            variant="secondary"
            className="w-full! max-w-full! p-0! overflow-hidden rounded-2xl! flex-col shadow-xs"
          >
            <DataTable
              loading={isLoading}
              rows={filteredRows}
              columns={columns}
              getRowId={(row) => row.enquiryId || row._id}
              className="border-none! rounded-none! shadow-none! bg-transparent!"
            />
          </Container>
        )}
      </div>

      {/* View Enquiry Details Modal */}
      <EnquiryViewModal
        open={Boolean(selectedEnquiry)}
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onReply={(enquiry) => {
          setSelectedEnquiry(null);
          setReplyEnquiry(enquiry);
        }}
        onDelete={(enquiry) => {
          setSelectedEnquiry(null);
          setDeleteEnquiry(enquiry);
        }}
      />

      {/* Reply to Enquiry Modal */}
      <EnquiryReplyModal
        open={Boolean(replyEnquiry)}
        enquiry={replyEnquiry}
        onClose={() => setReplyEnquiry(null)}
        isPending={replyMutation.isPending}
        onSubmit={handleSendReply}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={Boolean(deleteEnquiry)}
        loading={deleteMutation.isPending}
        onClose={() => setDeleteEnquiry(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Enquiry"
        content={`Are you sure you want to delete enquiry ${deleteEnquiry?.enquiryId || ""} from ${deleteEnquiry?.fullName || "this user"}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Enquiry;
