import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/service/api";

const useEnquiry = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    userType: "member",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("enquiry/submit", formData);
      toast.success("Enquiry submitted successfully! We will get back to you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        userType: "member",
        subject: "",
        message: ""
      });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to submit enquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting
  };
};

export default useEnquiry;
