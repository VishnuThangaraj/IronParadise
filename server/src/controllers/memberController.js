const Member = require("../models/Member");
const Membership = require("../models/Membership");
const MemberFitnessPlan = require("../models/MemberFitnessPlan");

const { sendMail } = require("../service/emailService");
const renderTemplate = require("../service/templateEngine");

const {
  getAllMembersQuery,
  getMemberByIdQuery,
} = require("../queries/memberQueries");

// Register Member
const registerMember = async (req, res) => {
  const { email, phone } = req.body;

  try {
    const existingMember = await Member.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingMember) {
      if (existingMember?.email === email) {
        return res.status(409).json({
          success: false,
          message: "A member with this email already exists",
        });
      }

      if (existingMember?.phone === phone) {
        return res.status(409).json({
          success: false,
          message: "A member with this phone already exists",
        });
      }
    }

    const member = new Member({
      ...req.body,
    });

    await member.save();

    const memberResponse = {
      ...member.toObject(),
      formattedDob: new Date(member?.dob).toDateString(),
    };

    const html = renderTemplate("layouts/base.hbs", {
      body: renderTemplate("member/welcome.hbs", {
        member: memberResponse,
      }),
    });

    const subject = "Iron Paradise - Membership Registration";

    // sendMail(memberResponse.email, subject, html);

    res.status(201).json({
      success: true,
      message: `Member registered successfully`,
      member: memberResponse,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create new Member",
      error: err.message,
    });
  }
};

// Fetch All Members
const fetchAllMembers = async (req, res) => {
  try {
    const members = await Member.aggregate(getAllMembersQuery());

    return res.status(200).json({
      success: true,
      count: members?.length || 0,
      message: "Members have been successfully",
      members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all Members",
      error: error.message,
    });
  }
};

// Fetch Member by ID
const fetchMemberById = async (req, res) => {
  const memberId = req.params.id;

  try {
    const member = await Member.aggregate(getMemberByIdQuery(memberId));

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Member have been fetched successfully",
      member: member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Member by ID",
      error: err.message,
    });
  }
};

// Fetch Member by MemberID
const fetchMemberByMemberId = async (req, res) => {
  const memberId = req.params.id;
  try {
    const member = await Member.findOne({ memberId })
      .select("-createdAt -updatedAt -__v")
      .lean();

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found with the ID",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Member have been fetched successfully",
      member: member,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Member by MemberID",
      error: err.message,
    });
  }
};

// Update Member by ID
const updateMemberById = async (req, res) => {
  const memberId = req.params.id;
  const { updatedData } = req.body;
  console.log(req.body);
  return;

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

// Delete Member by ID
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
