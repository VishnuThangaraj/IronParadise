const mongoose = require("mongoose");

const getAllMembersQuery = () => [
    {
        $lookup: {
            from: "memberfitnessplans",
            localField: "_id",
            foreignField: "memberId",
            as: "fitness",
        },
    },
    {
        $unwind: {
            path: "$fitness",
            preserveNullAndEmptyArrays: true,
        },
    },

    {
        $lookup: {
            from: "memberships",
            localField: "_id",
            foreignField: "memberId",
            as: "membership",
        },
    },
    {
        $unwind: {
            path: "$membership",
            preserveNullAndEmptyArrays: true,
        },
    },

    {
        $addFields: {
            membershipPlanId: "$membership.planId",
        },
    },

    {
        $lookup: {
            from: "membershipplans",
            localField: "membershipPlanId",
            foreignField: "_id",
            as: "subscription",
        },
    },
    {
        $unwind: {
            path: "$subscription",
            preserveNullAndEmptyArrays: true,
        },
    },

    {
        $lookup: {
            from: "users",
            localField: "assignedTrainer",
            foreignField: "_id",
            as: "trainer",
        },
    },
    {
        $unwind: {
            path: "$trainer",
            preserveNullAndEmptyArrays: true,
        },
    },

    {
        $project: {
            memberId: 1,
            name: 1,
            email: 1,
            phone: 1,
            gender: 1,
            height: 1,
            weight: 1,
            bmi: 1,
            dob: 1,
            address: 1,
            status: 1,

            workoutPlan: "$fitness.workoutPlan",
            dietPlan: "$fitness.dietPlan",

            assignedTrainer: "$trainer._id",
            assignedTrainerName: "$trainer.name",

            membershipPlan: "$subscription._id",
            subscriptionName: "$subscription.name",
            subscriptionActive: "$subscription.isActive",

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
        },
    },
];

const getMemberByIdQuery = (memberId) => [
    {
        $match: {
            _id: new mongoose.Types.ObjectId(memberId),
        },
    },

    {
        $lookup: {
            from: "memberfitnessplans",
            localField: "_id",
            foreignField: "memberId",
            as: "fitness",
        },
    },
    {
        $unwind: {
            path: "$fitness",
            preserveNullAndEmptyArrays: true,
        },
    },

    {
        $lookup: {
            from: "memberships",
            localField: "_id",
            foreignField: "memberId",
            as: "membership",
        },
    },
    {
        $unwind: {
            path: "$membership",
            preserveNullAndEmptyArrays: true,
        },
    },

    {
        $addFields: {
            membershipPlanId: "$membership.planId",
        },
    },

    {
        $lookup: {
            from: "membershipplans",
            localField: "membershipPlanId",
            foreignField: "_id",
            as: "subscription",
        },
    },
    {
        $unwind: {
            path: "$subscription",
            preserveNullAndEmptyArrays: true,
        },
    },

    {
        $lookup: {
            from: "users",
            localField: "assignedTrainer",
            foreignField: "_id",
            as: "trainer",
        },
    },
    {
        $unwind: {
            path: "$trainer",
            preserveNullAndEmptyArrays: true,
        },
    },

    {
        $project: {
            memberId: 1,
            name: 1,
            email: 1,
            phone: 1,
            gender: 1,
            height: 1,
            weight: 1,
            bmi: 1,
            dob: 1,
            address: 1,
            status: 1,

            workoutPlan: "$fitness.workoutPlan",
            dietPlan: "$fitness.dietPlan",

            assignedTrainer: "$trainer._id",
            assignedTrainerName: "$trainer.name",

            membershipPlan: "$subscription._id",
            subscriptionName: "$subscription.name",
            subscriptionActive: "$subscription.isActive",

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
        },
    },
];

module.exports = {
    getAllMembersQuery,
    getMemberByIdQuery,
};
