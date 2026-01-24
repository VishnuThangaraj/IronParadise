import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import CardContent from "@mui/joy/CardContent";
import CircularProgress from "@mui/joy/CircularProgress";

import {
  MemberFieldGroup,
  initialMemberState,
} from "../../config/MemberFields";
import {
  selectMemberLoading,
  selectCurrentMember,
} from "../../redux/member/memberSelector";
import FormField from "../../components/Form/FormField";
import { PageLocation } from "../../components/PageLocation";
import { useLocation, useParams } from "react-router-dom";
import {
  fetchMemberById,
  updateMemberById,
} from "../../redux/member/memberThunks";

const getColSpan = (size) => {
  switch (size) {
    case 100:
      return "col-span-12";
    case 50:
      return "col-span-6";
    case 30:
      return "col-span-4";
    default:
      return "col-span-6";
  }
};

const numericFields = ["phone", "height", "weight", "salary", "aadharNumber"];

const maxLengthMap = {
  phone: 10,
  panNumber: 10,
  aadharNumber: 12,
};

const MemberDetails = () => {
  const dispatch = useDispatch();

  const loading = useSelector(selectMemberLoading);

  const { id } = useParams();
  const { state } = useLocation();

  const memberId = id ?? null;
  const [editMode, setEditMode] = useState(state?.edit ?? Boolean(id));

  const memberFromStore = useSelector(selectCurrentMember);

  const [member, setMember] = useState(initialMemberState);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  useEffect(() => {
    if (memberId) {
      dispatch(fetchMemberById(memberId));
    }
  }, [memberId, dispatch]);

  useEffect(() => {
    if (memberFromStore) {
      setMember({
        ...memberFromStore,
        dob: formatDateForInput(memberFromStore.dob),
        joiningDate: formatDateForInput(memberFromStore.joiningDate),
      });
    }
  }, [memberFromStore]);

  const handleChange = (name, value) => {
    if (numericFields.includes(name) && isNaN(Number(value))) return;

    if (maxLengthMap[name] && value.length > maxLengthMap[name]) return;

    if (name === "panNumber") {
      value = value.toUpperCase();
    }

    setMember((prev) => {
      const updated = { ...prev, [name]: value };

      if (name == "height" || name == "weight") {
        const height = Number(updated.height) / 100;
        const weight = Number(updated.weight);

        if (height > 0 && weight > 0) {
          updated.bmi = Number((weight / (height * height)).toFixed(2));
        } else {
          updated.bmi = "";
        }
      }

      return updated;
    });
  };

  const checkValidation = () => {
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = checkValidation();
    if (!validation) return;

    try {
      await dispatch(
        updateMemberById({ memberId: id, updatedData: member }),
      ).unwrap();
      toast.success("Member Updated Successfully!");
    } catch {
      toast.error("Failed to Update Member");
    } finally {
      setEditMode(false);
    }
  };

  return (
    <div key="Member_Details">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Member"
        currentPath="Member Details"
      />
      <Card className="shadow-md" sx={{ my: 1, mb: 4, p: 0, pb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <div className="flex justify-between border-b-2 border-gray-200 p-5">
              <div className="text-xl font-bold ">
                {editMode ? "Update Existing Member" : "View Existing Member"}
              </div>
              {!editMode && (
                <Button
                  className="transition-transform duration-400 hover:scale-103"
                  variant="solid"
                  size="md"
                  sx={{
                    px: 3,
                    backgroundColor: "black",
                    "&:hover": { backgroundColor: "#222222" },
                  }}
                  onClick={() => setEditMode(true)}
                >
                  <i className="fa-light fa-user-pen me-2"></i>Edit Member
                </Button>
              )}
            </div>

            <div className="grid grid-cols-12 gap-4 px-6 pb-5">
              {MemberFieldGroup.map((group) => (
                <Fragment key={`add_member_${group.title}`}>
                  <div className="col-span-12 text-lg font-semibold mt-6">
                    {group.title}
                  </div>

                  {group.fields.map(
                    (field) =>
                      (!field.showIf || field.showIf(member)) && (
                        <div
                          key={field.name}
                          className={getColSpan(field.size)}
                        >
                          <FormField
                            field={field}
                            value={member[field.name]}
                            onChange={handleChange}
                            disabled={!editMode || field.disabled}
                          />
                        </div>
                      ),
                  )}
                </Fragment>
              ))}
            </div>

            {editMode && (
              <div className="flex justify-end px-6 py-3 gap-5">
                <Button
                  variant="outlined"
                  type="submit"
                  color="danger"
                  size="md"
                  sx={{
                    px: 3,
                  }}
                  disabled={loading}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  type="submit"
                  size="md"
                  sx={{
                    px: 5,
                    backgroundColor: "black",
                    "&:hover": { backgroundColor: "#222222" },
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <Fragment>
                      <CircularProgress variant="solid" />{" "}
                      <span className="ms-3">Updating ...</span>
                    </Fragment>
                  ) : (
                    "Update Member"
                  )}
                </Button>
              </div>
            )}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDetails;
