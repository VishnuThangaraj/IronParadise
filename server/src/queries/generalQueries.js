const mongoose = require('mongoose');

const commonStages = () => [
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
        }
    },
    {
        $unset: "__v"
    }
];

const getAll = () => [
    ...commonStages()
];

const getById = (dietPlanId) => [
    {
        $match: {
            _id: new mongoose.Types.ObjectId(dietPlanId),
        }
    },
    ...commonStages()
];

module.exports = {
    getAll,
    getById
};