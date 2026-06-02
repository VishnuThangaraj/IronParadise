import { useState, useEffect } from "react";
import { Modal, Box, Divider } from "@mui/material";
import { LuX, LuInfo } from "react-icons/lu";

import ButtonPrimary from "@/shared/components/ui/form/button/ButtonPrimary";
import { modalBaseStyle } from "@/shared/components/ui/modal/config/modalConfig";

const initialFormState = (defaultMonth = "") => ({
  month: defaultMonth,
  paymentDate: new Date().toISOString().split("T")[0],
  paymentMethod: "Bank Transfer",
  remarks: "Bulk monthly payroll",
});

const TrainerBulkPayoutModal = ({
  isModalOpen,
  setIsModalOpen,
  isSubmitting,
  handleSubmitBulk,
  monthOptions,
}) => {
  const [formData, setFormData] = useState(
    initialFormState(monthOptions[12] || ""),
  );

  useEffect(() => {
    if (isModalOpen) {
      setFormData(initialFormState(monthOptions[12] || ""));
    }
  }, [isModalOpen, monthOptions]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmitBulk(formData);
  };

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
        <div className="bg-linear-to-r from-slate-900 to-indigo-955 px-6 py-4.5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Bulk Trainer Payout
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Pay all active gym personnel in full for a month
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
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 text-[11px] font-medium leading-relaxed">
            <LuInfo className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              This processes full payments (base salary) for all active trainers
              for the selected month. Trainers who already have payout records
              for this month will be skipped to avoid duplicate transactions.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payout Month */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Payout Month <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.month}
                onChange={(e) => handleInputChange("month", e.target.value)}
                required
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 cursor-pointer"
              >
                <option value="" disabled>
                  Select Month
                </option>
                {monthOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Payment Date
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) =>
                  handleInputChange("paymentDate", e.target.value)
                }
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
              />
            </div>

            {/* Payment Method */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) =>
                  handleInputChange("paymentMethod", e.target.value)
                }
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 cursor-pointer"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
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
              placeholder="e.g. Bulk Monthly Salary..."
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
              loadingText="Processing..."
              className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md cursor-pointer"
            >
              Process Bulk Payout
            </ButtonPrimary>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default TrainerBulkPayoutModal;
