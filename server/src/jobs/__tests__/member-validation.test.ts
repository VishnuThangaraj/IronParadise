import {
  createMemberSchema,
  updateMemberSchema,
  memberAssignmentPayloadSchema,
} from "../../modules/member/member.validator.js";
import {
  createMemberAssignmentSchema,
  updateMemberAssignmentSchema,
} from "../../modules/member/member-assignment/member-assignment.validator.js";

async function runMemberValidationTestSuite() {
  console.log("=================================================");
  console.log("       MEMBER SCHEMA & VALIDATION TEST SUITE     ");
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

  // --- Suite 1: createMemberSchema with Complete Payload ---
  console.log("\n--- Suite 1: createMemberSchema with Complete Payload ---");
  const fullPayload = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    gender: "male",
    dob: "1995-05-15",
    address: "123 Fitness Ave, Iron City",
    profileImage: "https://example.com/avatar.jpg",
    membershipPlanId: "PLAN-101",
    dietPlanId: "DIET-202",
    workoutPlanId: "WORK-303",
    trainerId: "TRN-404",
    startDate: "2026-11-01",
    endDate: "2027-10-31",
    emergencyContact: {
      fullName: "Jane Doe",
      phone: "9876543211",
      relation: "Spouse",
    },
  };

  const fullResult = createMemberSchema.safeParse(fullPayload);
  assert(fullResult.success, "Full valid member payload parses successfully");
  if (fullResult.success) {
    assert(fullResult.data.fullName === "John Doe", "fullName retained");
    assert(fullResult.data.role === "member", "role defaulted to 'member'");
    assert(
      fullResult.data.membershipPlanId === "PLAN-101",
      "membershipPlanId parsed",
    );
    assert(
      fullResult.data.emergencyContact?.fullName === "Jane Doe",
      "emergencyContact parsed",
    );
  }

  // --- Suite 2: createMemberSchema with Empty String Tolerances ---
  console.log("\n--- Suite 2: Empty String Tolerance on Optional Fields ---");
  const emptyStringPayload = {
    fullName: "Alice Smith",
    email: "alice@example.com",
    gender: "female",
    phone: "",
    address: "",
    profileImage: "",
    dob: "",
    membershipPlanId: "",
    dietPlanId: "",
    workoutPlanId: "",
    trainerId: "",
    startDate: "",
    endDate: "",
    emergencyContact: {
      fullName: "",
      phone: "",
      relation: "",
    },
  };

  const emptyResult = createMemberSchema.safeParse(emptyStringPayload);
  assert(
    emptyResult.success,
    "Payload with empty strings for optional fields parses successfully without errors",
    !emptyResult.success ? JSON.stringify(emptyResult.error.format()) : undefined,
  );
  if (emptyResult.success) {
    assert(
      emptyResult.data.membershipPlanId === undefined,
      "Empty string membershipPlanId converts to undefined",
    );
    assert(
      emptyResult.data.trainerId === undefined,
      "Empty string trainerId converts to undefined",
    );
    assert(
      emptyResult.data.emergencyContact === null ||
        emptyResult.data.emergencyContact === undefined,
      "Empty emergencyContact object converts to null/undefined",
    );
    assert(
      emptyResult.data.dob === undefined,
      "Empty string dob converts to undefined",
    );
  }

  // --- Suite 3: Validation Error Handling on Invalid Fields ---
  console.log("\n--- Suite 3: Negative Validation Cases ---");
  const invalidEmailResult = createMemberSchema.safeParse({
    fullName: "Bob",
    email: "not-an-email",
    gender: "male",
  });
  assert(
    !invalidEmailResult.success,
    "Invalid email fails validation as expected",
  );

  const invalidNameResult = createMemberSchema.safeParse({
    fullName: "A",
    email: "a@example.com",
    gender: "male",
  });
  assert(
    !invalidNameResult.success,
    "Name shorter than 2 chars fails validation",
  );

  const invalidGenderResult = createMemberSchema.safeParse({
    fullName: "Valid Name",
    email: "valid@example.com",
    gender: "unknown",
  });
  assert(
    !invalidGenderResult.success,
    "Invalid gender fails validation",
  );

  // --- Suite 4: updateMemberSchema Partial Updates ---
  console.log("\n--- Suite 4: updateMemberSchema Partial Updates ---");
  const partialUpdate = {
    phone: "9123456789",
    address: "New Address",
    membershipPlanId: "PLAN-888",
  };
  const updateResult = updateMemberSchema.safeParse(partialUpdate);
  assert(updateResult.success, "Partial update payload parses successfully");
  if (updateResult.success) {
    assert(
      updateResult.data.phone === "9123456789",
      "Phone updated correctly in partial payload",
    );
    assert(
      updateResult.data.membershipPlanId === "PLAN-888",
      "membershipPlanId updated correctly",
    );
  }

  // --- Suite 5: Member Assignment Validator ---
  console.log("\n--- Suite 5: memberAssignmentSchema & createMemberAssignmentSchema ---");
  const assignmentPayload = {
    assignmentId: "ASG-001",
    userId: "USR-001",
    membershipPlanId: "PLAN-101",
    trainerId: "",
    endDate: "2026-12-31",
  };

  const asgResult = createMemberAssignmentSchema.safeParse(assignmentPayload);
  assert(
    asgResult.success,
    "createMemberAssignmentSchema accepts empty string trainerId and valid dates",
    !asgResult.success ? JSON.stringify(asgResult.error.format()) : undefined,
  );
  if (asgResult.success) {
    assert(
      asgResult.data.trainerId === undefined,
      "trainerId empty string converted to undefined in assignment",
    );
  }

  console.log("\n=================================================");
  console.log(`TOTAL CHECKS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runMemberValidationTestSuite().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
