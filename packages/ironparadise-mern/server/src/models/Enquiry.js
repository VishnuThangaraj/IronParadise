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
    address: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    height: {
      type: Number,
      min: 0,
    },
    weight: {
      type: Number,
      min: 0,
    },
    dob: {
      type: Date,
      required: false,
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
