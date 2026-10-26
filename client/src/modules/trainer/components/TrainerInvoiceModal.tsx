import { Modal } from "@mui/material";
import {
  LuPrinter,
  LuX,
  LuReceipt,
  LuCreditCard,
  LuUser,
  LuBadgeCheck,
  LuCheck,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import { formatDate } from "@/shared/utils/formatDate";
import logoLightURL from "@/shared/assets/images/logo-white.webp";

import type { TrainerPaymentReceipt } from "../types/trainer-payment-receipt.types";
import type { Trainer } from "../types/trainer.types";

export interface TrainerInvoiceModalProps {
  open: boolean;
  receipt: TrainerPaymentReceipt | null;
  trainer?: Trainer | null;
  onClose: () => void;
}

// Convert INR number to words
const numberToWordsINR = (num: number): string => {
  if (!num || isNaN(num) || num <= 0) return "Zero Rupees Only";

  const a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen ",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const formatChunk = (n: number): string => {
    let str = "";
    if (n > 99) {
      str += a[Math.floor(n / 100)] + "Hundred ";
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : " ");
    } else if (n > 0) {
      str += a[n];
    }
    return str;
  };

  const integerPart = Math.floor(num);
  const crore = Math.floor(integerPart / 10000000);
  const lakh = Math.floor((integerPart % 10000000) / 100000);
  const thousand = Math.floor((integerPart % 100000) / 1000);
  const remainder = integerPart % 1000;

  let result = "";
  if (crore > 0) result += formatChunk(crore) + "Crore ";
  if (lakh > 0) result += formatChunk(lakh) + "Lakh ";
  if (thousand > 0) result += formatChunk(thousand) + "Thousand ";
  if (remainder > 0) result += formatChunk(remainder);

  return result.trim() + " Rupees Only";
};

