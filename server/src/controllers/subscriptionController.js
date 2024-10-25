const MembershipPlan = require("../models/MembershipPlan");

// Add new Subscription
const addSubscription = async (req, res) => {
  const { name, planId, duration, price } = req.body.subscription;
  try {
    const newSubscription = new MembershipPlan({
      name,
      planId: `PL${planId}`,
      duration,
      price,
    });

    await newSubscription.save();

    res.status(201).json({
      message: "Subscription added successfully",
      subscription: newSubscription,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch All Subscription Plans
const fetchSubscriptions = async (req, res) => {
  try {
    const subscriptions = await MembershipPlan.find();

    res
      .status(200)
      .json({ message: "Subscriptions Fetched", subscriptions: subscriptions });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update a Subscription PLan by ID
const updateSubscriptionById = async (req, res) => {
  const subscriptionId = req.params.id;
  const { updatedData } = req.body;

  try {
    const subscription = await MembershipPlan.findByIdAndUpdate(
      subscriptionId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription Plan not found" });
    }

    res.status(200).json({
      message: "Subscription Plan Updated successfully!",
      subscription: subscription,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Subscription PLan by ID
const deleteSubscriptionById = async (req, res) => {
  const subscriptionId = req.params.id;

  try {
    const subscription = await MembershipPlan.findByIdAndDelete(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription Plan not found" });
    }

    res
      .status(200)
      .json({ message: "Subscription Plan Deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addSubscription,
  fetchSubscriptions,
  updateSubscriptionById,
  deleteSubscriptionById,
};
