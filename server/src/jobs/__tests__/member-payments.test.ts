/**
 * Automated Test Suite for Member Payment, Subscription Dues, and Invoices
 */

function numberToWordsINR(num: number): string {
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
}

function calculatePaymentUpdate(
  totalAmount: number,
  currentAmountPaid: number,
  incomingPayment: number,
) {
  const newAmountPaid = currentAmountPaid + incomingPayment;
  const newAmountDue = Math.max(0, totalAmount - newAmountPaid);
  let newStatus: "PENDING" | "PARTIAL" | "PAID" = "PENDING";
  if (newAmountDue <= 0) {
    newStatus = "PAID";
  } else if (newAmountPaid > 0) {
    newStatus = "PARTIAL";
  }
  return { newAmountPaid, newAmountDue, newStatus };
}

async function runTestSuite() {
  console.log("=================================================");
  console.log("   AUTOMATED MEMBER PAYMENT & INVOICE TESTS     ");
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

  // --- Suite 1: Payment Update & Balance Calculation ---
  console.log("--- Suite 1: Payment Update & Balance Calculation ---");

  // Full settlement
  const fullPay = calculatePaymentUpdate(15999, 0, 15999);
  assert(
    fullPay.newAmountPaid === 15999 && fullPay.newAmountDue === 0 && fullPay.newStatus === "PAID",
    "Full payment clears balance to ₹0 and transitions status to PAID",
  );

  // Partial settlement
  const partialPay = calculatePaymentUpdate(15999, 0, 5000);
  assert(
    partialPay.newAmountPaid === 5000 && partialPay.newAmountDue === 10999 && partialPay.newStatus === "PARTIAL",
    "Partial payment reduces due balance to ₹10,999 and sets status to PARTIAL",
  );

  // Second partial settlement completing balance
  const completePay = calculatePaymentUpdate(15999, 5000, 10999);
  assert(
    completePay.newAmountPaid === 15999 && completePay.newAmountDue === 0 && completePay.newStatus === "PAID",
    "Subsequent installment completing the remaining balance sets status to PAID",
  );

  // Overpayment clamping
  const overPay = calculatePaymentUpdate(15999, 10000, 8000);
  assert(
    overPay.newAmountDue === 0 && overPay.newStatus === "PAID",
    "Overpayment clamps due amount at 0 and maintains status PAID",
  );

  // --- Suite 2: Currency to Words INR Formatting ---
  console.log("\n--- Suite 2: Currency to Words INR Formatting ---");
  assert(
    numberToWordsINR(1800) === "One Thousand Eight Hundred Rupees Only",
    "1,800 INR converts to 'One Thousand Eight Hundred Rupees Only'",
  );
  assert(
    numberToWordsINR(4800) === "Four Thousand Eight Hundred Rupees Only",
    "4,800 INR converts to 'Four Thousand Eight Hundred Rupees Only'",
  );
  assert(
    numberToWordsINR(15999) === "Fifteen Thousand Nine Hundred Ninety Nine Rupees Only",
    "15,999 INR converts to 'Fifteen Thousand Nine Hundred Ninety Nine Rupees Only'",
  );
  assert(
    numberToWordsINR(0) === "Zero Rupees Only",
    "0 INR converts cleanly to 'Zero Rupees Only'",
  );

  // --- Suite 3: Paylist Filtering Logic ---
  console.log("\n--- Suite 3: Paylist Filtering Logic ---");
  const mockPayments = [
    {
      userId: "MBR-001",
      fullName: "Alex Mercer",
      planName: "Standard Annual",
      paymentStatus: "PAID",
      amountDue: 0,
    },
    {
      userId: "MBR-002",
      fullName: "Dana Scully",
      planName: "Standard Quarterly",
      paymentStatus: "PARTIAL",
      amountDue: 2400,
    },
    {
      userId: "MBR-003",
      fullName: "Fox Mulder",
      planName: "Standard Monthly",
      paymentStatus: "OVERDUE",
      amountDue: 1800,
    },
  ];

  const searchDana = mockPayments.filter((p) =>
    p.fullName.toLowerCase().includes("dana"),
  );
  assert(
    searchDana.length === 1 && searchDana[0]?.userId === "MBR-002",
    "Search by member name isolates exact member",
  );

  const overdueOnly = mockPayments.filter((p) => p.paymentStatus === "OVERDUE");
  assert(
    overdueOnly.length === 1 && overdueOnly[0]?.userId === "MBR-003",
    "Status filter 'OVERDUE' isolates overdue accounts",
  );

  const totalDuesSum = mockPayments.reduce((acc, p) => acc + p.amountDue, 0);
  assert(totalDuesSum === 4200, "Aggregate dues sum matches ₹4,200 (Got: " + totalDuesSum + ")");

  console.log("\n=================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite();
