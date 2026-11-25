import AppError from "../../shared/errors/AppError.js";
import {
  CLOUDINARY_FOLDERS,
  deleteFromCloudinary,
  extractCloudinaryPublicId,
  uploadBufferToCloudinary,
} from "../../infrastructure/cloudinary/cloudinary.service.js";

export interface UploadResult {
  url: string;
  publicId: string;
  isCloudinary: true;
}

class UploadService {
  public async uploadProfileImage(
    file: Express.Multer.File,
  ): Promise<UploadResult> {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new AppError("No file provided for upload.", 400);
    }

    const result = await uploadBufferToCloudinary(file.buffer, {
      folder: CLOUDINARY_FOLDERS.PROFILES,
      resource_type: "image",
      transformation: [
        { width: 500, height: 500, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      isCloudinary: true,
    };
  }

  public async deleteImage(publicId: string): Promise<boolean> {
    return deleteFromCloudinary(publicId, "image");
  }

  public extractProfilePublicId(url: string): string | null {
    return extractCloudinaryPublicId(url, CLOUDINARY_FOLDERS.PROFILES);
  }
}

export default new UploadService();
