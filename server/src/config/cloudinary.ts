import { v2 as cloudinary } from "cloudinary";
import env from "./env.js";

if (env.isCloudinaryConfigured) {
  if (env.CLOUDINARY_URL) {
    cloudinary.config({
      cloudinary_url: env.CLOUDINARY_URL,
      secure: true,
    });
  } else {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

export default cloudinary;
