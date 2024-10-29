import { toast } from "sonner";
import axios from "../service/api";
import PropTypes from "prop-types";
import { createContext, useState, useEffect, useContext } from "react";

import { AuthContext } from "./AuthContext";
import { SubscriptionContext } from "./SubscriptionContext";

export const MemberContext = createContext();

export const MemberProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const { addHistory, addSubscriptionHistory } =
    useContext(SubscriptionContext);

  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("/member", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const membersList = response.data.members;
          setMembers(membersList || []);
        } else {
          console.log("Error Fetching Members List");
        }
      } catch (err) {
        console.log("Error Connecting to Server | ", err);
      }
    };
    fetchMembers();
  }, [token]);

  // Add New Member
  const addMember = async (member) => {
    try {
      const response = await axios.post(
        "/member/add",
        { member },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        const newMember = response.data.member;
        setMembers([...members, newMember]);
        toast.success("Member Added Successfully ✔️");
      } else if (response.status === 409) {
        toast.warning("Email or Phone Already Exists ✉️");
      } else {
        toast.warning("Failed to Add Member 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Fetch Member by ID
  const findMember = (memberId) => {
    return members.filter((member) => member._id === memberId)[0];
  };

  // Update fitness Plan
  const updateFitnessPlan = async (memberId, planData) => {
    try {
      const response = await axios.put(
        `/member/plan/update/${memberId}`,
        { planData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const updatedMember = response.data.member;
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member._id === memberId ? updatedMember || member : member
          )
        );
        toast.success("Fitness Plan Updated Successfully ✔️");
      } else {
        toast.warning("Failed to Update Fitness Plan 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Update Subscription Plan
  const updateSubscription = async (memberId, subscription) => {
    try {
      const response = await axios.put(
        `/member/update/plan/${memberId}`,
        { subscription },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        const updatedMember = response.data.member;
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member._id === memberId ? updatedMember || member : member
          )
        );
        toast.success("Subscription Plan Updated Successfully ✔️");
      } else {
        toast.warning("Failed to Update Subscription Plan  😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Update Member by ID
  const updateMember = async (memberId, rawData) => {
    const updatedData = {
      ...rawData,
      trainerId: rawData.trainerId._id,
      dietPlan: rawData.dietPlan._id,
      workoutPlan: rawData.workoutPlan._id,
    };
    try {
      const response = await axios.put(
        `/member/update/${memberId}`,
        { updatedData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member._id === memberId ? rawData || member : member
          )
        );
        toast.success("Member Updated Successfully ✔️");
      } else {
        toast.warning("Failed to Update Member 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Delete Member
  const deleteMember = async (memberId) => {
    try {
      const response = await axios.delete(`/member/delete/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member._id !== memberId)
        );
        toast.success("Member Removed Successfully ✔️");
      } else {
        toast.warning("Failed to Remove Member 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  // Make Payment
  const makePayment = async (payment) => {
    try {
      const response = await axios.post(
        "/member/payment",
        { payment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const updatedMember = response.data.member;
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member._id === payment.member ? updatedMember || member : member
          )
        );

        const paymentHis = response.data.payment;
        await addHistory(paymentHis);

        const subscriptionHis = response.data.subscription;
        if (subscriptionHis !== null)
          await addSubscriptionHistory(subscriptionHis);

        toast.success("Payment Done Successfully ✔️");
      } else {
        toast.warning("Failed to make Payment 😓");
      }
    } catch (err) {
      console.log("Error Connecting to Server | ", err);
    }
  };

  return (
    <MemberContext.Provider
      value={{
        members,
        addMember,
        findMember,
        makePayment,
        updateMember,
        deleteMember,
        updateFitnessPlan,
        updateSubscription,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

MemberProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
