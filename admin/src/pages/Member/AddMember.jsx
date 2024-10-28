import dayjs from "dayjs";
import { DatePicker } from "antd";
import Button from "@mui/joy/Button";
import { CircularProgress } from "@mui/material";
import { Fragment, useContext, useState } from "react";
import {
  Box,
  Card,
  Input,
  Option,
  Select,
  Textarea,
  FormLabel,
  CardContent,
  FormControl,
} from "@mui/joy";

import { AuthContext } from "../../context/AuthContext";
import { PlanContext } from "../../context/PlanContext";
import { MemberContext } from "../../context/MemberContext";
import { TrainerContext } from "../../context/TrainerContext";
import { SubscriptionContext } from "../../context/SubscriptionContext";

import { PageLocation } from "../../components/PageLocation";

const AddMember = () => {
  const { currentDate } = useContext(AuthContext);
  const { trainers } = useContext(TrainerContext);
  const { members, addMember } = useContext(MemberContext);
  const { dietplans, workoutplans } = useContext(PlanContext);
  const { subscriptions, findSubscriptionByID } =
    useContext(SubscriptionContext);

  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState({
    username: `MB${members.length + 1}`,
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
    bmi: "",
    address: "",
    trainerId: null,
    dietPlan: null,
    membershipPlanId: null,
    startDate: currentDate,
    planDuration: "",
    planCost: "",
    endDate: "",
    workoutPlan: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "phone" || name === "height" || name === "weight") &&
      isNaN(Number(value))
    ) {
      return;
    }

    // Update the member state
    const updatedMember = { ...member, [name]: value };
    setMember(updatedMember);

    // Calculate BMI if height and weight are present
    if (name === "height" || name === "weight") {
      const height = Number(updatedMember.height) / 100;
      const weight = Number(updatedMember.weight);

      if (weight > 0 && height > 0) {
        const bmi = weight / (height * height);
        setMember((prev) => ({ ...prev, bmi: Number(bmi.toFixed(2)) }));
      }
    }
  };

  const handleDateChange = (date, dateString) => {
    setMember({ ...member, ["dob"]: dateString });
  };

  const handleGenderChange = (event, newValue) => {
    setMember({ ...member, ["gender"]: newValue });
  };

  const handleTrainerChange = (event, newValue) => {
    setMember({ ...member, ["trainerId"]: newValue });
  };

  const handleSubscriptionChange = async (event, newValue) => {
    const subscription = await findSubscriptionByID(newValue);
    setMember({
      ...member,
      planCost: subscription.price,
      ["membershipPlanId"]: newValue,
      planDuration: subscription.duration,
      endDate: dayjs(member.startDate)
        .add(subscription.duration, "month")
        .format("YYYY-MM-DD"),
    });
  };

  const handleDietChange = (event, newValue) => {
    setMember({ ...member, ["dietPlan"]: newValue });
  };

  const handleWorkoutChange = (event, newValue) => {
    setMember({ ...member, ["workoutPlan"]: newValue });
  };

  const validateAndAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addMember(member);
    setMember({
      username: `MB${members.length + 2}`,
      name: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      height: "",
      weight: "",
      bmi: "",
      address: "",
      trainerId: null,
      dietPlan: null,
      membershipPlanId: null,
      startDate: currentDate,
      planDuration: "",
      planCost: "",
      endDate: "",
      workoutPlan: null,
    });
    setLoading(false);
  };

  return (
    <div id="addmember">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Members"
        currentPath="Add New Member"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 0 }}>
        <CardContent>
          <Box component="form" sx={{ p: 0 }} onSubmit={validateAndAddMember}>
            <div className="text-xl font-bold border-b-2 p-5 ">
              Add New Member
            </div>
            <div className="flex flex-col gap-4 px-6 py-3">
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Auto Generated Id</FormLabel>
                  <Input
                    value={member.username}
                    variant="solid"
                    size="md"
                    sx={{ py: 1 }}
                    disabled
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Full Name</FormLabel>
                  <Input
                    placeholder="Member Name"
                    onChange={handleChange}
                    value={member.name}
                    variant="outlined"
                    name="name"
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
                  <FormLabel sx={{ fontSize: 15 }}>Email Address</FormLabel>
                  <Input
                    placeholder="example@gmail.com"
                    onChange={handleChange}
                    value={member.email}
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
                  <FormLabel sx={{ fontSize: 15 }}>Contact Number</FormLabel>
                  <Input
                    placeholder="0000 0000 00"
                    onChange={handleChange}
                    startDecorator={"+91"}
                    value={member.phone}
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
                  <FormLabel sx={{ fontSize: 15 }}>Date of Birth</FormLabel>
                  <DatePicker
                    value={member.dob ? dayjs(member.dob, "YYYY-MM-DD") : null}
                    onChange={handleDateChange}
                    format="YYYY-MM-DD"
                    style={{
                      height: "42px",
                    }}
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Gender</FormLabel>
                  <Select
                    onChange={handleGenderChange}
                    placeholder="Select Gender"
                    value={member.gender}
                    variant="outlined"
                    name="gender"
                    sx={{
                      backgroundColor: "white",
                      height: "42px",
                    }}
                  >
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Height (cm)</FormLabel>
                  <Input
                    placeholder="152 cm"
                    onChange={handleChange}
                    value={member.height}
                    variant="outlined"
                    name="height"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                  />
                </FormControl>
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Weight (kg)</FormLabel>
                  <Input
                    placeholder="65 kg"
                    onChange={handleChange}
                    value={member.weight}
                    variant="outlined"
                    name="weight"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                  />
                </FormControl>
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>BMI</FormLabel>
                  <Input
                    onChange={handleChange}
                    value={member.bmi}
                    variant="outlined"
                    name="bmi"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    disabled
                    required
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "100%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Select Trainer</FormLabel>
                  <Select
                    onChange={handleTrainerChange}
                    placeholder="Select Trainer"
                    value={member.trainerId}
                    variant="outlined"
                    name="trainerId"
                    sx={{
                      backgroundColor: "white",
                      height: "42px",
                    }}
                    required
                  >
                    {trainers.map((trainer, index) => (
                      <Option key={`trainer-${index}`} value={trainer._id}>
                        {trainer.name}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "100%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Address</FormLabel>
                  <Textarea
                    placeholder="Enter your address"
                    onChange={handleChange}
                    value={member.address}
                    variant="outlined"
                    name="address"
                    minRows={2}
                    maxRows={2}
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    size="md"
                    required
                  />
                </FormControl>
              </div>
              <div className="text font-bold text-xl my-3">
                Subscription Plan
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Select Plan</FormLabel>
                  <Select
                    placeholder="Select Subscription Plan"
                    value={member.membershipPlanId}
                    onChange={handleSubscriptionChange}
                    name="subscription"
                    variant="outlined"
                    sx={{
                      backgroundColor: "white",
                      height: "42px",
                    }}
                    required
                  >
                    {subscriptions.map((subscription, index) => (
                      <Option
                        key={`subscription-${index}`}
                        value={subscription._id}
                      >
                        {subscription.name}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>
                    Plan Duration (in Months)
                  </FormLabel>
                  <Input
                    placeholder="Months"
                    value={member.planDuration}
                    name="planDuration"
                    variant="outlined"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    disabled
                    required
                  />
                </FormControl>
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>
                    Plan Cost ( &#8377; )
                  </FormLabel>
                  <Input
                    placeholder="₹ 00.00"
                    value={member.planCost}
                    variant="outlined"
                    name="planCost"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    disabled
                    required
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Plan Start Date</FormLabel>
                  <DatePicker
                    value={
                      member.startDate
                        ? dayjs(member.startDate, "YYYY-MM-DD")
                        : null
                    }
                    format="YYYY-MM-DD"
                    style={{
                      height: "42px",
                    }}
                    onChange={null}
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Plan End Date</FormLabel>
                  <DatePicker
                    value={
                      member.endDate
                        ? dayjs(member.endDate, "YYYY-MM-DD")
                        : null
                    }
                    format="YYYY-MM-DD"
                    style={{
                      height: "42px",
                    }}
                    onChange={null}
                  />
                </FormControl>
              </div>
              <div className="text font-bold text-xl my-3">Fitness Plans</div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Select Diet Plan</FormLabel>
                  <Select
                    placeholder="Select Diet Plan"
                    onChange={handleDietChange}
                    value={member.dietPlan}
                    variant="outlined"
                    name="dietPlan"
                    sx={{
                      backgroundColor: "white",
                      height: "42px",
                    }}
                    required
                  >
                    {dietplans.map((dietplan, index) => (
                      <Option key={`dietplan-${index}`} value={dietplan._id}>
                        {dietplan.dietPlanName}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>
                    Select Workout Plan
                  </FormLabel>
                  <Select
                    placeholder="Select Workout Plan"
                    onChange={handleWorkoutChange}
                    value={member.workoutPlan}
                    variant="outlined"
                    name="workoutPlan"
                    sx={{
                      backgroundColor: "white",
                      height: "42px",
                    }}
                    required
                  >
                    {workoutplans.map((workoutplan, index) => (
                      <Option
                        key={`workoutplan-${index}`}
                        value={workoutplan._id}
                      >
                        {workoutplan.workoutPlanName}
                      </Option>
                    ))}
                  </Select>
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
                >
                  {loading ? (
                    <Fragment>
                      <CircularProgress
                        size={20}
                        sx={{
                          color: "white",
                        }}
                      />{" "}
                      <span className="ms-5 text-base">Adding ...</span>
                    </Fragment>
                  ) : (
                    "Add Member"
                  )}
                </Button>
              </div>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMember;
