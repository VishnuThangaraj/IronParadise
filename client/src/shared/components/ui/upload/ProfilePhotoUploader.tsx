import React, { useRef, useState } from "react";
import { LuCamera, LuImage, LuLoader, LuTrash2, LuUpload, LuUser } from "react-icons/lu";
import Button from "@/shared/components/ui/buttons/Button";
import { useToast } from "@/shared/components/ui/toast";
import { uploadProfileImageApi } from "@/shared/api/upload.api";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import { getInitials } from "@/shared/hooks/getInitials";

export interface ProfilePhotoUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  name?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  value = "",
  onChange,
  name = "User",
  label = "Profile Photo",
  description = "Supports JPG, PNG, or WebP up to 5MB. Face-centered automatic crop.",
  disabled = false,
  className = "",
  size = "md",
}) => {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-20 h-20 text-xl",
    md: "w-24 h-24 sm:w-28 sm:h-28 text-2xl",
    lg: "w-32 h-32 text-3xl",
  }[size];

  const handleFileProcess = async (file: File) => {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      addToast({
        type: "error",
        message: "Invalid file type. Please upload a JPG, PNG, or WebP image.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      addToast({
        type: "error",
        message: "File is too large. Image size must be 5MB or less.",
      });
      return;
    }

    try {
      setIsUploading(true);
      setImageError(false);
      const res = await uploadProfileImageApi(file);
      if (res?.data?.url) {
        onChange(res.data.url);
        addToast({
          type: "success",
          message: res.data.isCloudinary
            ? "Photo uploaded successfully to Cloudinary!"
            : "Photo uploaded successfully!",
        });
      } else {
        throw new Error(res?.message || "Upload did not return an image URL");
      }
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to upload photo. Please try again.";
      addToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleTriggerPicker = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isUploading) return;
    onChange("");
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    addToast({
      type: "info",
      message: "Profile photo removed",
    });
  };

  const hasImage = Boolean(value) && !imageError;
  const gradientClass = getDeterministicGradient(name || "Profile");
  const initials = getInitials(name || "User");

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <LuImage size={13} className="text-indigo-500" />
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md transition-all">
        {/* Avatar Display / Drop Zone */}
        <div
          onClick={handleTriggerPicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleTriggerPicker();
            }
          }}
          className={`relative ${sizeClasses} rounded-2xl shrink-0 cursor-pointer overflow-hidden border-2 transition-all flex items-center justify-center select-none shadow-md ${
            isDragging
              ? "border-indigo-500 ring-4 ring-indigo-500/20 scale-102"
              : "border-slate-200 dark:border-white/15 hover:border-indigo-400 dark:hover:border-indigo-500/60"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          title={hasImage ? "Click to change photo" : "Click to upload photo"}
        >
          {hasImage ? (
            <img
              src={value}
              alt={name}
              className="w-full h-full object-cover rounded-2xl"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={`w-full h-full ${gradientClass} flex flex-col items-center justify-center text-white font-extrabold shadow-inner`}
            >
              {name && name.trim() ? initials : <LuUser size={32} />}
            </div>
          )}

          {/* Hover Camera Overlay (when not uploading) */}
          {!isUploading && !disabled && (
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-xs">
              <LuCamera size={22} className="drop-shadow-md" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {hasImage ? "Change" : "Upload"}
              </span>
            </div>
          )}

          {/* Uploading Spinner Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-1.5 z-10">
              <LuLoader size={26} className="animate-spin text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Uploading
              </span>
            </div>
          )}
        </div>

        {/* Action Controls & Description */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="primary-light"
              size="sm"
              disabled={disabled || isUploading}
              onClick={handleTriggerPicker}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
            >
              <LuUpload size={14} />
              {hasImage ? "Change Photo" : "Upload Photo"}
            </Button>

            {hasImage && (
              <Button
                type="button"
                variant="red"
                size="sm"
                disabled={disabled || isUploading}
                onClick={handleRemovePhoto}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
              >
                <LuTrash2 size={14} />
                Remove
              </Button>
            )}
          </div>

          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUploader;
