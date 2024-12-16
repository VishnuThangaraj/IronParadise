import Swal from "sweetalert2";
import { toast } from "sonner";
import axios from "../service/api";
import Grid from "@mui/material/Grid2";
import { Fragment, useState } from "react";
import { CircularProgress } from "@mui/material";
import withReactContent from "sweetalert2-react-content";
import { Button, FormControl, FormLabel, Input, Textarea } from "@mui/joy";

const MySwal = withReactContent(Swal);

const Enquiry = () => {
  const [loading, setLoading] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    panNumber: "",
    aadharNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "phone" || name === "aadharNumber") && isNaN(Number(value))) {
      return;
    }

    if ((name === "panNumber" || name === "phone") && value.length > 10) return;
    if (name === "aadharNumber" && value.length > 12) return;

    setEnquiryData({ ...enquiryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (enquiryData.phone.length < 10)
      return toast.info("Phone Number should be 10 Digits.");

    if (
      enquiryData.panNumber.length > 1 &&
      enquiryData.aadharNumber.length < 12
    )
      return toast.info("Aadhar Number should be 12 Digits.");
    if (enquiryData.panNumber.length > 1 && enquiryData.panNumber.length < 10)
      return toast.info("Pan-Number should be 10 Digits.");

    setLoading(true);
    try {
      const response = await axios.post("/enquiry/add", { enquiryData });

      if (response.status === 200) {
        MySwal.fire({
          icon: "success",
          title: `Enquiry Sent Successfully!`,
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        MySwal.fire({
          icon: "error",
          title: `Failed to Send Enquiry!`,
          showConfirmButton: false,
          timer: 2500,
        });
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    } finally {
      setLoading(false);
      setEnquiryData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
        panNumber: "",
        aadharNumber: "",
      });
    }
  };

  return (
    <div
      id="enquiry"
      style={{ background: `url("images/loginBg.jpg") center no-repeat` }}
      className="flex items-center justify-center h-screen bg-cover px-4"
    >
      <div
        className="flex flex-col gap-7 items-center w-full "
        style={{ maxWidth: "600px" }}
      >
        <Grid
          sx={{ px: 3, py: 5, pb: 2, borderRadius: 3 }}
          className="bg-white w-full shadow-md"
          component="form"
          onSubmit={handleSubmit}
        >
          <div
            className="text-center font-bold text-2xl"
            style={{ letterSpacing: "1px" }}
          >
            LET US KNOW YOU BETTER
          </div>
          <div className="flex flex-col gap-4 px-2 py-5">
            {/* Name Section */}
            <div className="flex flex-wrap gap-4">
              <FormControl className="w-full sm:w-[48%]">
                <FormLabel sx={{ fontSize: 15 }}>Enter Your Name</FormLabel>
                <Input
                  value={enquiryData.firstName}
                  placeholder="First Name"
                  onChange={handleChange}
                  variant="outlined"
                  name="firstName"
                  size="md"
                  sx={{ py: 1 }}
                  required
                />
              </FormControl>
              <FormControl className="w-full sm:w-[48%]">
                <FormLabel sx={{ fontSize: 15, visibility: "hidden" }}>
                  d
                </FormLabel>
                <Input
                  value={enquiryData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  variant="outlined"
                  name="lastName"
                  size="md"
                  sx={{ py: 1 }}
                  required
                />
              </FormControl>
            </div>
            {/* Contact Details */}
            <div className="flex flex-wrap gap-4">
              <FormControl className="w-full sm:w-[48%]">
                <FormLabel sx={{ fontSize: 15 }}>
                  Enter Your Contact Details
                </FormLabel>
                <Input
                  placeholder="example@gmail.com"
                  value={enquiryData.email}
                  onChange={handleChange}
                  variant="outlined"
                  name="email"
                  type="email"
                  size="md"
                  sx={{ py: 1 }}
                  required
                />
              </FormControl>
              <FormControl className="w-full sm:w-[48%]">
                <FormLabel sx={{ fontSize: 15, visibility: "hidden" }}>
                  Contact Number
                </FormLabel>
                <Input
                  placeholder="0000 0000 00"
                  onChange={handleChange}
                  startDecorator={"+91"}
                  value={enquiryData.phone}
                  variant="outlined"
                  name="phone"
                  size="md"
                  sx={{ py: 1 }}
                  required
                />
              </FormControl>
            </div>
            {/* Aadhar and Pan */}
            <div className="flex flex-wrap gap-4">
              <FormControl className="w-full sm:w-[48%]">
                <FormLabel sx={{ fontSize: 15 }}>Aadhar Card Number</FormLabel>
                <Input
                  placeholder="xxxx xxxx xxxx"
                  value={enquiryData.aadharNumber}
                  onChange={handleChange}
                  name="aadharNumber"
                  variant="outlined"
                  size="md"
                  sx={{ py: 1 }}
                />
              </FormControl>
              <FormControl className="w-full sm:w-[48%]">
                <FormLabel sx={{ fontSize: 15 }}>Pan Card Number</FormLabel>
                <Input
                  value={
                    enquiryData.panNumber && enquiryData.panNumber.toUpperCase()
                  }
                  placeholder="xxxxxxxxxx"
                  onChange={handleChange}
                  variant="outlined"
                  name="panNumber"
                  size="md"
                  sx={{ py: 1 }}
                />
              </FormControl>
            </div>
            {/* Subject and Message */}
            <FormControl>
              <FormLabel sx={{ fontSize: 15 }}>Subject</FormLabel>
              <Input
                value={enquiryData.subject}
                onChange={handleChange}
                placeholder="Subject"
                variant="outlined"
                name="subject"
                size="md"
                sx={{ py: 1 }}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel sx={{ fontSize: 15 }}>Message</FormLabel>
              <Textarea
                placeholder="Enter your Message..."
                onChange={handleChange}
                value={enquiryData.message}
                variant="outlined"
                name="message"
                minRows={4}
                maxRows={7}
                sx={{ py: 1 }}
                size="md"
                required
              />
            </FormControl>
            {/* Submit Button */}
            <div className="mt-3">
              <Button
                className="w-full transition-all duration-300"
                variant="solid"
                type="submit"
                size="md"
                sx={{
                  px: 5,
                  backgroundColor: "black",
                  "&:hover": {
                    backgroundColor: "#222222",
                  },
                }}
                disabled={loading}
              >
                {loading ? (
                  <Fragment>
                    <CircularProgress size={20} sx={{ color: "white" }} />{" "}
                    <span className="ms-3">Submitting ...</span>
                  </Fragment>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default Enquiry;
