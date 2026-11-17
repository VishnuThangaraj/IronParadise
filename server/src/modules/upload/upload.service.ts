import cloudinary from "../../config/cloudinary.js";
import env from "../../config/env.js";
import AppError from "../../shared/errors/AppError.js";

export interface UploadResult {
  url: string;
  publicId: string;
  isCloudinary: boolean;
}

class UploadService {
  public async uploadProfileImage(
    file: Express.Multer.File,
  ): Promise<UploadResult> {
    if (!file || !file.buffer) {
      throw new AppError("No file provided for upload.", 400);
    }

    if (env.isCloudinaryConfigured) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "ironparadise/profiles",
            resource_type: "image",
            transformation: [
              { width: 500, height: 500, crop: "fill", gravity: "face" },
              { quality: "auto", fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error || !result) {
              return reject(
                new AppError(
                  `Cloudinary upload failed: ${error?.message || "Unknown error"}`,
                  500,
                ),
              );
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              isCloudinary: true,
            });
          },
        );

        uploadStream.end(file.buffer);
      });
    }

    // Local / development fallback if Cloudinary credentials are not set
    const base64Data = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64Data}`;
    return {
      url: dataUri,
      publicId: `local_${Date.now()}`,
      isCloudinary: false,
    };
  }

  public async deleteImage(publicId: string): Promise<boolean> {
    if (!publicId || publicId.startsWith("local_")) {
      return true;
    }

    if (env.isCloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(publicId);
        return true;
      } catch {
        return false;
      }
    }

    return true;
  }
}

export default new UploadService();
