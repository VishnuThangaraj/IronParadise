import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "sonner";
import Grid from "@mui/joy/Grid";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import withReactContent from "sweetalert2-react-content";

import { initialEnquiryState } from "../../config/EnquiryFields";

const MySwal = withReactContent(Swal);

const Enquiry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [enquiry, setEnquiry] = useState(initialEnquiryState);

  return (
    <div
      id="EnquiryPortal"
      key="Enquiry_Portal"
      style={{
        background:
          'url("../../../public/images/login_background.webp") center / cover no-repeat',
        width: "100vw",
      }}
      className="flex items-center justify-center h-screen "
    >
      <div className="flex flex-col gap-5 items-center">
        <img
          src="../../../public/images/logo_black.webp"
          alt="Iron Paradise"
          width={100}
        />
        <div></div>
        <Grid
          sx={{ p: 5, borderRadius: 9 }}
          className="bg-white w-120 shadow-md"
        >
          <div>a</div>
          <div className="loginform_header">
            <div className="font-bold text-xl">Enquiry</div>
            <div
              className="text-sm text-gray-500"
              style={{ letterSpacing: "1px" }}
            >
              Enter your ID and verify your name
            </div>
          </div>
          <form
            className="flex flex-col justify-between mb-1"
            // onSubmit={handleSubmit}
          >
            {/* {AttendanceFieldGroup.map((field, index) => {
                return (
                  <FormControl
                    key={`attendance-portal-${field.name}-${index}`}
                    sx={{ mt: 3 }}
                  >
                    <FormLabel className="font-semibold">
                      {field.label}
                    </FormLabel>
                    <Input
                      size="sm"
                      sx={{ py: 1 }}
                      value={attendance[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={field?.disabled ?? false}
                      variant="soft"
                    />
                  </FormControl>
                );
              })} */}
            {/* {invalidIdError && (
                <div className="text-red-500 mt-2 text-sm transition-opacity duration-200 ease-in">
                  {invalidIdError}
                </div>
              )} */}

            <div
            // className={`flex justify-between ${invalidIdError ? "mb-6 mt-2" : "my-6"} text-sm`}
            >
              <div>Verify your ID and Name before marking Attendance.</div>
            </div>
            <Button
              type="submit"
              size="md"
              className="transition-all duration-300 hover:scale-101"
              variant="solid"
              sx={{
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "#2A2A2A",
                },
              }}
              fullWidth
            >
              Mark Attendance
            </Button>
          </form>
          <div className="mt-7 flex items-center justify-between">
            <span className="text-sm">Need any help? Reach out to us</span>
            <Button
              size="md"
              className="transition-all duration-300 hover:scale-101"
              variant="outlined"
              color="neutral"
              sx={{
                border: "1px solid black",
              }}
              onClick={() => navigate("/enquiry")}
            >
              <i className="fa fa-message me-1"></i>Connect with Us
            </Button>
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default Enquiry;
