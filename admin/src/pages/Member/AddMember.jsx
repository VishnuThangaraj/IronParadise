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
  addNewMember,
  fetchMemberCounter,
} from "../../redux/member/memberThunks";
import {
  selectMemberLoading,
  selectMemberCounter,
} from "../../redux/member/memberSelector";
import FormField from "../../components/Form/FormField";
import { PageLocation } from "../../components/PageLocation";

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

const numericFields = ["phone", "height", "weight"];

const maxLengthMap = {
  phone: 10,
};

const AddMember = () => {
  const dispatch = useDispatch();

  const loading = useSelector(selectMemberLoading);
  const counter = useSelector(selectMemberCounter);

  const [newMember, setNewMember] = useState(initialMemberState);

  useEffect(() => {
    dispatch(fetchMemberCounter({ role: "member" }));
  }, [dispatch]);

  useEffect(() => {
    if (counter) {
      setNewMember((prev) => ({
        ...prev,
        userId: `MBR-${String(counter + 1).padStart(3, "0")}`,
      }));
    }
  }, [counter]);

  const handleChange = (name, value) => {
    if (numericFields.includes(name) && isNaN(Number(value))) return;

    if (maxLengthMap[name] && value.length > maxLengthMap[name]) return;

    setNewMember((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "height" || name === "weight") {
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
      await dispatch(addNewMember({ newMember })).unwrap();
      toast.success("Member Added Successfully!");
    } catch {
      toast.error("Failed to Add Member");
    } finally {
      setNewMember(initialMemberState);
    }
  };

  return (
    <div key="Add-Member">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Members"
        currentPath="Add New Member"
      />

      <Card className="shadow-md" sx={{ my: 1, mb: 4, p: 0, pb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <div className="text-xl font-bold border-b-2 border-gray-200 p-5">
              Add New Member
            </div>

            <div className="grid grid-cols-12 gap-4 px-6 pb-5">
              {MemberFieldGroup.map((group) => (
                <Fragment key={`add_trainer_${group.title}`}>
                  <div className="col-span-12 text-lg font-semibold mt-6">
                    {group.title}
                  </div>

                  {group.fields.map(
                    (field) =>
                      (!field.showIf || field.showIf(newMember)) && (
                        <div
                          key={field.name}
                          className={getColSpan(field.size)}
                        >
                          <FormField
                            field={field}
                            value={newMember[field.name]}
                            onChange={handleChange}
                            disabled={field.disabled}
                          />
                        </div>
                      )
                  )}
                </Fragment>
              ))}
            </div>

            <div className="flex justify-end px-6 py-3">
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
                    <span className="ms-3">Adding ...</span>
                  </Fragment>
                ) : (
                  "Add Member"
                )}
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMember;
