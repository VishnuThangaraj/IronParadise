import UserModel from "../user.model.js";
import CredentialModel from "../../../shared/models/credential.model.js";
import UserService from "../user.service.js";
import UploadService from "../../upload/upload.service.js";
import { userSchema, userUpdateSchema } from "../user.validator.js";
import { createMemberSchema, updateMemberSchema } from "../../member/member.validator.js";
import { createTrainerSchema, updateTrainerSchema } from "../../trainer/trainer.validator.js";

async function runUserProfileImageTests() {
  console.log("=================================================");
  console.log("   USER PROFILE IMAGE LIFECYCLE TEST SUITE      ");
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

  // 1. Validator tests
  const createUserParsed = userSchema.parse({
    fullName: "Test User",
    email: "test@example.com",
    gender: "male",
    profileImage: "",
  });
  assert(
    createUserParsed.profileImage === undefined,
    "userSchema omits empty profileImage on create",
  );

  const createMemberParsed = createMemberSchema.parse({
    fullName: "Test Member",
    email: "member@example.com",
    gender: "female",
    profileImage: "",
  });
  assert(
    createMemberParsed.profileImage === undefined,
    "createMemberSchema omits empty profileImage on create",
  );

  const createTrainerParsed = createTrainerSchema.parse({
    fullName: "Test Trainer",
    email: "trainer@example.com",
    gender: "other",
    profileImage: "",
  });
  assert(
    createTrainerParsed.profileImage === undefined,
    "createTrainerSchema omits empty profileImage on create",
  );

  const updateUserCleared = userUpdateSchema.parse({ profileImage: "" });
  assert(
    updateUserCleared.profileImage === "",
    "userUpdateSchema preserves empty string profileImage to allow clearing",
  );

  const updateMemberCleared = updateMemberSchema.parse({ profileImage: "" });
  assert(
    updateMemberCleared.profileImage === "",
    "updateMemberSchema preserves empty string profileImage to allow clearing",
  );

  const updateTrainerNullCleared = updateTrainerSchema.parse({ profileImage: null });
  assert(
    updateTrainerNullCleared.profileImage === "",
    "updateTrainerSchema converts null profileImage to empty string",
  );

  const updateUserOmitted = userUpdateSchema.parse({ fullName: "Renamed" });
  assert(
    updateUserOmitted.profileImage === undefined,
    "userUpdateSchema keeps omitted profileImage as undefined",
  );

  // 2. Service cleanup tests (mocking Mongoose models & UploadService.deleteImage)
  const origFindOne = UserModel.findOne;
  const origFindByIdAndUpdate = UserModel.findByIdAndUpdate;
  const origFindOneAndDelete = UserModel.findOneAndDelete;
  const origCredFindOneAndDelete = CredentialModel.findOneAndDelete;
  const origDeleteImage = UploadService.deleteImage;

  const deletedPublicIds: string[] = [];
  (UploadService as any).deleteImage = async (publicId: string) => {
    deletedPublicIds.push(publicId);
    return true;
  };

  try {
    const oldCloudinaryUrl =
      "https://res.cloudinary.com/demo/image/upload/v1/ironparadise/profiles/old_avatar.png";
    const newCloudinaryUrl =
      "https://res.cloudinary.com/demo/image/upload/v2/ironparadise/profiles/new_avatar.png";

    let currentMockUser = {
      _id: "507f1f77bcf86cd799439011",
      userId: "MBR-001",
      email: "mbr@example.com",
      phone: "1234567890",
      profileImage: oldCloudinaryUrl,
    };

    (UserModel as any).findOne = () => ({
      session: async () => currentMockUser,
    });
    (UserModel as any).findByIdAndUpdate = async (_id: any, update: any) => ({
      ...currentMockUser,
      ...(update?.$set || {}),
    });

    // Replace Cloudinary image -> deletes old
    deletedPublicIds.length = 0;
    await UserService.updateUser("MBR-001", { profileImage: newCloudinaryUrl });
    assert(
      deletedPublicIds.length === 1 &&
        deletedPublicIds[0] === "ironparadise/profiles/old_avatar",
      "updateUser deletes previous Cloudinary profileImage when replaced",
    );

    // Clear Cloudinary image with "" -> deletes old
    deletedPublicIds.length = 0;
    const cleared = await UserService.updateUser("MBR-001", { profileImage: "" });
    assert(
      cleared.profileImage === "" &&
        deletedPublicIds.length === 1 &&
        deletedPublicIds[0] === "ironparadise/profiles/old_avatar",
      "updateUser clears profileImage to '' and deletes previous Cloudinary asset",
    );

    // Non-Cloudinary (Unsplash) image -> does not call deleteImage
    currentMockUser = {
      ...currentMockUser,
      profileImage: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400",
    };
    deletedPublicIds.length = 0;
    await UserService.updateUser("MBR-001", { profileImage: newCloudinaryUrl });
    assert(
      deletedPublicIds.length === 0,
      "updateUser skips Cloudinary deletion when previous image is non-Cloudinary",
    );

    // Hard delete user with Cloudinary image -> deletes asset
    deletedPublicIds.length = 0;
    (UserModel as any).findOneAndDelete = async () => ({
      userId: "MBR-001",
      profileImage: newCloudinaryUrl,
    });
    (CredentialModel as any).findOneAndDelete = async () => ({});
    await UserService.hardDeleteUser("MBR-001");
    assert(
      deletedPublicIds.length === 1 &&
        deletedPublicIds[0] === "ironparadise/profiles/new_avatar",
      "hardDeleteUser deletes Cloudinary profileImage asset",
    );
  } finally {
    (UserModel as any).findOne = origFindOne;
    (UserModel as any).findByIdAndUpdate = origFindByIdAndUpdate;
    (UserModel as any).findOneAndDelete = origFindOneAndDelete;
    (CredentialModel as any).findOneAndDelete = origCredFindOneAndDelete;
    (UploadService as any).deleteImage = origDeleteImage;
  }

  console.log("\n=================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("=================================================");

  if (failed > 0) process.exit(1);
}

runUserProfileImageTests();
