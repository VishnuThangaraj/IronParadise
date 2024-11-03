const { Schema, model } = require("mongoose");

const sentEmailSchema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, required: true, ref: "Events" },
    sentDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = model("SentEmail", sentEmailSchema);
