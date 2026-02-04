const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      index: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, "Please provide a valid phone number"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    replied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

EnquirySchema.index({ email: 1, createdAt: -1 });

EnquirySchema.pre("save", function (next) {
  this.firstName = this.firstName?.replace(/\s+/g, " ").trim();
  this.lastName = this.lastName?.replace(/\s+/g, " ").trim();
  this.subject = this.subject?.replace(/\s+/g, " ").trim();
  next();
});

module.exports = mongoose.model("Enquiry", EnquirySchema);
