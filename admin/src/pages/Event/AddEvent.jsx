import dayjs from "dayjs";
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
  FormLabel,
  CardContent,
  FormControl,
} from "@mui/joy";

import { GeneralContext } from "../../context/GeneralContext";

import { PageLocation } from "../../components/PageLocation";

const AddEvent = () => {
  const { addEvent } = useContext(GeneralContext);

  const [loading, setLoading] = useState(false);
  const [eventData, setEvent] = useState({
    name: "",
    description: "",
    access: null,
    startDate: null,
    endDate: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedEvent = { ...eventData, [name]: value };
    setEvent(updatedEvent);
  };

  const handleStartDate = (date, dateString) => {
    setEvent({ ...eventData, ["startDate"]: dateString });
  };

  const handleEndDate = (date, dateString) => {
    setEvent({ ...eventData, ["endDate"]: dateString });
  };

  const handleAccess = (event, newValue) => {
    setEvent({ ...eventData, ["access"]: newValue });
  };

  const validateAndAddEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addEvent(eventData);
    setEvent({
      name: "",
      description: "",
      access: null,
      startDate: null,
      endDate: null,
    });
    setLoading(false);
  };

  return (
    <div id="addevent">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Events"
        currentPath="Add New Event"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 0 }}>
        <CardContent>
          <Box component="form" sx={{ p: 0 }} onSubmit={validateAndAddEvent}>
            <div className="text-xl font-bold border-b-2 p-5 ">
              Add New Event
            </div>
            <div className="flex flex-col gap-4 px-6 py-3">
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Event Name</FormLabel>
                  <Input
                    placeholder="Enter Event Name"
                    onChange={handleChange}
                    value={eventData.name}
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
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Event Description</FormLabel>
                  <Input
                    placeholder="Enter Event Description"
                    value={eventData.description}
                    onChange={handleChange}
                    variant="outlined"
                    name="description"
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
                  <FormLabel sx={{ fontSize: 15 }}>Start Date</FormLabel>
                  <DatePicker
                    value={
                      eventData.startDate
                        ? dayjs(eventData.startDate, "YYYY-MM-DD")
                        : null
                    }
                    onChange={handleStartDate}
                    format="YYYY-MM-DD"
                    style={{
                      height: "42px",
                    }}
                    required
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>End Date</FormLabel>
                  <DatePicker
                    value={
                      eventData.endDate
                        ? dayjs(eventData.endDate, "YYYY-MM-DD")
                        : null
                    }
                    onChange={handleEndDate}
                    format="YYYY-MM-DD"
                    style={{
                      height: "42px",
                    }}
                    required
                  />
                </FormControl>
              </div>
              <div className="flex justify-between">
                <FormControl sx={{ width: "100%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Event Access</FormLabel>
                  <Select
                    placeholder="Select Access"
                    onChange={handleAccess}
                    value={eventData.access}
                    variant="outlined"
                    name="access"
                    sx={{
                      backgroundColor: "white",
                      height: "42px",
                    }}
                    required
                  >
                    <Option value="trainer">Trainer</Option>
                    <Option value="member">Member</Option>
                    <Option value="all">Everyone</Option>
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
                    "Add Event"
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

export default AddEvent;
