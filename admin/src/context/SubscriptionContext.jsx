import { toast } from "sonner";
import axios from "../service/api";
import PropTypes from "prop-types";
import { createContext, useState, useEffect, useContext } from "react";

import { AuthContext } from "./AuthContext";

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get("/subscription", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const subscriptionlist = response.data.subscriptions;
          setSubscriptions(subscriptionlist || []);
        } else {
          console.log("Error Fetching Subscription List");
        }
      } catch (err) {
        console.log("Error Connecting to Server | ", err);
      }
    };
    fetchSubscriptions();
  }, [token]);

  // Add New Subscription Plan
  const addSubscription = async (subscription) => {
    try {
      const response = await axios.post(
        "/subscription/add",
        { subscription },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        const newSubscription = response.data.subscription;
        setSubscriptions([...subscriptions, newSubscription]);
        toast.success("Subscription Plan Added Successfully ✔️");
      } else {
        toast.warning("Failed to Add Subscription Plan 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Fetch Subscription by ID
  const findSubscriptionByID = (subscriptionId) => {
    return subscriptions.filter(
      (subscription) => subscription._id === subscriptionId
    )[0];
  };

  // Update Subscription by ID
  const updateSubscription = async (subscriptionId, updatedData) => {
    try {
      const response = await axios.put(
        `/subscription/update/${subscriptionId}`,
        { updatedData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const updatedSubscription = response.data.subscription || {};
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((subscription) =>
            subscription._id === subscriptionId
              ? updatedSubscription
              : subscription
          )
        );
        toast.success("Subscription Plan Updated Successfully ✔️");
      } else {
        toast.warning("Failed to Update Subscription Plan 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Delete SubscriptionPlan
  const deleteSubscription = async (subscriptionId) => {
    try {
      const response = await axios.delete(
        `/subscription/delete/${subscriptionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.filter(
            (subscription) => subscription._id !== subscriptionId
          )
        );
        toast.success("Subscription Plan Removed Successfully ✔️");
      } else {
        toast.warning("Failed to Remove Subscription Plan 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        addSubscription,
        deleteSubscription,
        updateSubscription,
        findSubscriptionByID,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

SubscriptionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
