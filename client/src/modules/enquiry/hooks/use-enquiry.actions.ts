import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replyToEnquiry, deleteEnquiry } from "../api/enquiry.api";
import { enquiryKeys } from "./use-enquiry.fetch";
import { useToast } from "@/shared/components/ui/toast";

export const useEnquiryReply = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      replyData,
    }: {
      id: string;
      replyData: { subject: string; message: string };
    }) => replyToEnquiry(id, replyData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: enquiryKeys.all });
      addToast({
        type: "success",
        message: data.message || "Reply sent successfully!",
      });
    },
    onError: (err: unknown) => {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      addToast({
        type: "error",
        message:
          errorObj?.response?.data?.message ||
          errorObj?.message ||
          "Failed to send reply. Please try again.",
      });
    },
  });
};

export const useEnquiryDelete = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteEnquiry(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: enquiryKeys.all });
      addToast({
        type: "success",
        message: data.message || "Enquiry deleted successfully!",
      });
    },
    onError: (err: unknown) => {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      addToast({
        type: "error",
        message:
          errorObj?.response?.data?.message ||
          errorObj?.message ||
          "Failed to delete enquiry. Please try again.",
      });
    },
  });
};
