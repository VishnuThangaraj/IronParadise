const { Schema, model } = require("mongoose");

const enquirySchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: false,
      required: true,
    },
    phone: {
      type: String,
      unique: false,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    aadharNumber: {
      type: String,
      unique: false,
      default: "",
    },
    panNumber: {
      type: String,
      unique: false,
      default: "",
    },
    replaySubject: {
      type: String,
      default: "",
    },
    replayMessage: {
      type: String,
      default: "",
    },
    member: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Enquiry", enquirySchema);
