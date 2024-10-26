import Button from "@mui/joy/Button";
import { CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  Input,
  FormLabel,
  CardContent,
  FormControl,
} from "@mui/joy";

import { SubscriptionContext } from "../../context/SubscriptionContext";

import { PageLocation } from "../../components/PageLocation";

const EditSubscription = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { findSubscriptionByID, updateSubscription } =
    useContext(SubscriptionContext);

  const subscriptionId = location.state || null;

  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState({
    name: "",
    planId: 0,
    duration: "",
    price: "",
  });

  useEffect(() => {
    if (subscriptionId === null) return navigate(-1);
    const fetchSubscriptionData = async () => {
      const subscriptionData = await findSubscriptionByID(subscriptionId);
      setSubscription(subscriptionData);
    };
    fetchSubscriptionData();
  }, [navigate, subscriptionId, findSubscriptionByID]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "duration" || name === "price") && isNaN(Number(value))) {
      return;
    }

    const updatedSubscription = { ...subscription, [name]: value };
    setSubscription(updatedSubscription);
  };

  const validateAndAddSubscription = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateSubscription(subscriptionId, subscription);
    setSubscription({
      name: "",
      planId: 0,
      duration: "",
      price: "",
    });
    setLoading(false);
    navigate("/subscription/list");
  };

  return (
    <div id="editSubscription">
      <PageLocation
        pageTitle="Gym Management"
        parentPath="Subscription Plans"
        currentPath="Edit Subscription Plan"
      />
      <Card className="shadow-md" sx={{ my: 2, mb: 4, p: 0 }}>
        <CardContent>
          <Box
            component="form"
            sx={{ p: 0 }}
            onSubmit={validateAndAddSubscription}
          >
            <div className="text-xl font-bold border-b-2 p-5 ">
              Add New Subscription Plan
            </div>
            <div className="flex flex-col gap-3 px-6 py-3">
              <div className="flex justify-between">
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>
                    Auto Generated Plan Id
                  </FormLabel>
                  <Input
                    value={
                      subscription.planId && subscription.planId.toUpperCase()
                    }
                    variant="solid"
                    size="md"
                    sx={{ py: 1 }}
                    disabled
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>Plan Name</FormLabel>
                  <Input
                    onChange={handleChange}
                    value={subscription.name}
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
                  <FormLabel sx={{ fontSize: 15 }}>
                    Plan Duration (in Months)
                  </FormLabel>
                  <Input
                    onChange={handleChange}
                    value={subscription.duration}
                    variant="outlined"
                    name="duration"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
                    required
                  />
                </FormControl>
                <FormControl sx={{ width: "48%" }}>
                  <FormLabel sx={{ fontSize: 15 }}>
                    Plan Cost ( &#8377; )
                  </FormLabel>
                  <Input
                    onChange={handleChange}
                    value={subscription.price}
                    variant="outlined"
                    name="price"
                    size="md"
                    sx={{
                      py: 1,
                      backgroundColor: "white",
                    }}
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
                      <span className="ms-5 text-base">Updating ...</span>
                    </Fragment>
                  ) : (
                    "Update Plan"
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

export default EditSubscription;
