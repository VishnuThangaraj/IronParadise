const mongoose = require("mongoose");

const commonStages = () => [
  {
    $match: {
      role: "trainer",
    },
  },
  {
    $set: {
      createdAt: {
        $dateToString: {
          format: "%d-%m-%Y %H:%M",
          date: "$createdAt",
        },
      },
      updatedAt: {
        $dateToString: {
          format: "%d-%m-%Y %H:%M",
          date: "$updatedAt",
        },
      },
      joiningDate: {
        $dateToString: {
          format: "%d-%m-%Y",
          date: "$joiningDate",
        },
      },
      dob: {
        $dateToString: {
          format: "%d-%m-%Y",
          date: "$dob",
        },
      },
    },
  },
  {
    $unset: ["__v", "password"],
  },
];

const getAllTrainerQuery = () => [...commonStages()];

module.exports = {
  getAllTrainerQuery,
};
