import UploadService from "../upload.service.js";
import { uploadProfileImageMiddleware } from "../../../shared/middlewares/upload.middleware.js";

async function runUploadTestSuite() {
  console.log("=================================================");
  console.log("   AUTOMATED PROFILE IMAGE & CLOUDINARY SUITE   ");
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
    // Suite 1: UploadService buffer processing
    console.log("--- Suite 1: UploadService Processing ---");
    const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]);
    const fakeJpegFile: Express.Multer.File = {
      fieldname: "image",
      originalname: "avatar.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      size: jpegBuffer.length,
      buffer: jpegBuffer,
      stream: null as any,
      destination: "",
      filename: "",
      path: "",
    };

    const uploadResult = await UploadService.uploadProfileImage(fakeJpegFile);
    assert(Boolean(uploadResult.url), "Upload returns a valid image URL");
    assert(Boolean(uploadResult.publicId), "Upload returns a publicId identifier");
    assert(typeof uploadResult.isCloudinary === "boolean", "Upload indicates Cloudinary status");

    // Suite 2: Error cases
    console.log("\n--- Suite 2: Error Handling & Validation ---");
    let errorCaught = false;
    try {
      await UploadService.uploadProfileImage(null as any);
    } catch {
      errorCaught = true;
    }
    assert(errorCaught, "UploadService throws when file is null or empty");

    // Suite 3: Delete Image
    console.log("\n--- Suite 3: Image Deletion ---");
    const deleteResult = await UploadService.deleteImage(uploadResult.publicId);
    assert(deleteResult === true, "deleteImage completes successfully");

    // Suite 4: Middleware config
    console.log("\n--- Suite 4: Multer Middleware Configuration ---");
    assert(typeof uploadProfileImageMiddleware.single === "function", "Upload middleware provides single file handler");

    console.log("\n=================================================");
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log("=================================================");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Test suite encountered error:", err);
    process.exit(1);
  }
}

runUploadTestSuite();
