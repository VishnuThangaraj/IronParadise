import type {
  TransformationOptions,
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import cloudinary from "../../config/cloudinary.js";
import AppError from "../../shared/errors/AppError.js";

export const CLOUDINARY_FOLDERS = {
  PROFILES: "ironparadise/profiles",
} as const;

export interface CloudinaryUploadOptions {
  folder?: string;
  resource_type?: "auto" | "image" | "video" | "raw";
  filename_override?: string;
  public_id?: string;
  transformation?: TransformationOptions;
}

/**
 * Upload an in-memory file buffer directly to Cloudinary via stream.
 */
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  options: CloudinaryUploadOptions = {},
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadOptions: UploadApiOptions = {
      folder: options.folder || CLOUDINARY_FOLDERS.PROFILES,
      resource_type: options.resource_type || "auto",
    };

    if (options.filename_override !== undefined) {
      uploadOptions.filename_override = options.filename_override;
    }
    if (options.public_id !== undefined) {
      uploadOptions.public_id = options.public_id;
    }
    if (options.transformation !== undefined) {
      uploadOptions.transformation = options.transformation;
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error || !result) {
          return reject(
            new AppError(
              `Cloudinary upload failed: ${error?.message || "Unknown error"}`,
              500,
            ),
          );
        }
        resolve(result);
      },
    );

    stream.end(buffer);
  });
};

/**
 * Delete an asset from Cloudinary by public ID.
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image",
): Promise<boolean> => {
  if (!publicId) {
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result?.result === "ok" || result?.result === "not found";
  } catch {
    return false;
  }
};

/**
 * Extract a Cloudinary public_id from a secure delivery URL if it belongs
 * to the specified folder prefix (e.g. "ironparadise/profiles").
 */
export const extractCloudinaryPublicId = (
  url: string,
  folderPrefix: string = CLOUDINARY_FOLDERS.PROFILES,
): string | null => {
  if (!url || !url.startsWith("http")) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("cloudinary.com")) {
      return null;
    }

    const marker = `/${folderPrefix}/`;
    const idx = parsed.pathname.indexOf(marker);
    if (idx === -1) {
      return null;
    }

    const relativePath = decodeURIComponent(parsed.pathname.slice(idx + 1));
    const withoutExtension = relativePath.replace(/\.[^/.]+$/, "");
    return withoutExtension || null;
  } catch {
    return null;
  }
};

export default {
  CLOUDINARY_FOLDERS,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  extractCloudinaryPublicId,
};
