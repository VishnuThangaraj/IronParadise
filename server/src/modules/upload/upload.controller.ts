import type { Request, Response, NextFunction } from "express";
import UploadService from "./upload.service.js";
import { sendResponse } from "../../shared/utils/response.js";
import AppError from "../../shared/errors/AppError.js";

class UploadController {
  public async uploadProfileImage(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError(
          "No image file uploaded. Please select an image.",
          400,
        );
      }

      const result = await UploadService.uploadProfileImage(req.file);
      sendResponse(res, 200, "Profile image uploaded successfully", result);
    } catch (error) {
      next(error);
    }
  }
}

export default new UploadController();
