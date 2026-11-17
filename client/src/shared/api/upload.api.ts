import api from "@/shared/service/api";

export interface UploadProfileImageResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    publicId: string;
    isCloudinary: boolean;
  };
}

export const uploadProfileImageApi = async (
  file: File,
): Promise<UploadProfileImageResponse> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<UploadProfileImageResponse>(
    "/api/upload/profile-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
