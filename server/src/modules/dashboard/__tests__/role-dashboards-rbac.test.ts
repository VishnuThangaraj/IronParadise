import mongoose from "mongoose";
import DashboardService from "../dashboard.service.js";
import TrainerService from "../../trainer/trainer.service.js";
import MemberService from "../../member/member.service.js";
import env from "../../../config/env.js";

async function runTestSuite() {
  console.log("=================================================");
  console.log("   ROLE DASHBOARDS & DATA SCOPING TEST SUITE     ");
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

  try {
    await mongoose.connect(env.MONGO_URI);

    // --- Suite 1: Trainer Customized Dashboard ---
    console.log("--- Suite 1: Trainer Customized Dashboard Overview ---");
    const trainerOverview = await DashboardService.getTrainerOverview("TRN-001");

    assert(trainerOverview.trainerProfile.userId === "TRN-001", "Trainer profile userId is TRN-001");
    assert(typeof trainerOverview.trainerProfile.fullName === "string", "Trainer has full name");
    assert(Array.isArray(trainerOverview.trainerProfile.specialization), "Trainer specialization is an array");
    assert(typeof trainerOverview.trainerProfile.shiftTime?.start === "string", "Trainer has shift start time");

    assert(typeof trainerOverview.kpis.totalAssignedMembers === "number", "Total assigned members is a number");
    assert(trainerOverview.kpis.totalAssignedMembers > 0, "Trainer TRN-001 has assigned members");
    assert(typeof trainerOverview.kpis.attendanceRate === "number", "Attendance rate % is computed");
    assert(trainerOverview.kpis.attendanceRate >= 0 && trainerOverview.kpis.attendanceRate <= 100, "Attendance rate within 0-100%");

    assert(Array.isArray(trainerOverview.assignedMembers), "assignedMembers is an array");
    assert(trainerOverview.assignedMembers.length > 0, "assignedMembers contains items");
    const sampleMember = trainerOverview.assignedMembers[0];
    assert(typeof sampleMember.userId === "string", "Assigned member has userId");
    assert(typeof sampleMember.fullName === "string", "Assigned member has fullName");
    assert(sampleMember.membershipPlan !== undefined, "Assigned member has membershipPlan property");

    assert(Array.isArray(trainerOverview.todayAttendanceFeed), "todayAttendanceFeed is an array");
    assert(typeof trainerOverview.personalStats.personalAttendanceThisMonth === "number", "Personal monthly attendance is a number");
    assert(typeof trainerOverview.personalStats.salary === "number", "Personal salary is a number");

    // --- Suite 2: Trainer Scoped Member Management & Attendance ---
    console.log("\n--- Suite 2: Trainer Scoped Member Management & Attendance ---");
    const assignedMembersRes = await TrainerService.getAssignedMembers("TRN-001");
    assert(Array.isArray(assignedMembersRes.members), "getAssignedMembers returns members array");
    assert(assignedMembersRes.totalCount > 0, "getAssignedMembers totalCount matches array length");

    // Search filter
    const searchRes = await TrainerService.getAssignedMembers("TRN-001", { search: sampleMember.fullName.slice(0, 4) });
    assert(searchRes.members.some((m: any) => m.userId === sampleMember.userId), "Search query matches assigned member");

    // Assigned attendance
    const assignedAttRes = await TrainerService.getAssignedMembersAttendance("TRN-001");
    assert(Array.isArray(assignedAttRes.records), "getAssignedMembersAttendance returns records array");
    assert(typeof assignedAttRes.pagination.total === "number", "Pagination total exists");

    // Query unassigned member isolation check
    let unassignedBlocked = false;
    try {
      await TrainerService.getAssignedMembersAttendance("TRN-001", { memberId: "MBR-999" });
    } catch (e: any) {
      unassignedBlocked = e?.statusCode === 403;
    }
    assert(unassignedBlocked, "Trainer querying unassigned member throws HTTP 403 Forbidden");

    // Trainer self payroll
    const myPayroll = await TrainerService.getMyPayroll("TRN-001");
    assert(myPayroll.payment !== null, "Trainer payment record retrieved");
    assert(Array.isArray(myPayroll.receipts), "Trainer receipts is an array");

    // --- Suite 3: Member Customized Dashboard ---
    console.log("\n--- Suite 3: Member Customized Dashboard Overview ---");
    const memberOverview = await DashboardService.getMemberOverview("MBR-001");

    assert(memberOverview.memberProfile.userId === "MBR-001", "Member profile userId is MBR-001");
    assert(typeof memberOverview.memberProfile.fullName === "string", "Member has full name");

    assert(typeof memberOverview.kpis.totalVisitsThisMonth === "number", "Member totalVisitsThisMonth is a number");
    assert(typeof memberOverview.kpis.attendanceStreak === "number", "Member streak is calculated");
    assert(["CHECKED_IN", "COMPLETED", "NOT_VISITED"].includes(memberOverview.kpis.todayGymStatus), "todayGymStatus is valid enum");

    assert(memberOverview.activeMembership !== null, "Active membership details populated");
    assert(typeof memberOverview.activeMembership?.name === "string", "Membership plan name is string");
    assert(typeof memberOverview.activeMembership?.daysRemaining === "number", "Days remaining in plan calculated");

    assert(memberOverview.assignedTrainer !== null, "Assigned trainer details populated");
    assert(memberOverview.assignedTrainer?.userId === "TRN-001", "Assigned trainer matches TRN-001");
    assert(typeof memberOverview.assignedTrainer?.fullName === "string", "Trainer name is populated");
    assert(typeof memberOverview.assignedTrainer?.shiftTime?.start === "string", "Trainer shift start time is populated");

    assert(Array.isArray(memberOverview.recentAttendance), "recentAttendance is an array");

    // --- Suite 4: Member Scoped Self Services ---
    console.log("\n--- Suite 4: Member Scoped Self Services ---");
    const myDetails = await MemberService.getMyDetails("MBR-001");
    assert(myDetails.user.userId === "MBR-001", "getMyDetails returns member profile");
    assert(myDetails.trainer !== null, "getMyDetails includes assigned trainer");
    assert(myDetails.membershipPlan !== null, "getMyDetails includes membership plan");

    const myAttendance = await MemberService.getMyAttendance("MBR-001");
    assert(Array.isArray(myAttendance.records), "getMyAttendance returns records");
    assert(typeof myAttendance.totalVisits === "number", "getMyAttendance totalVisits is a number");

    const myTrainer = await MemberService.getMyTrainer("MBR-001");
    assert(myTrainer !== null && myTrainer.userId === "TRN-001", "getMyTrainer returns Vikram Malhotra (TRN-001)");

    const myPlans = await MemberService.getMyPlans("MBR-001");
    assert(myPlans.workoutPlan !== null || myPlans.dietPlan !== null, "getMyPlans returns assigned plans");

    const myPayments = await MemberService.getMyPayments("MBR-001");
    assert(Array.isArray(myPayments.payments), "getMyPayments returns payments array");
    assert(Array.isArray(myPayments.receipts), "getMyPayments returns receipts array");

    // --- Suite 5: Edge Cases (Unassigned Member & Trainer with 0 Assignments) ---
    console.log("\n--- Suite 5: Edge Cases & Graceful Degradation ---");
    // Non-existent trainer / member
    let nonExistentTrainerCaught = false;
    try {
      await DashboardService.getTrainerOverview("TRN-NONEXISTENT");
    } catch (e: any) {
      nonExistentTrainerCaught = e?.statusCode === 404;
    }
    assert(nonExistentTrainerCaught, "Non-existent trainer overview throws HTTP 404");

    // Trainer with 0 active members (TRN-031 from seed check)
    const zeroTrainerOverview = await DashboardService.getTrainerOverview("TRN-031");
    assert(zeroTrainerOverview.kpis.activeAssignedMembers === 0, "Trainer TRN-031 has 0 active members");
    assert(zeroTrainerOverview.kpis.attendanceRate === 0, "Trainer with 0 active members has 0% attendance rate without division by zero");
    assert(Array.isArray(zeroTrainerOverview.assignedMembers), "assignedMembers is empty array without errors");

  } catch (error) {
    console.error("Test execution failed:", error);
    failed++;
  } finally {
    await mongoose.disconnect();
  }

  console.log("\n=================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
