import dayjs from "dayjs";
import { toast } from "sonner";
import { DatePicker } from "antd";
import { CircularProgress } from "@mui/material";
import { Fragment, useContext, useState } from "react";
import {
  Box,
  Card,
  Input,
  Option,
  Button,
  Select,
  Textarea,
  FormLabel,
  CardContent,
  FormControl,
} from "@mui/joy";

import { TrainerContext } from "../../context/TrainerContext";

import { PageLocation } from "../../components/PageLocation";

const specializationOptions = [
  "Personal Trainer",
  "Weight Management Specialist",
  "Bodybuilding Coach",
  "Wellness Specialist",
  "Strength and Conditioning Coach",
  "Cardio Fitness Trainer",
  "Functional Fitness Trainer",
  "Sports Performance Coach",
  "Rehabilitation Specialist",
  "Yoga Instructor",
  "Pilates Instructor",
  "Group Fitness Instructor",
  " Nutrition and Diet Planning",
  "Aerobics Instructor",
  "CrossFit Trainer",
  " Martial Arts Trainer",
  "Flexibility and Mobility Coach",
  "Endurance Training Specialist",
  "Senior Fitness Specialist",
  "Pre/Postnatal Fitness Specialist",
  "Injury Prevention and Recovery",
  "Dance Fitness Instructor",
  "Mind-Body Specialist",
  "Holistic Health Coach",
  "Core Training Specialist",
];

const AddTrainer = () => {
  const { trainers, addTrainer } = useContext(TrainerContext);

  const [loading, setLoading] = useState(false);
  const [trainer, setTrainer] = useState({
    username:
      trainers.length > 0
        ? `${Number(trainers[trainers.length - 1].username.slice(2)) + 1}`
        : 1,
    name: "",
    email: "",
    phone: "",
    dob: null,
    gender: null,
    specialization: null,
    height: "",
    salary: "",
    weight: "",
    bmi: 0,
    address: "",
    panNumber: "",
    aadharNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "phone" ||
        name === "height" ||
        name === "weight" ||
        name === "salary" ||
        name === "aadharNumber") &&
      isNaN(Number(value))
    ) {
      return;
    }

    if ((name === "panNumber" || name === "phone") && value.length > 10) return;
    if (name === "aadharNumber" && value.length > 12) return;
    if (name === "salary" && value.length > 8) return;

    const updatedTrainer = { ...trainer, [name]: value };
    setTrainer(updatedTrainer);

    // Calculate BMI if height and weight are present
    if (name === "height" || name === "weight") {
      const height = Number(updatedTrainer.height) / 100;
      const weight = Number(updatedTrainer.weight);

      if (weight > 0 && height > 0) {
        const bmi = weight / (height * height);
        setTrainer((prev) => ({ ...prev, bmi: Number(bmi.toFixed(2)) }));
      }
    }
  };

  const handleDateChange = (date, dateString) => {
    setTrainer({ ...trainer, ["dob"]: dateString });
  };

  const handleGenderChange = (event, newValue) => {
    setTrainer({ ...trainer, ["gender"]: newValue });
  };

  const handleSpecializatoinChange = (event, newValue) => {
    setTrainer({ ...trainer, ["specialization"]: newValue });
  };

  const validateAndAddTrainer = async (e) => {
    e.preventDefault();

    if (trainer.aadharNumber.length < 12)
      return toast.info("Aadhar Number should be 12 Digits.");
    if (trainer.panNumber.length < 10)
      return toast.info("Pan-Number should be 10 Digits.");
    if (trainer.phone.length < 10)
      return toast.info("Phone Number should be 10 Digits.");

    setLoading(true);
    await addTrainer(trainer);
    setTrainer({
      username:
        trainers.length > 0
          ? Number(trainers[trainers.length - 1].username.slice(2)) + 2
          : 2,
      name: "",
      email: "",
      phone: "",
      dob: null,
      gender: null,
      specialization: null,
      panNumber: "",
      aadharNumber: "",
      height: "",
      salary: "",
      weight: "",
      bmi: 0,
      address: "",
    });
    setLoading(false);
  };

  return (
    <div id="addtrainer">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Trainers"
        currentPath="Add New Trainer"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 0 }}>
        <CardContent>
          <Box component="form" sx={{ p: 0 }} onSubmit={validateAndAddTrainer}>
            <div className="text-xl font-bold border-b-2 p-5 ">
              Add New Trainer
            </div>
            <div className="flex flex-col gap-4 px-6 py-3">
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Auto Generated Id</FormLabel>
                  <Input
                    value={`TR${trainer.username}`}
                    variant="solid"
                    size="md"
                    sx={{ py: 1 }}
                    disabled
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Full Name</FormLabel>
                  <Input
                    placeholder="Trainer Name"
                    onChange={handleChange}
                    value={trainer.name}
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
                    value={trainer.email}
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
                    value={trainer.phone}
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
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>
                    Aadhar Card Number
                  </FormLabel>
                  <Input
                    placeholder="xxxx xxxx xxxx"
                    value={trainer.aadharNumber}
                    onChange={handleChange}
                    name="aadharNumber"
                    variant="outlined"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                  />
                </FormControl>
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Pan Card Number</FormLabel>
                  <Input
                    value={trainer.panNumber && trainer.panNumber.toUpperCase()}
                    placeholder="xxxxxxxxxx"
                    onChange={handleChange}
                    variant="outlined"
                    name="panNumber"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                  />
                </FormControl>
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Salary</FormLabel>
                  <Input
                    value={trainer.salary}
                    placeholder="₹ 0000.00"
                    onChange={handleChange}
                    variant="outlined"
                    name="salary"
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
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Date of Birth</FormLabel>
                  <DatePicker
                    value={
                      trainer.dob ? dayjs(trainer.dob, "YYYY-MM-DD") : null
                    }
                    onChange={handleDateChange}
                    format="YYYY-MM-DD"
                    style={{
                      height: "42px",
                    }}
                  />
                </FormControl>
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Gender</FormLabel>
                  <Select
                    onChange={handleGenderChange}
                    placeholder="Select Gender"
                    value={trainer.gender}
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
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Specialization</FormLabel>
                  <Select
                    onChange={handleSpecializatoinChange}
                    placeholder="Select Specialization"
                    value={trainer.specialization}
                    name="specialization"
                    variant="outlined"
                    sx={{
                      backgroundColor: "white",
                      height: "42px",
                    }}
                    required
                  >
                    {specializationOptions.map((specialization, index) => (
                      <Option
                        key={`specialization-${index}`}
                        value={specialization}
                      >
                        {specialization}
                      </Option>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "32%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Height (cm)</FormLabel>
                  <Input
                    placeholder="152 cm"
                    onChange={handleChange}
                    value={trainer.height}
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
                    value={trainer.weight}
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
                    value={trainer.bmi}
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
                  <FormLabel sx={{ fontSize: 15 }}>Address</FormLabel>
                  <Textarea
                    placeholder="Enter your address"
                    onChange={handleChange}
                    value={trainer.address}
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
                    "Add Trainer"
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

export default AddTrainer;
