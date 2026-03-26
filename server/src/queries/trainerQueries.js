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

const getTrainerSalary = () => [
  { $sort: { createdAt: -1 } },

  {
    $group: {
      _id: "$trainer",
      latestSalary: { $first: "$$ROOT" },
    },
  },

  {
    $replaceRoot: { newRoot: "$latestSalary" },
  },

  {
    $lookup: {
      from: "users",
      localField: "trainer",
      foreignField: "_id",
      as: "trainer",
    },
  },

  { $unwind: "$trainer" },

  {
    $project: {
      month: 1,
      salary: 1,
      totalPayable: 1,
      paymentStatus: 1,
      "trainer._id": 1,
      "trainer.name": 1,
      "trainer.email": 1,
      "trainer.userId": 1,
    },
  },
];

module.exports = {
  getAllTrainerQuery,
  getTrainerSalary,
};
