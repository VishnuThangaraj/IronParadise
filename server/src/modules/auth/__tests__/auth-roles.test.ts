import mongoose from "mongoose";
import AuthService from "../auth.service.js";
import UserModel from "../../user/user.model.js";
import { verifyToken, verifyRefreshToken } from "../../../shared/utils/jwt.js";
import env from "../../../config/env.js";

async function runAuthRolesTestSuite() {
  console.log("=================================================");
  console.log("   AUTOMATED AUTHENTICATION & ROLE TEST SUITE    ");
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

    // --- Suite 1: Trainer Authentication ---
    console.log("--- Suite 1: Trainer Authentication ---");
    const trainerLogin = await AuthService.login({
      userId: "TRN-001",
      password: "Password@123",
    });
    assert(trainerLogin.user.userId === "TRN-001", "Trainer user ID matches");
    assert(trainerLogin.user.role === "trainer", "Trainer role is 'trainer'");
    assert(typeof trainerLogin.tokens.accessToken === "string", "Trainer access token issued");
    assert(typeof trainerLogin.tokens.refreshToken === "string", "Trainer refresh token issued");

    const decodedTrainer = verifyToken(trainerLogin.tokens.accessToken);
    assert(decodedTrainer.userId === "TRN-001", "Decoded token userId matches 'TRN-001'");
    assert(decodedTrainer.role === "trainer", "Decoded token role matches 'trainer'");

    // Lowercase handling
    const trainerLowerLogin = await AuthService.login({
      userId: "trn-001",
      password: "Password@123",
    });
    assert(trainerLowerLogin.user.userId === "TRN-001", "Trainer lowercase userId input auto-normalizes");

    // --- Suite 2: Member Authentication ---
    console.log("\n--- Suite 2: Member Authentication ---");
    const memberLogin = await AuthService.login({
      userId: "MBR-001",
      password: "Password@123",
    });
    assert(memberLogin.user.userId === "MBR-001", "Member user ID matches");
    assert(memberLogin.user.role === "member", "Member role is 'member'");
    assert(typeof memberLogin.tokens.accessToken === "string", "Member access token issued");

    const decodedMember = verifyToken(memberLogin.tokens.accessToken);
    assert(decodedMember.userId === "MBR-001", "Decoded token userId matches 'MBR-001'");
    assert(decodedMember.role === "member", "Decoded token role matches 'member'");

    // Refresh token renewal
    const refreshed = await AuthService.refreshToken({
      refreshToken: memberLogin.tokens.refreshToken,
    });
    assert(typeof refreshed.tokens.accessToken === "string", "Member refresh token successfully issues new access token");

    // --- Suite 3: Negative Auth Cases & Account Lockout ---
    console.log("\n--- Suite 3: Negative Auth & Inactive Accounts ---");
    let invalidPassCaught = false;
    try {
      await AuthService.login({ userId: "TRN-001", password: "WrongPassword999!" });
    } catch (e: any) {
      invalidPassCaught = e?.statusCode === 401;
    }
    assert(invalidPassCaught, "Invalid password throws HTTP 401");

    let nonExistentCaught = false;
    try {
      await AuthService.login({ userId: "TRN-999", password: "Password@123" });
    } catch (e: any) {
      nonExistentCaught = e?.statusCode === 401 || e?.statusCode === 404;
    }
    assert(nonExistentCaught, "Non-existent user throws 401/404");

    // Temporarily deactivate a test member to verify 403
    const testUser = await UserModel.findOne({ userId: "MBR-001" });
    if (testUser) {
      testUser.isActive = false;
      await testUser.save();

      let inactiveCaught = false;
      try {
        await AuthService.login({ userId: "MBR-001", password: "Password@123" });
      } catch (e: any) {
        inactiveCaught = e?.statusCode === 403;
      }
      assert(inactiveCaught, "Inactive member login throws HTTP 403 Forbidden");

      // Restore active state
      testUser.isActive = true;
      await testUser.save();
    }

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

runAuthRolesTestSuite();
