import { useState, Fragment } from "react";
import { useDispatch } from "react-redux";

import Swal from "sweetalert2";
import { toast } from "sonner";
import Grid from "@mui/joy/Grid";
import Button from "@mui/joy/Button";
import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";
import withReactContent from "sweetalert2-react-content";

import FormField from "../../components/Form/FormField";
import {
  initialEnquiryState,
  EnquiryFieldGroup,
} from "../../config/EnquiryFields";

import { formFieldColSpan } from "../../config/FormFieldConfig";

import { userEmail, userMobile } from "../../config/UserConfig";
import { addNewEnquiry } from "../../redux/enquiry/enquiryThunks";

const MySwal = withReactContent(Swal);

const numericFields = ["phone"];

const maxLengthMap = {
  phone: 10,
};

const Enquiry = () => {
  const dispatch = useDispatch();

  const [enquiry, setEnquiry] = useState(initialEnquiryState);

  const handleChange = (name, value) => {
    if (numericFields.includes(name) && isNaN(Number(value))) return;

    if (maxLengthMap[name] && value.length > maxLengthMap[name]) return;

    setEnquiry((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = Object.values(enquiry).every(
      (value) => value.trim() !== "",
    );
    if (!isFormValid) return toast.warning("All Fields are Required.");

    try {
      await dispatch(addNewEnquiry({ newEnquiry: enquiry })).unwrap();
      toast.success("Enquiry send Successfully.");
    } catch {
      toast.error("Failed to Submit Enquiry.");
    } finally {
      setEnquiry(initialEnquiryState);
    }
  };

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
        <Grid
          sx={{ p: 4, px: 3, borderRadius: 9 }}
          className="bg-white w-150 max-w-3xl shadow-md flex flex-col"
        >
          <div className="font-bold text-2xl text-center mb-4">
            LET US SERVE YOU BETTER
          </div>

          <form
            className="flex flex-col flex-1 justify-between"
            onSubmit={handleSubmit}
          >
            {/* Scrollable form area */}
            <div className="grid grid-cols-12 gap-2 px-6 pb-5 max-h-[75vh] overflow-y-auto overflow-x-hidden no-scrollbar">
              {EnquiryFieldGroup.map((group, index) => (
                <Fragment key={`group_${group.title}_${index}`}>
                  <div className="col-span-12 text-sm font-semibold mt-2">
                    {group.title}
                  </div>

                  {group.fields.map(
                    (field) =>
                      (!field.showIf || field.showIf(enquiry)) && (
                        <div
                          key={field.name}
                          className={formFieldColSpan(field.size)}
                        >
                          <FormField
                            field={field}
                            value={enquiry[field.name]}
                            label={false}
                            onChange={handleChange}
                            disabled={field.disabled}
                          />
                        </div>
                      ),
                  )}
                </Fragment>
              ))}
            </div>
            <div className="mx-5">
              <Button
                type="submit"
                size="md"
                variant="solid"
                fullWidth
                sx={{
                  backgroundColor: "black",
                  mt: 1,
                  "&:hover": { backgroundColor: "#2A2A2A" },
                }}
              >
                Submit
              </Button>
            </div>
          </form>

          {/* Contact Info */}
          <div className="flex flex-row gap-5 mt-4 ms-4 text-sm items-center text-gray-500">
            <div className="font-medium whitespace-nowrap">Reach us:</div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 hover:cursor-pointer">
                <i className="fa-regular fa-circle-phone" aria-hidden="true" />
                <span>{userMobile}</span>
              </div>

              <span className="text-gray-400 select-none">|</span>

              <div className="flex items-center gap-2 hover:cursor-pointer">
                <i className="fa-regular fa-envelope" aria-hidden="true" />
                <span>{userEmail}</span>
              </div>
            </div>
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default Enquiry;
