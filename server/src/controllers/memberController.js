const Member = require("../models/Member");
const PaymentHistory = require("../models/PaymentHistory");
const SubscriptionHistory = require("../models/SubscriptionHistory");

// Add New Member
const registerMember = async (req, res) => {
  const {
    name,
    username,
    email,
    phone,
    dob,
    gender,
    height,
    weight,
    bmi,
    address,
    trainerId,
    dietPlan,
    workoutPlan,
    startDate,
    endDate,
    planDuration,
    planCost,
    membershipPlanId,
  } = req.body.member;
  try {
    if (
      !name ||
      !email ||
      !phone ||
      !dob ||
      !trainerId ||
      !dietPlan ||
      !workoutPlan
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingEmail = await Member.findOne({ email });
    const existingPhone = await Member.findOne({ phone });

    if (existingEmail || existingPhone) {
      return res.status(409).json({ message: "Email or Phone already exists" });
    }

    const subscription =
      startDate && endDate && membershipPlanId
        ? {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            membershipPlan: membershipPlanId,
            planDuration: planDuration,
            planCost: planCost,
            pending: planCost,
          }
        : undefined;

    const newMember = new Member({
      name,
      username,
      email,
      phone,
      dob,
      gender,
      height,
      weight,
      bmi,
      address,
      role: "member",
      trainerId: trainerId,
      dietPlan: dietPlan,
      workoutPlan: workoutPlan,
      subscription,
    });

    const currentMember = await newMember.save();

    const savedMember = await Member.findById(currentMember._id)
      .populate("workoutPlan")
      .populate("trainerId")
      .populate("dietPlan");

    res.status(201).json({
      message: "Member registered successfully",
      member: savedMember,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while adding new member",
      error: err.message,
    });
  }
};

// Fetch all Members
const fetchMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("workoutPlan")
      .populate("trainerId")
      .populate("dietPlan");

    res.status(200).json({ message: "Members Fetched", members: members });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a Member
const updateMember = async (req, res) => {
  const memberId = req.params.id;
  const { updatedData } = req.body;

  try {
    const member = await Member.findByIdAndUpdate(memberId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res
      .status(200)
      .json({ message: "Member Updated successfully!", member: member });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Subscription Plan for the member
const updateSubPlan = async (req, res) => {
  const memberId = req.params.id;
  const { subscription } = req.body;

  try {
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.subscription = subscription;

    await member.save();

    const updatedMember = await Member.findById(memberId)
      .populate("workoutPlan")
      .populate("trainerId")
      .populate("dietPlan");

    res.status(200).json({
      message: "Subscription Updated successfully!",
      member: updatedMember,
    });
    await member.save();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a Member
const deleteMember = async (req, res) => {
  const memberId = req.params.id;

  try {
    const member = await Member.findByIdAndDelete(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ message: "Member Deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Member Plan
const updatePlan = async (req, res) => {
  const memberId = req.params.id;
  const { planData } = req.body;

  try {
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    member.dietPlan = planData.dietplan;
    member.workoutPlan = planData.workoutplan;

    await member.save();

    const updatedMember = await Member.findById(memberId)
      .populate("workoutPlan")
      .populate("trainerId")
      .populate("dietPlan");

    res.status(200).json({
      message: "Fitness Plan Updated successfully!",
      member: updatedMember,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Make Payment
const makePayment = async (req, res) => {
  const { member, dueAmount, subscription } = req.body.payment;
  const payment = req.body.payment;
  try {
    const existingMember = await Member.findById(member);

    if (!existingMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    let newSubscription = null;
    if (
      existingMember.subscription.planCost ===
      existingMember.subscription.pending
    ) {
      newSubscription = new SubscriptionHistory({
        member: member,
        subscription: subscription,
        startDate: existingMember.subscription.startDate,
        endDate: existingMember.subscription.endDate,
      });

      await newSubscription.save();
    }

    existingMember.subscription.pending = dueAmount;
    await existingMember.save();

    const updatedMember = await Member.findById(member)
      .populate("workoutPlan")
      .populate("trainerId")
      .populate("dietPlan");

    const paymentHis = new PaymentHistory({
      ...payment,
      startDate: updatedMember.subscription.startDate,
      endDate: updatedMember.subscription.endDate,
    });
    await paymentHis.save();

    res.status(200).json({
      message: "Payment made successfully!",
      member: updatedMember,
      payment: paymentHis,
      subscription: newSubscription,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  updatePlan,
  makePayment,
  fetchMembers,
  updateMember,
  deleteMember,
  updateSubPlan,
  registerMember,
};
