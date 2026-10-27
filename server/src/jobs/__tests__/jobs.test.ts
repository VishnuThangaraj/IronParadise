import { initCronJobs, stopCronJobs, getActiveCronJobs } from "../cron.js";
import { isTrainerSalaryDueOnDate } from "../trainer-salary.job.js";
import {
  isSubscriptionExpiredOnDate,
  calculateSubscriptionEndDate,
} from "../member-subscription.job.js";

async function runTestSuite() {
  console.log("=================================================");
  console.log("   AUTOMATED CRON & BACKGROUND JOBS TEST SUITE   ");
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

  // --- Suite 1: Cron Registration & Lifecycle ---
  console.log("\n--- Suite 1: Cron Registration & Lifecycle ---");
  initCronJobs();
  const activeJobs = getActiveCronJobs();

  assert(
    activeJobs.includes("Trainer Salary Due Accrual"),
    "Cron registers 'Trainer Salary Due Accrual' (12:00 AM)",
  );
  assert(
    activeJobs.includes("Member Subscription Renewal & Due Accrual"),
    "Cron registers 'Member Subscription Renewal & Due Accrual' (12:00 AM)",
  );
  assert(
    activeJobs.includes("Attendance Nightly Auto Check-Out"),
    "Cron registers 'Attendance Nightly Auto Check-Out' (10:30 PM)",
  );
  assert(
    activeJobs.length === 3,
    "Exactly 3 background cron jobs active simultaneously",
  );

  stopCronJobs();
  const afterStop = getActiveCronJobs();
  assert(afterStop.length === 0, "All cron tasks stopped and cleared cleanly");

  // --- Suite 2: Trainer Salary Due Date Matching & Edge Cases ---
  console.log("\n--- Suite 2: Trainer Salary Due Date Matching & Edge Cases ---");

  // 1. Exact Day Match
  const exactMatch = isTrainerSalaryDueOnDate(
    "2023-05-15",
    new Date(2026, 9, 15), // Oct 15, 2026
  );
  assert(
    exactMatch === true,
    "Salary matures when target calendar day matches join day (15th == 15th)",
  );

  // 2. Day Mismatch
  const dayMismatch = isTrainerSalaryDueOnDate(
    "2023-05-15",
    new Date(2026, 9, 14), // Oct 14, 2026
  );
  assert(
    dayMismatch === false,
    "Salary does not mature when target day does not match join day (14th != 15th)",
  );

  // 3. New joiner in same month (tenure < 1 month)
  const newJoiner = isTrainerSalaryDueOnDate(
    "2026-10-15",
    new Date(2026, 9, 15), // Same month joiner
  );
  assert(
    newJoiner === false,
    "New joiner in current month cycle does not immediately accrue salary",
  );

  // 4. Month-End Clamping: Joined on 31st, evaluated on April 30 (30-day month)
  const aprilClamp = isTrainerSalaryDueOnDate(
    "2024-01-31",
    new Date(2026, 3, 30), // April 30, 2026 (last day of April)
  );
  assert(
    aprilClamp === true,
    "31st joiner correctly matures on 30th in 30-day month (April 30 clamp)",
  );

  // 5. Month-End Clamping: Joined on 31st, evaluated on April 29
  const aprilPreClamp = isTrainerSalaryDueOnDate(
    "2024-01-31",
    new Date(2026, 3, 29), // April 29, 2026 (not last day)
  );
  assert(
    aprilPreClamp === false,
    "31st joiner does not mature before month end (April 29)",
  );

  // 6. Month-End Clamping: February non-leap year (Feb 28)
  const febClamp = isTrainerSalaryDueOnDate(
    "2024-01-31",
    new Date(2026, 1, 28), // Feb 28, 2026 (non-leap year last day)
  );
  assert(
    febClamp === true,
    "31st joiner correctly matures on Feb 28 in non-leap year",
  );

  // 7. Month-End Clamping: February leap year (Feb 29)
  const febLeapClamp = isTrainerSalaryDueOnDate(
    "2024-01-31",
    new Date(2028, 1, 29), // Feb 29, 2028 (leap year last day)
  );
  assert(
    febLeapClamp === true,
    "31st joiner correctly matures on Feb 29 in leap year",
  );

  // --- Suite 3: Attendance Auto Check-Out Calculation & Tagging ---
  console.log("\n--- Suite 3: Attendance Auto Check-Out Calculation & Tagging ---");

  // Duration calculation for 18:00 checkin to 22:30 checkout
  const checkIn = new Date("2026-10-25T18:00:00.000Z");
  const checkOut = new Date("2026-10-25T22:30:00.000Z");
  const durationMs = checkOut.getTime() - checkIn.getTime();
  const durationMinutes = Math.round(durationMs / 60000);

  assert(
    durationMinutes === 270,
    "Duration calculation: 18:00 check-in to 22:30 check-out is exactly 270 minutes (4.5h)",
  );

  // Note tagging without erasing existing notes
  const userNote = "Leg hypertrophy and squats";
  const systemTag = "[Auto check-out at 10:30 PM by system]";
  const combinedNote = userNote ? `${userNote} | ${systemTag}` : systemTag;

  assert(
    combinedNote.includes(userNote) && combinedNote.includes(systemTag),
    "Note tagging preserves existing user notes and appends system audit trail",
  );

  // Note tagging when user had empty note
  const emptyNote = "";
  const combinedEmpty = emptyNote ? `${emptyNote} | ${systemTag}` : systemTag;
  assert(
    combinedEmpty === systemTag,
    "Note tagging on empty notes sets cleanly without extra separators",
  );

  // --- Suite 4: Member Subscription Renewal & Due Date Matching ---
  console.log("\n--- Suite 4: Member Subscription Renewal & Due Date Matching ---");

  // 1. Subscription Expired when endDate is in the past
  const pastExpired = isSubscriptionExpiredOnDate(
    "2026-10-20",
    new Date("2026-10-27"),
  );
  assert(
    pastExpired === true,
    "Subscription expires when endDate is strictly prior to targetDate (2026-10-20 < 2026-10-27)",
  );

  // 2. Subscription Expired when endDate is today
  const todayExpired = isSubscriptionExpiredOnDate(
    "2026-10-27",
    new Date("2026-10-27"),
  );
  assert(
    todayExpired === true,
    "Subscription matures and expires on exact matching targetDate (2026-10-27 == 2026-10-27)",
  );

  // 3. Subscription Active when endDate is in the future
  const futureActive = isSubscriptionExpiredOnDate(
    "2026-11-15",
    new Date("2026-10-27"),
  );
  assert(
    futureActive === false,
    "Subscription remains active when endDate is in the future (2026-11-15 > 2026-10-27)",
  );

  // 4. Calculate Subscription Renewal End Date
  const startDate = new Date(2026, 0, 15); // Jan 15, 2026
  const end1Month = calculateSubscriptionEndDate(startDate, 1);
  assert(
    end1Month.getFullYear() === 2026 && end1Month.getMonth() === 1 && end1Month.getDate() === 15,
    "1 Month plan renewal advances endDate by exactly 1 month (Jan 15 -> Feb 15)",
  );

  const end3Month = calculateSubscriptionEndDate(startDate, 3);
  assert(
    end3Month.getFullYear() === 2026 && end3Month.getMonth() === 3 && end3Month.getDate() === 15,
    "3 Month plan renewal advances endDate by exactly 3 months (Jan 15 -> Apr 15)",
  );

  const end12Month = calculateSubscriptionEndDate(startDate, 12);
  assert(
    end12Month.getFullYear() === 2027 && end12Month.getMonth() === 0 && end12Month.getDate() === 15,
    "12 Month annual plan renewal advances endDate by exactly 12 months (Jan 15, 2026 -> Jan 15, 2027)",
  );

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
