import { toast } from "sonner";
import axios from "../service/api";
import PropTypes from "prop-types";
import { createContext, useState, useEffect, useContext } from "react";

import { AuthContext } from "./AuthContext";

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const [subscription, history, payment] = await Promise.all([
          axios.get("/subscription", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/subscription/history", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/subscription/payment", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (subscription.status === 200) {
          const subscriptionlist = subscription.data.subscriptions;
          setSubscriptions(subscriptionlist || []);
        } else {
          console.log("Error Fetching Subscription List");
        }

        if (history.status === 200) {
          const subHistoryList = history.data.history;
          setSubscriptionHistory(subHistoryList || []);
        } else {
          console.log("Error Fetching Subscription History");
        }

        if (payment.status === 200) {
          const paymentList = payment.data.history;
          setPaymentHistory(paymentList || []);
        } else {
          console.log("Error Fetching Payment History");
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

  const subscriptionName = async (subscriptionId) => {
    return `${
      subscriptions.filter(
        (subscription) => subscription._id === subscriptionId
      )[0].name
    }`;
  };

  const addHistory = async (paymentData) => {
    setPaymentHistory([...paymentHistory, paymentData]);
  };

  const addSubscriptionHistory = async (subscriptionData) => {
    setSubscriptionHistory([...subscriptionHistory, subscriptionData]);
  };

  const memberPaymentHistory = async (memberId) => {
    return paymentHistory.filter((payment) => payment.member === memberId);
  };

  const memberSubscriptionHistory = async (memberId) => {
    return subscriptionHistory.filter(
      (subscription) => subscription.member === memberId
    );
  };

  return (
    <SubscriptionContext.Provider
      value={{
        addHistory,
        subscriptions,
        paymentHistory,
        addSubscription,
        subscriptionName,
        deleteSubscription,
        updateSubscription,
        findSubscriptionByID,
        memberPaymentHistory,
        addSubscriptionHistory,
        memberSubscriptionHistory,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

SubscriptionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
