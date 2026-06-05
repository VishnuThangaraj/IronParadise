import React, { useEffect } from "react";
import { Modal, Box, Divider } from "@mui/material";
import { LuX, LuInfo } from "react-icons/lu";

import ButtonPrimary from "@/shared/components/ui/form/button/ButtonPrimary";
import { modalBaseStyle } from "@/shared/components/ui/modal/config/modalConfig";

const PaymentModal = ({
  isModalOpen,
  setIsModalOpen,
  isSubmitting,
  editingRecord,
  formData,
  handleInputChange,
  handleSubmit,
  members,
  membershipPlans,
  assignedPlans,
  monthOptions,
}) => {
  return (
    <Modal
      open={isModalOpen}
      onClose={() => !isSubmitting && setIsModalOpen(false)}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(15, 23, 42, 0.3)",
          },
        },
      }}
    >
      <Box
        sx={{
          ...modalBaseStyle,
          maxWidth: 500,
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
        }}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-slate-900 to-indigo-950 px-6 py-4.5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {editingRecord ? "Modify Payment Record" : "Record Member Payment"}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              {editingRecord ? "Ledger Entry Update" : "Log a member invoice payout"}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            disabled={isSubmitting}
            type="button"
            className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>

        <Divider />

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-montserrat">
          {editingRecord && (
            <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] font-medium leading-relaxed">
              <LuInfo className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                Any changes made here will update the existing payment entry (e.g. to reflect a new cumulative paid amount).
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Select Member */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Select Member <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.memberId}
                onChange={(e) => handleInputChange("memberId", e.target.value)}
                required
                disabled={Boolean(editingRecord)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 cursor-pointer"
              >
                <option value="" disabled>Choose Member</option>
                {members.map((m) => (
                  <option key={m.memberId} value={m.memberId}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Select Membership Plan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Membership Plan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.membershipPlanId}
                onChange={(e) => handleInputChange("membershipPlanId", e.target.value)}
                required
                disabled={Boolean(editingRecord) || Boolean(assignedPlans?.find(p => p.memberId === formData.memberId)?.membershipId)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <option value="" disabled>Select Plan</option>
                {membershipPlans.map((p) => (
                  <option key={p.membershipId} value={p.membershipId}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Billing Month <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.month}
                onChange={(e) => handleInputChange("month", e.target.value)}
                required
                disabled={Boolean(editingRecord)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 cursor-pointer"
              >
                <option value="" disabled>Select Month</option>
                {monthOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Total Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.totalAmount}
                onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>

            {/* Paid Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Paid Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max={formData.totalAmount}
                step="1"
                value={formData.paidAmount}
                onChange={(e) => handleInputChange("paidAmount", e.target.value)}
                required
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>

            {/* Pending Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                Pending Balance (₹)
                <span className="text-slate-400" title="Calculated automatically: Total - Paid">
                  <LuInfo className="w-3 h-3" />
                </span>
              </label>
              <input
                type="number"
                readOnly
                value={formData.pendingAmount}
                className="px-3.5 py-2 text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-xl outline-hidden cursor-not-allowed select-none"
              />
            </div>

            {/* Payment Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Payment Date
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
              />
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 cursor-pointer"
              >
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card Payment</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Status Box */}
          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-150 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Payment Status:
            </span>
            <span
              className={`text-[9px] font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                formData.status === "Paid"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : formData.status === "Partially Paid"
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {formData.status}
            </span>
            <span className="text-[10px] text-slate-400 font-medium ml-auto">
              (Auto-updated)
            </span>
          </div>

          {/* Remarks */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Remarks / Notes
            </label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => handleInputChange("remarks", e.target.value)}
              placeholder="e.g. UPI Ref Number, Cash receipt notes..."
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 resize-none"
            />
          </div>

          <Divider />

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-200 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <ButtonPrimary
              type="submit"
              loading={isSubmitting}
              loadingText={editingRecord ? "Saving..." : "Recording..."}
              className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md cursor-pointer"
            >
              {editingRecord ? "Save Changes" : "Record Payment"}
            </ButtonPrimary>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default PaymentModal;
