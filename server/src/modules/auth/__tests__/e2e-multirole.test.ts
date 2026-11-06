import mongoose from "mongoose";
import http from "node:http";
import jwt from "jsonwebtoken";
import app from "../../../app.js";
import env from "../../../config/env.js";

async function runE2ETests() {
  console.log("=================================================");
  console.log("   END-TO-END MULTI-ROLE HTTP INTEGRATION SUITE  ");
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

  let server: http.Server;
  let baseUrl: string;

  try {
    await mongoose.connect(env.MONGO_URI);

    // Spin up ephemeral test server
    server = app.listen(0);
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 3000;
    baseUrl = `http://127.0.0.1:${port}`;

    // --- Suite 1: Authentication & Token Generation ---
    console.log("--- Suite 1: Authentication & Token Issuance ---");

    // 1. Trainer Login
    const trainerLoginRes = await fetch(`${baseUrl}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "trn-001", password: "Password@123" }),
    });
    const trainerLoginData = await trainerLoginRes.json();
    assert(trainerLoginRes.status === 200, "Trainer login returns HTTP 200");
    assert(trainerLoginData.data?.user?.role === "trainer", "Trainer role is 'trainer'");
    assert(trainerLoginData.data?.user?.userId === "TRN-001", "Trainer userId normalized to 'TRN-001'");
    const trainerToken = trainerLoginData.data?.tokens?.accessToken;
    assert(typeof trainerToken === "string", "Trainer access token issued");

    // 2. Member Login
    const memberLoginRes = await fetch(`${baseUrl}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "mbr-001", password: "Password@123" }),
    });
    const memberLoginData = await memberLoginRes.json();
    assert(memberLoginRes.status === 200, "Member login returns HTTP 200");
    assert(memberLoginData.data?.user?.role === "member", "Member role is 'member'");
    assert(memberLoginData.data?.user?.userId === "MBR-001", "Member userId normalized to 'MBR-001'");
    const memberToken = memberLoginData.data?.tokens?.accessToken;
    assert(typeof memberToken === "string", "Member access token issued");

    // 3. Admin Token (Signed with JWT_SECRET)
    const adminToken = jwt.sign(
      { userId: "ADM-001", role: "admin", email: "admin@ironparadise.com" },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    assert(typeof adminToken === "string", "Admin token generated successfully");

    // --- Suite 2: Role-Aware Dashboard Overview ---
    console.log("\n--- Suite 2: Role-Aware Dashboard Endpoint (/api/dashboard/overview) ---");

    // Unauthenticated
    const noAuthDashboard = await fetch(`${baseUrl}/api/dashboard/overview`);
    assert(noAuthDashboard.status === 401, "Unauthenticated dashboard request returns HTTP 401");

    // Trainer Dashboard
    const trainerDashRes = await fetch(`${baseUrl}/api/dashboard/overview`, {
      headers: { Authorization: `Bearer ${trainerToken}` },
    });
    const trainerDashData = await trainerDashRes.json();
    assert(trainerDashRes.status === 200, "Trainer dashboard overview returns HTTP 200");
    assert(trainerDashData.data?.trainerProfile?.userId === "TRN-001", "Trainer profile matches TRN-001");
    assert(typeof trainerDashData.data?.kpis?.totalAssignedMembers === "number", "Trainer KPIs totalAssignedMembers is present");
    assert(Array.isArray(trainerDashData.data?.assignedMembers), "Trainer assignedMembers array returned");

    // Member Dashboard
    const memberDashRes = await fetch(`${baseUrl}/api/dashboard/overview`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    const memberDashData = await memberDashRes.json();
    assert(memberDashRes.status === 200, "Member dashboard overview returns HTTP 200");
    assert(memberDashData.data?.memberProfile?.userId === "MBR-001", "Member profile matches MBR-001");
    assert(typeof memberDashData.data?.kpis?.attendanceStreak === "number", "Member KPIs attendanceStreak is present");
    assert(memberDashData.data?.activeMembership !== undefined, "Member activeMembership returned");

    // Admin Dashboard
    const adminDashRes = await fetch(`${baseUrl}/api/dashboard/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminDashData = await adminDashRes.json();
    assert(adminDashRes.status === 200, "Admin dashboard overview returns HTTP 200");
    assert(typeof adminDashData.data?.kpis?.totalMembers === "number", "Admin KPIs totalMembers is present");
    assert(adminDashData.data?.financialOverview !== undefined, "Admin financialOverview returned");

    // --- Suite 3: Trainer Scoped Endpoints & RBAC Protection ---
    console.log("\n--- Suite 3: Trainer Scoped Endpoints & RBAC ---");

    // Trainer accessing assigned members
    const trainerMembersRes = await fetch(`${baseUrl}/api/trainer/my/assigned-members`, {
      headers: { Authorization: `Bearer ${trainerToken}` },
    });
    assert(trainerMembersRes.status === 200, "Trainer accessing /api/trainer/my/assigned-members returns HTTP 200");

    // Member trying to access trainer's assigned members (Privilege Escalation Check)
    const memberToTrainerMembersRes = await fetch(`${baseUrl}/api/trainer/my/assigned-members`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert(memberToTrainerMembersRes.status === 403, "Member accessing trainer endpoints returns HTTP 403 Forbidden");

    // Trainer accessing assigned attendance
    const trainerAttRes = await fetch(`${baseUrl}/api/trainer/my/assigned-members/attendance`, {
      headers: { Authorization: `Bearer ${trainerToken}` },
    });
    assert(trainerAttRes.status === 200, "Trainer accessing /api/trainer/my/assigned-members/attendance returns HTTP 200");

    // Trainer horizontal access check: Querying unassigned member
    const trainerTamperedAttRes = await fetch(`${baseUrl}/api/trainer/my/assigned-members/attendance?memberId=MBR-999`, {
      headers: { Authorization: `Bearer ${trainerToken}` },
    });
    assert(trainerTamperedAttRes.status === 403, "Trainer querying unassigned member returns HTTP 403 Forbidden");

    // Trainer accessing self-payroll
    const trainerPayrollRes = await fetch(`${baseUrl}/api/trainer/my/payroll`, {
      headers: { Authorization: `Bearer ${trainerToken}` },
    });
    assert(trainerPayrollRes.status === 200, "Trainer accessing /api/trainer/my/payroll returns HTTP 200");

    // --- Suite 4: Member Self-Service Endpoints & RBAC Protection ---
    console.log("\n--- Suite 4: Member Self-Service Endpoints & RBAC ---");

    // Member accessing self details
    const memberDetailsRes = await fetch(`${baseUrl}/api/member/my/details`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert(memberDetailsRes.status === 200, "Member accessing /api/member/my/details returns HTTP 200");

    // Trainer trying to access member self-details (Role mismatch)
    const trainerToMemberDetailsRes = await fetch(`${baseUrl}/api/member/my/details`, {
      headers: { Authorization: `Bearer ${trainerToken}` },
    });
    assert(trainerToMemberDetailsRes.status === 403, "Trainer accessing member self endpoints returns HTTP 403 Forbidden");

    // Member accessing self attendance
    const memberAttRes = await fetch(`${baseUrl}/api/member/my/attendance`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert(memberAttRes.status === 200, "Member accessing /api/member/my/attendance returns HTTP 200");

    // Member accessing assigned coach
    const memberCoachRes = await fetch(`${baseUrl}/api/member/my/trainer`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert(memberCoachRes.status === 200, "Member accessing /api/member/my/trainer returns HTTP 200");

    // Member accessing assigned plans
    const memberPlansRes = await fetch(`${baseUrl}/api/member/my/plans`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert(memberPlansRes.status === 200, "Member accessing /api/member/my/plans returns HTTP 200");

    // Member accessing self payments
    const memberPaymentsRes = await fetch(`${baseUrl}/api/member/my/payments`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    });
    assert(memberPaymentsRes.status === 200, "Member accessing /api/member/my/payments returns HTTP 200");

    // --- Suite 5: Legacy Admin Protection & Backward Compatibility ---
    console.log("\n--- Suite 5: Admin Protected Routes & Public Endpoints ---");

    // Admin route: GET /api/membership-plan/
    const adminMembershipRes = await fetch(`${baseUrl}/api/membership-plan/`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminMembershipRes.status === 200, "Admin accessing /api/membership-plan/ returns HTTP 200");

    // Member trying to execute admin action: POST /api/membership-plan/
    const memberToAdminMembershipRes = await fetch(`${baseUrl}/api/membership-plan/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${memberToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planName: "Unauthorized Plan", price: 9999 }),
    });
    assert(memberToAdminMembershipRes.status === 403, "Member blocked from POST /api/membership-plan/ with HTTP 403 Forbidden");

    // Server health ping
    const pingRes = await fetch(`${baseUrl}/`);
    assert(pingRes.status === 200, "Root server health ping returns HTTP 200");

  } catch (err) {
    console.error("E2E Test Execution error:", err);
    failed++;
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.disconnect();
  }

  console.log("\n=================================================");
  console.log(`TOTAL E2E TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runE2ETests();
