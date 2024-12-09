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
          title: `Enquiry Sent Successfully !`,
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        MySwal.fire({
          icon: "error",
          title: `Failed to Send Enquiry !`,
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
      className="flex items-center justify-center h-screen"
    >
      <div
        className="flex flex-col gap-7 items-center"
        style={{ width: "40%" }}
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
            ENQUIRY FORM
          </div>
          <div className="flex flex-col gap-4 px-6 py-5">
            <div className="flex justify-between">
              <FormControl sx={{ width: "48%" }}>
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
              <FormControl sx={{ width: "48%" }}>
                <FormLabel
                  sx={{ fontSize: 15 }}
                  style={{ visibility: "hidden" }}
                >
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
            <div className="flex justify-between">
              <FormControl sx={{ width: "48%" }}>
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
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  required
                />
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
                <FormLabel
                  sx={{ fontSize: 15 }}
                  style={{ visibility: "hidden" }}
                >
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
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  required
                />
              </FormControl>
            </div>
            <div className="flex justify-between">
              <FormControl sx={{ width: "48%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Aadhar Card Number</FormLabel>
                <Input
                  placeholder="xxxx xxxx xxxx"
                  value={enquiryData.aadharNumber}
                  onChange={handleChange}
                  name="aadharNumber"
                  variant="outlined"
                  size="md"
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                />
              </FormControl>
              <FormControl sx={{ width: "48%" }}>
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
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                />
              </FormControl>
            </div>
            <div className="flex justify-between">
              <FormControl sx={{ width: "100%" }}>
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
            </div>
            <div className="flex justify-between">
              <FormControl sx={{ width: "100%" }}>
                <FormLabel sx={{ fontSize: 15 }}>Message</FormLabel>
                <Textarea
                  placeholder="Enter your Message..."
                  onChange={handleChange}
                  value={enquiryData.message}
                  variant="outlined"
                  name="message"
                  minRows={4}
                  maxRows={7}
                  sx={{
                    py: 1,
                    backgroundColor: "white",
                  }}
                  size="md"
                  required
                />
              </FormControl>
            </div>
            <div className="my-3 flex flex-row-reverse">
              <Button
                className="transition-all duration-300"
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
                fullWidth
              >
                {loading ? (
                  <Fragment>
                    <CircularProgress
                      size={20}
                      sx={{
                        color: "white",
                      }}
                    />{" "}
                    <span className="ms-5 text-base">Sending ...</span>
                  </Fragment>
                ) : (
                  "Send Enquiry"
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
