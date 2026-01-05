const Counter = require("../models/Counter");

const PREFIX = {
  admin: "ADM",
  trainer: "TRN",
  staff: "STF",
  member: "MBR",
  membershipplan: "MPL",
  workout: "WPL",
  diet: "DPL",
};

async function getNextId(role) {
  const counter = await Counter.findByIdAndUpdate(
    role,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `${PREFIX[role]}-${counter.seq.toString().padStart(3, "0")}`;
}

module.exports = getNextId;
