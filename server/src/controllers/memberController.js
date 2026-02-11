const Member = require("../models/Member");

// Register Member
const registerMember = async (req, res) => {
  const { email } = req.body;

  try {
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: "Member already exists" });
    }

    const member = new Member({
      ...req.body,
    });

    await member.save();

    const memberResponse = member.toObject();

    res.status(201).json({
      message: `Member registered successfully`,
      member: memberResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch All Members
const fetchAllMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .select("-createdAt -updatedAt -password -__v")
      .populate({
        path: "assignedTrainer",
        select: "name",
      })
      .lean();

    const formattedMembers = members.map((member) => ({
      ...member,
      assignedTrainer: member.assignedTrainer?._id || null,
      trainerName: member.assignedTrainer?.name || "Not Assigned",
    }));

    res.status(200).json({ members: formattedMembers });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch Member by Id
const fetchMemberById = async (req, res) => {
  const memberId = req.params.id;
  try {
    const member = await Member.findById(memberId).select("-password");
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ member: member });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch Member by MemberID
const fetchMemberByMemberId = async (req, res) => {
  const memberId = req.params.id;
  try {
    const member = await Member.findOne({ memberId: memberId }).select(
      "-password",
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json({ member: member });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Member by Id
const updateMemberById = async (req, res) => {
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

    const memberResponse = member.toObject();

    res
      .status(200)
      .json({ message: "Member updated successfully", member: memberResponse });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Delete Member by Id
const deleteMemberById = async (req, res) => {
  const memberId = req.params.id;
  try {
    const member = await Member.findByIdAndDelete(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res
      .status(200)
      .json({ message: "Member Deleted successfully!", memberId: memberId });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  registerMember,
  fetchAllMembers,
  fetchMemberById,
  fetchMemberByMemberId,
  updateMemberById,
  deleteMemberById,
};
