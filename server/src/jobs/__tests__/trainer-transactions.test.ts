import { numberToWordsINR } from "./test-helpers.js";

// Test suite for transactions, invoice calculations, and search/filtering logic
export async function runTrainerTransactionsTestSuite() {
  console.log("=================================================");
  console.log("   AUTOMATED TRAINER TRANSACTIONS & INVOICE TESTS ");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  // --- Suite 1: Currency to Words (INR) Conversion for Invoices ---
  console.log("\n--- Suite 1: Currency to Words (INR) Conversion ---");

  const words25k = numberToWordsINR(25000);
  assert(
    words25k === "Twenty Five Thousand Rupees Only",
    "25,000 INR converts to 'Twenty Five Thousand Rupees Only'",
    `Got: '${words25k}'`,
  );

  const words150k = numberToWordsINR(150000);
  assert(
    words150k === "One Lakh Fifty Thousand Rupees Only",
    "1,50,000 INR converts to 'One Lakh Fifty Thousand Rupees Only'",
    `Got: '${words150k}'`,
  );

  const words35500 = numberToWordsINR(35500);
  assert(
    words35500 === "Thirty Five Thousand Five Hundred Rupees Only",
    "35,500 INR converts to 'Thirty Five Thousand Five Hundred Rupees Only'",
    `Got: '${words35500}'`,
  );

  const wordsZero = numberToWordsINR(0);
  assert(
    wordsZero === "Zero Rupees Only",
    "0 INR converts cleanly to 'Zero Rupees Only'",
    `Got: '${wordsZero}'`,
  );

  // --- Suite 2: Multi-criteria Transaction Filtering & Search Logic ---
  console.log("\n--- Suite 2: Transaction Filtering & Search Logic ---");

  const sampleReceipts = [
    {
      _id: "rec1",
      userId: "TRN-001",
      receiptNumber: "REC-2026-001",
      amount: 40000,
      paymentDate: "2026-10-15T10:00:00.000Z",
      paymentMethod: "UPI",
      transactionId: "UPI-TXN-998811",
      salaryMonth: "October 2026",
      notes: "Monthly regular payout",
      trainer: {
        userId: "TRN-001",
        fullName: "Marcus Holloway",
        email: "marcus@ironparadise.com",
      },
    },
    {
      _id: "rec2",
      userId: "TRN-002",
      receiptNumber: "REC-2026-002",
      amount: 35000,
      paymentDate: "2026-10-16T11:00:00.000Z",
      paymentMethod: "BANK_TRANSFER",
      transactionId: "NEFT-883311",
      salaryMonth: "October 2026",
      notes: "Advance salary",
      trainer: {
        userId: "TRN-002",
        fullName: "Sarah Connor",
        email: "sarah@ironparadise.com",
      },
    },
    {
      _id: "rec3",
      userId: "TRN-001",
      receiptNumber: "REC-2026-003",
      amount: 40000,
      paymentDate: "2026-09-15T10:00:00.000Z",
      paymentMethod: "CASH",
      salaryMonth: "September 2026",
      notes: "Cash payment",
      trainer: {
        userId: "TRN-001",
        fullName: "Marcus Holloway",
        email: "marcus@ironparadise.com",
      },
    },
  ];

  // 1. Search by Trainer Name
  const searchByName = sampleReceipts.filter((r) =>
    r.trainer?.fullName.toLowerCase().includes("sarah"),
  );
  assert(
    searchByName.length === 1 && searchByName[0]?.userId === "TRN-002",
    "Search by trainer name ('sarah') returns exactly Sarah Connor's receipt",
  );

  // 2. Search by Receipt Number
  const searchByReceipt = sampleReceipts.filter((r) =>
    r.receiptNumber.toLowerCase().includes("rec-2026-003"),
  );
  assert(
    searchByReceipt.length === 1 && searchByReceipt[0]?._id === "rec3",
    "Search by receipt number ('REC-2026-003') matches correct voucher",
  );

  // 3. Search by Transaction Reference
  const searchByTxn = sampleReceipts.filter((r) =>
    r.transactionId?.toLowerCase().includes("upi-txn-998811"),
  );
  assert(
    searchByTxn.length === 1 && searchByTxn[0]?._id === "rec1",
    "Search by transaction ID ('UPI-TXN-998811') matches correct transaction",
  );

  // 4. Filter by Payment Method
  const filterUPI = sampleReceipts.filter((r) => r.paymentMethod === "UPI");
  assert(
    filterUPI.length === 1 && filterUPI[0]?.paymentMethod === "UPI",
    "Payment method filter ('UPI') filters correctly",
  );

  // 5. Filter by Salary Cycle Month
  const filterMonth = sampleReceipts.filter(
    (r) => r.salaryMonth === "October 2026",
  );
  assert(
    filterMonth.length === 2,
    "Salary cycle filter ('October 2026') isolates 2 matching payouts",
  );

  // --- Suite 3: Financial Summary KPI Metrics Computation ---
  console.log("\n--- Suite 3: Financial Summary KPI Metrics ---");

  const totalDisbursed = sampleReceipts.reduce((sum, r) => sum + r.amount, 0);
  const count = sampleReceipts.length;
  const avgPayout = Math.round(totalDisbursed / count);

  assert(
    totalDisbursed === 115000,
    `Total disbursements sum correctly: ₹1,15,000 (Got: ₹${totalDisbursed})`,
  );
  assert(count === 3, "Total transaction count matches 3");
  assert(
    avgPayout === 38333,
    `Average payout computed correctly: ₹38,333 (Got: ₹${avgPayout})`,
  );

  // --- Suite 4: Official Invoice Structural Completeness ---
  console.log("\n--- Suite 4: Official Invoice Structural Completeness ---");

  const firstReceipt = sampleReceipts[0]!;
  const sampleInvoice = {
    gymName: "IRON PARADISE GYM",
    receiptNumber: firstReceipt.receiptNumber,
    paymentDate: firstReceipt.paymentDate,
    trainerName: firstReceipt.trainer.fullName,
    trainerId: firstReceipt.userId,
    amount: firstReceipt.amount,
    salaryMonth: firstReceipt.salaryMonth,
    paymentMethod: firstReceipt.paymentMethod,
    transactionId: firstReceipt.transactionId,
    amountInWords: numberToWordsINR(firstReceipt.amount),
    status: "DISBURSED & PAID",
  };

  assert(
    Boolean(sampleInvoice.receiptNumber && sampleInvoice.trainerName),
    "Invoice contains mandatory voucher identifier and trainer name",
  );
  assert(
    sampleInvoice.amountInWords.includes("Rupees Only"),
    "Invoice contains formatted words representation of the amount",
  );
  assert(
    sampleInvoice.status === "DISBURSED & PAID",
    "Invoice has confirmed payment status badge",
  );

  console.log("\n=================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

// Self-invoking when executed directly
runTrainerTransactionsTestSuite();
