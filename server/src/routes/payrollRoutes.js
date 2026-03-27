const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const {
  fetchAllTrainersWithSalary,
  makeTrainerSalaryPayment,
  fetchTrainerTransactions,
} = require("../controllers/payrollController");

// Fetch all Trainers Salary
router.get(
  "/",
  authenticateJWT(["admin", "manager"]),
  fetchAllTrainersWithSalary,
);

// Make Trainer Salary Payment
router.post(
  "/payment/:trainerId",
  authenticateJWT(["admin", "manager"]),
  makeTrainerSalaryPayment,
);

// Fetch Trainer Transactions
router.get(
  "/transactions",
  authenticateJWT(["admin", "manager"]),
  fetchTrainerTransactions,
);

module.exports = router;