const TrainerInvoiceModal = ({
  open,
  receipt,
  trainer,
  onClose,
}: TrainerInvoiceModalProps) => {
  if (!receipt) return null;

  // Resolve trainer info from prop or embedded receipt trainer
  const trainerInfo = trainer || receipt.trainer;
  const trainerName = trainerInfo?.fullName || `Staff (${receipt.userId})`;
  const trainerEmail = trainerInfo?.email || "—";
  const trainerPhone = trainerInfo?.phone || "—";
  const specialization =
    trainerInfo && "specialization" in trainerInfo && Array.isArray(trainerInfo.specialization)
      ? trainerInfo.specialization.join(", ")
      : "Fitness Specialist";

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={Boolean(open)}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
          },
        },
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl outline-none overflow-hidden transition-colors duration-200">
        {/* On-screen Action Toolbar (Hidden during print) */}
        <div className="no-print flex items-center justify-between p-4 px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <LuReceipt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-sm">Disbursement Voucher / Invoice Preview</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <LuPrinter className="w-4 h-4" />
              <span>Print Invoice</span>
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <LuX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-slate-800 select-text">
          <div
            id="printable-trainer-invoice"
            className="w-full bg-white text-slate-900 p-6 sm:p-8 border border-slate-200 rounded-2xl shadow-xs space-y-6"
          >
            {/* Header: Brand, Title, and Invoice Number */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-slate-800">
              {/* Gym Brand */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center p-2 shadow-xs shrink-0">
                  <img
                    src={logoLightURL}
                    alt="Iron Paradise"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase">
                    Iron Paradise Gym
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Fitness & Athletic Development Center • 100 Powerhouse Lane
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    GSTIN: 33AAAAA0000A1Z5 • support@ironparadise.com
                  </p>
                </div>
              </div>

              {/* Receipt / Invoice Identifier */}
              <div className="sm:text-right shrink-0">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-1.5">
                  <span className="inline-flex items-center gap-1">
                    <LuCheck className="w-3.5 h-3.5" />
                    DISBURSED & PAID
                  </span>
                </span>
                <div className="flex items-center sm:justify-end gap-1.5 font-mono text-base font-extrabold text-slate-900">
                  <span className="text-slate-500 font-sans text-xs font-semibold uppercase">Invoice ID:</span>
                  <span>{receipt.receiptNumber}</span>
                </div>
                <div className="text-xs text-slate-500">
                  Date: {formatDate(receipt.paymentDate)}
                </div>
              </div>
            </div>

            {/* Two-Column Parties & Context Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              {/* Left Column: Beneficiary / Trainer */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <LuUser className="w-3.5 h-3.5 text-indigo-600" />
                  BENEFICIARY / TRAINER NAME
                </span>
                <div className="text-sm font-extrabold text-slate-900">{trainerName}</div>
                <div className="font-mono text-slate-600 font-semibold">
                  Staff ID: {receipt.userId}
                </div>
                <div className="text-slate-600">Role: {specialization}</div>
                <div className="text-slate-500">
                  {trainerEmail} {trainerPhone !== "—" ? `• ${trainerPhone}` : ""}
                </div>
              </div>

              {/* Right Column: Payment Details */}
              <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:pl-6">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <LuCreditCard className="w-3.5 h-3.5 text-indigo-600" />
                  DISBURSEMENT PARTICULARS
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Salary Cycle:</span>
                  <span className="font-bold text-slate-900">{receipt.salaryMonth}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-bold text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-[11px]">
                    {receipt.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Reference / Txn:</span>
                  <span className="font-mono font-medium text-slate-700">
                    {receipt.transactionId || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[11px] font-bold">
                    <th className="p-3 w-12 text-center">#</th>
                    <th className="p-3">Invoice & Beneficiary Details</th>
                    <th className="p-3">Salary Period</th>
                    <th className="p-3 text-right">Net Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 text-center font-mono text-slate-400">01</td>
                    <td className="p-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900 text-xs">
                          {trainerName} — Staff Salary Disbursement
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                          <span>Invoice ID: <strong className="text-slate-800">{receipt.receiptNumber}</strong></span>
                          <span>•</span>
                          <span>Staff ID: <strong className="text-slate-800">{receipt.userId}</strong></span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">
                      {receipt.salaryMonth}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 text-sm">
                      ₹{Number(receipt.amount).toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Amount in Words & Total Net Box */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl bg-slate-900 text-white">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  AMOUNT IN WORDS
                </span>
                <p className="text-xs font-semibold text-slate-200 italic">
                  {numberToWordsINR(Number(receipt.amount))}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
                  TOTAL AMOUNT DISBURSED
                </span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  ₹{Number(receipt.amount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Notes if present */}
            {receipt.notes && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-0.5">Remarks / Notes:</span>
                <p className="text-slate-600 italic">&ldquo;{receipt.notes}&rdquo;</p>
              </div>
            )}

            {/* Signatory & Official Verification Seal */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Official Seal Pill */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-600 text-indigo-700 flex items-center justify-center font-bold">
                  <LuBadgeCheck className="w-6 h-6" />
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  <span className="font-bold text-slate-800 block uppercase">
                    Iron Paradise Verified
                  </span>
                  Digital payroll seal • System generated
                </div>
              </div>

              {/* Authorized Signatory Line */}
              <div className="text-center sm:text-right">
                <div className="font-serif italic text-sm text-slate-800 mb-1">
                  Authorized Signatory
                </div>
                <div className="w-44 border-b border-slate-400 mb-1 mx-auto sm:ml-auto" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Payroll & Accounts Dept.
                </span>
              </div>
            </div>

            {/* Small Footer Notice */}
            <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              This invoice is a computer-generated voucher and serves as official proof of payment. For inquiries, contact accounts@ironparadise.com.
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Hidden during print) */}
        <div className="no-print p-4 px-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="primary"
            size="sm"
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5"
          >
            <LuPrinter className="w-4 h-4" />
            <span>Print Invoice</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TrainerInvoiceModal;
