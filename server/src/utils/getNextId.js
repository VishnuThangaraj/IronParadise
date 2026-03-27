const Counter = require("../models/Counter");

const PREFIX = {
  diet: "DPL",
  admin: "ADM",
  staff: "STF",
  member: "MBR",
  workout: "WPL",
  trainer: "TRN",
  transaction: "PTR",
  membershipplan: "MPL",
};

async function getNextId(role) {
  const counter = await Counter.findByIdAndUpdate(
    role,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  return `${PREFIX[role]}-${counter.seq.toString().padStart(3, "0")}`;
}

module.exports = getNextId;
