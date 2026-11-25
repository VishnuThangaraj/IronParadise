import express from "express";
import http from "node:http";
import jwt from "jsonwebtoken";
import env from "../../../config/env.js";
import UploadService from "../upload.service.js";
import uploadRoutes from "../upload.routes.js";
import { errorHandler } from "../../../shared/middlewares/error.middleware.js";
import {
  createUploadMiddleware,
  uploadProfileImageMiddleware,
} from "../../../shared/middlewares/upload.middleware.js";
import {
  CLOUDINARY_FOLDERS,
  extractCloudinaryPublicId,
} from "../../../infrastructure/cloudinary/cloudinary.service.js";

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

  const validPngBuffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64",
  );

  try {
    // Suite 1: UploadService Cloudinary Processing
    console.log("--- Suite 1: UploadService Cloudinary Processing ---");
    const fakeImageFile: Express.Multer.File = {
      fieldname: "image",
      originalname: "avatar.png",
      encoding: "7bit",
      mimetype: "image/png",
      size: validPngBuffer.length,
      buffer: validPngBuffer,
      stream: null as any,
      destination: "",
      filename: "",
      path: "",
    };

    const uploadResult = await UploadService.uploadProfileImage(fakeImageFile);
    assert(Boolean(uploadResult.url), "Upload returns a valid image URL");
    assert(
      uploadResult.url.startsWith("https://res.cloudinary.com/") &&
        !uploadResult.url.startsWith("data:"),
      "Upload returns a Cloudinary HTTPS URL (no Base64 fallback)",
    );
    assert(
      uploadResult.publicId.startsWith(`${CLOUDINARY_FOLDERS.PROFILES}/`),
      "Upload places asset inside ironparadise/profiles folder",
    );
    assert(uploadResult.isCloudinary === true, "Upload indicates Cloudinary status is true");

    // Suite 2: Error cases
    console.log("\n--- Suite 2: Error Handling & Validation ---");
    let nullErrorCaught = false;
    try {
      await UploadService.uploadProfileImage(null as any);
    } catch {
      nullErrorCaught = true;
    }
    assert(nullErrorCaught, "UploadService throws when file is null");

    let emptyBufErrorCaught = false;
    try {
      await UploadService.uploadProfileImage({
        ...fakeImageFile,
        buffer: Buffer.alloc(0),
        size: 0,
      });
    } catch {
      emptyBufErrorCaught = true;
    }
    assert(emptyBufErrorCaught, "UploadService throws when file buffer is empty");

    // Suite 3: Public ID extraction & Image Deletion
    console.log("\n--- Suite 3: Public ID Extraction & Deletion ---");
    assert(
      extractCloudinaryPublicId(uploadResult.url) === uploadResult.publicId,
      "extractCloudinaryPublicId extracts exact publicId from uploaded URL",
    );
    assert(
      extractCloudinaryPublicId(
        "https://res.cloudinary.com/demo/image/upload/c_fill,w_500/v12345/ironparadise/profiles/abc_123.webp",
      ) === "ironparadise/profiles/abc_123",
      "extractCloudinaryPublicId handles transformations and version segments",
    );
    assert(
      extractCloudinaryPublicId("https://images.unsplash.com/photo-123?w=400") === null,
      "extractCloudinaryPublicId ignores non-Cloudinary URLs",
    );
    assert(
      extractCloudinaryPublicId("data:image/png;base64,AAAA") === null,
      "extractCloudinaryPublicId ignores Base64 Data URIs",
    );
    assert(
      extractCloudinaryPublicId(
        "https://res.cloudinary.com/demo/image/upload/v1/other/folder/file.png",
      ) === null,
      "extractCloudinaryPublicId ignores assets outside ironparadise/profiles",
    );

    const deleteResult = await UploadService.deleteImage(uploadResult.publicId);
    assert(deleteResult === true, "deleteImage deletes Cloudinary asset successfully");
    const emptyDeleteResult = await UploadService.deleteImage("");
    assert(emptyDeleteResult === false, "deleteImage returns false for empty publicId");

    // Suite 4: Multer Middleware Error Handling & Route Integration
    console.log("\n--- Suite 4: Middleware & Route Integration ---");
    assert(
      typeof uploadProfileImageMiddleware === "function",
      "uploadProfileImageMiddleware is an Express RequestHandler",
    );

    const testApp = express();
    testApp.use("/api/upload", uploadRoutes);
    testApp.post(
      "/test/tiny",
      createUploadMiddleware({ fieldName: "image", single: true, maxFileSize: 16, maxFiles: 1 }),
      (_req, res) => res.json({ ok: true }),
    );
    testApp.post(
      "/test/multi",
      createUploadMiddleware({ fieldName: "image", single: false, maxFiles: 1 }),
      (_req, res) => res.json({ ok: true }),
    );
    testApp.use(errorHandler);

    const server = http.createServer(testApp);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const port = (server.address() as any).port;
    const token = jwt.sign(
      { userId: "ADM-TEST", role: "admin" },
      env.JWT_SECRET,
      { expiresIn: "5m" },
    );

    try {
      // Unauthenticated request -> 401
      const unauthRes = await fetch(`http://127.0.0.1:${port}/api/upload/profile-image`, {
        method: "POST",
      });
      assert(unauthRes.status === 401, "Unauthenticated upload returns 401");

      // Invalid MIME type -> 400 AppError
      const badMimeForm = new FormData();
      badMimeForm.append("image", new Blob(["hello"], { type: "text/plain" }), "bad.txt");
      const badMimeRes = await fetch(`http://127.0.0.1:${port}/api/upload/profile-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: badMimeForm,
      });
      assert(badMimeRes.status === 400, "Unsupported MIME type returns 400 AppError");

      // Unexpected field -> 400 AppError (not 500)
      const badFieldForm = new FormData();
      badFieldForm.append("avatar", new Blob([validPngBuffer], { type: "image/png" }), "a.png");
      const badFieldRes = await fetch(`http://127.0.0.1:${port}/api/upload/profile-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: badFieldForm,
      });
      assert(badFieldRes.status === 400, "Unexpected upload field returns 400 AppError");

      // Size limit exceeded -> 400 AppError (not 500)
      const oversizeForm = new FormData();
      oversizeForm.append("image", new Blob([Buffer.alloc(64, 1)], { type: "image/png" }), "big.png");
      const oversizeRes = await fetch(`http://127.0.0.1:${port}/test/tiny`, {
        method: "POST",
        body: oversizeForm,
      });
      assert(oversizeRes.status === 400, "Oversized upload returns 400 AppError");

      // Count limit exceeded -> 400 AppError
      const countForm = new FormData();
      countForm.append("image", new Blob([validPngBuffer], { type: "image/png" }), "1.png");
      countForm.append("image", new Blob([validPngBuffer], { type: "image/png" }), "2.png");
      const countRes = await fetch(`http://127.0.0.1:${port}/test/multi`, {
        method: "POST",
        body: countForm,
      });
      assert(countRes.status === 400, "Excess file count returns 400 AppError");

      // Missing file -> 400 AppError
      const emptyForm = new FormData();
      const missingRes = await fetch(`http://127.0.0.1:${port}/api/upload/profile-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: emptyForm,
      });
      assert(missingRes.status === 400, "Missing file upload returns 400 AppError");

      // End-to-end authenticated route upload -> 200 + cleanup
      const validForm = new FormData();
      validForm.append("image", new Blob([validPngBuffer], { type: "image/png" }), "e2e.png");
      const e2eRes = await fetch(`http://127.0.0.1:${port}/api/upload/profile-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: validForm,
      });
      const e2eBody = (await e2eRes.json()) as any;
      assert(e2eRes.status === 200, "Authenticated valid upload returns 200");
      assert(
        e2eBody?.success === true &&
          e2eBody?.data?.isCloudinary === true &&
          typeof e2eBody?.data?.url === "string" &&
          e2eBody.data.url.startsWith("https://res.cloudinary.com/"),
        "E2E route upload returns Cloudinary URL and isCloudinary: true",
      );
      if (e2eBody?.data?.publicId) {
        const cleaned = await UploadService.deleteImage(e2eBody.data.publicId);
        assert(cleaned === true, "E2E uploaded Cloudinary asset cleaned up");
      }
    } finally {
      server.close();
    }

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
