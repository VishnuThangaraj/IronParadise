import { EnquiryForm } from "../types/enquiry.types";

export const initialEnqiryFormState: EnquiryForm = {
  fullName: "",
  email: "",
  phone: "",
  role: "trainer",
  subject: "",
  message: "",
};
