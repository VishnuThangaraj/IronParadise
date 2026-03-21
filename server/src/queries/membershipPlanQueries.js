const mongoose = require('mongoose');

const getAllMembershipPlans = () => [
    {
        $project: {
            membershipPlanId: 1,
            name: 1,
            durationMonths: 1,
            price: 1,
            features: 1,
            isActive: 1,

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

const getMembershipPlanById = (membershipPlanId) => [
    {
        $match: {
            _id: new mongoose.Types.ObjectId(membershipPlanId),
        },
    },
    {
        $project: {
            membershipPlanId: 1,
            name: 1,
            durationMonths: 1,
            price: 1,
            features: 1,
            isActive: 1,

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
    getAllMembershipPlans,
    getMembershipPlanById
}