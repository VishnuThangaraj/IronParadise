import { Modal } from "@mui/material";
import {
  LuPrinter,
  LuX,
  LuReceipt,
  LuCreditCard,
  LuUser,
  LuBadgeCheck,
  LuCheck,
  LuCrown,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import { formatDate } from "@/shared/utils/formatDate";
import logoLightURL from "@/shared/assets/images/logo-white.webp";
import type { MemberPaymentReceipt } from "../types/member-payment.types";

export interface MemberInvoiceModalProps {
  open: boolean;
  receipt: MemberPaymentReceipt | null;
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

export const MemberInvoiceModal = ({
  open,
  receipt,
  onClose,
}: MemberInvoiceModalProps) => {
  if (!receipt) return null;

  const memberName = receipt.fullName || `Member (${receipt.userId})`;
  const memberEmail = receipt.email || "—";
  const memberPhone = receipt.phoneNumber || "—";
  const planTitle = receipt.planName || "Gym Membership Subscription";
  const amount = Number(receipt.amountPaid) || 0;

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
            <span className="font-bold text-sm">
              Official Membership Invoice Preview
            </span>
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
                    PAYMENT CONFIRMED
                  </span>
                </span>
                <div className="flex items-center sm:justify-end gap-1.5 font-mono text-base font-extrabold text-slate-900">
                  <span className="text-slate-500 font-sans text-xs font-semibold uppercase">
                    Invoice ID:
                  </span>
                  <span>{receipt.receiptNumber}</span>
                </div>
                <div className="text-xs text-slate-500">
                  Date: {formatDate(receipt.paymentDate)}
                </div>
              </div>
            </div>

            {/* Two-Column Parties & Context Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              {/* Left Column: Billed To / Member */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <LuUser className="w-3.5 h-3.5 text-indigo-600" />
                  BILLED TO / MEMBER
                </span>
                <div className="text-sm font-extrabold text-slate-900">
                  {memberName}
                </div>
                <div className="font-mono text-slate-600 font-semibold">
                  Member ID: {receipt.userId}
                </div>
                <div className="text-slate-600">Email: {memberEmail}</div>
                <div className="text-slate-600">Contact: {memberPhone}</div>
              </div>

              {/* Right Column: Payment Details */}
              <div className="space-y-1.5 sm:text-right">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center sm:justify-end gap-1">
                  <LuCreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  TRANSACTION PARTICULARS
                </span>
                <div className="text-xs font-bold text-slate-800">
                  Mode:{" "}
                  <span className="font-mono text-indigo-600">
                    {receipt.paymentMethod}
                  </span>
                </div>
                <div className="font-mono text-slate-600">
                  Payment Ref: {receipt.paymentId}
                </div>
                {receipt.referenceNumber && (
                  <div className="font-mono text-slate-600 text-[11px]">
                    UTR / Txn: {receipt.referenceNumber}
                  </div>
                )}
                {receipt.remarks && (
                  <div className="text-slate-500 italic text-[11px]">
                    Remarks: &ldquo;{receipt.remarks}&rdquo;
                  </div>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-4">Item & Description</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <LuCrown className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{planTitle}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-normal block pl-5">
                        Gym facility access, training equipment, and locker
                        privileges
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      Membership Fee
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 bg-slate-50/80 font-bold">
                    <td
                      colSpan={2}
                      className="py-3 px-4 text-right uppercase text-slate-600"
                    >
                      Total Amount Received:
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-sm text-emerald-600">
                      ₹{amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Amount in Words */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                AMOUNT IN WORDS
              </span>
              <span className="font-semibold text-slate-900 italic">
                {numberToWordsINR(amount)}
              </span>
            </div>

            {/* Signatures & Certification */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-800 block">
                  Iron Paradise Accounts Dept.
                </span>
                <p className="text-[11px] text-slate-400">
                  This document is an electronically verified fee receipt.
                </p>
                <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-bold pt-1">
                  <LuBadgeCheck className="w-3.5 h-3.5" />
                  AUTHENTICATED RECORD
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="h-9 font-serif italic text-slate-400 text-sm flex items-end justify-end">
                  Authorized Signatory
                </div>
                <div className="border-t border-slate-300 pt-1 font-semibold text-slate-800">
                  Gym Management Authority
                </div>
                <p className="text-[10px] text-slate-400">
                  Chennai, Tamil Nadu, India
                </p>
              </div>
            </div>

            {/* Footer Disclaimer */}
            <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
              Thank you for training at Iron Paradise. For billing queries,
              contact billing@ironparadise.com.
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MemberInvoiceModal;
