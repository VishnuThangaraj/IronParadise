const TrainerSalary = require("../models/TrainerSalary");
const TrainerTransaction = require("../models/TrainerTransaction");

const {getTrainerSalary} = require("../queries/trainerQueries");

// Fetch All Trainer Payroll
const fetchAllTrainersWithSalary = async (req, res) => {
    try {
        const trainers = await TrainerSalary.aggregate(getTrainerSalary());

        res.status(200).json({
            success: true,
            message: "Trainers salary have been fetched successfully",
            trainers: trainers || [],
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Trainers payroll",
            error: err.message,
        });
    }
};

// Make Trainer Salary payment
const makeTrainerSalaryPayment = async (req, res) => {
    const {trainerId} = req.params;
    const {amount, ...rest} = req.body;
    try {
        if (!trainerId) {
            return res.status(400).json({
                success: false,
                message: "Please provide trainer ID",
            });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0",
            });
        }

        const trainerSalary = await TrainerSalary.findOne({trainer: trainerId})
            .sort({createdAt: -1})
            .lean(false);

        if (!trainerSalary) {
            return res.status(404).json({
                success: false,
                message: "Trainer salary not found",
            });
        }

        const {pendingAmount, paymentStatus} = trainerSalary;

        if (paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "Trainer salary has already been paid",
            });
        }

        if (pendingAmount < amount) {
            return res.status(400).json({
                success: false,
                message: "Cannot overpay the trainer",
            });
        }

        trainerSalary.pendingAmount = pendingAmount - amount;

        if (trainerSalary.pendingAmount === 0) {
            trainerSalary.paymentStatus = "paid";
            trainerSalary.paidOn = new Date();
        } else {
            trainerSalary.paymentStatus = "partial";
        }

        const trainerTransaction = new TrainerTransaction({
            trainer: trainerId,
            salaryRef: trainerSalary._id,
            amount,
            ...rest,
        });

        await Promise.all([trainerSalary.save(), trainerTransaction.save()]);

        res.status(200).json({
            success: true,
            message: "Trainer salary has been paid successfully",
            trainerSalary: trainerSalary,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update trainer payroll",
            error: err.message,
        });
    }
};

// Fetch Transcations by TrainerID
const fetchTrainerTransactions = async (req, res) => {
    const {trainerId} = req.params;
    try {
        if (!trainerId) {
            return res.status(400).json({
                success: false,
                message: "Please provide Trainer ID",
            });
        }
        const transactions = await TrainerTransaction.find({trainer: trainerId})
            .sort({createdAt: -1})
            .lean();

        res.status(200).json({
            success: true,
            message: "Trainer transactions have been fetched successfully",
            transactions: transactions || [],
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch trainer transactions",
            error: err.message,
        });
    }
};

module.exports = {
    fetchAllTrainersWithSalary,
    makeTrainerSalaryPayment,
    fetchTrainerTransactions,
};
