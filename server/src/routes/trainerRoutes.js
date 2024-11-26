const router = require("express").Router();
const authenticateJWT = require("../middleware/authMiddleware");
const trainerController = require("../controllers/trainerController");

// Trainer Registration
router.post("/add", trainerController.registerTrainer);

// Fetch all Trainers
router.get("/", authenticateJWT(["admin"]), trainerController.fetchTrainers);

// Fetch Salary History
router.get(
  "/salaryhistory",
  authenticateJWT(["admin"]),
  trainerController.fetchSalaryHistory
);

// Fetch Trainer by ID
router.get(
  "/profile/:id",
  authenticateJWT(["admin", "trainer"]),
  trainerController.fetchTrainerById
);

// Custom Salary
router.post(
  "/salary/:id",
  authenticateJWT(["admin"]),
  trainerController.customSalary
);

// Batch Salary Payment
router.post(
  "/batchsalary",
  authenticateJWT(["admin"]),
  trainerController.batchPayment
);

// Update Trainer by ID
router.put(
  "/update/:id",
  authenticateJWT(["admin"]),
  trainerController.updateTrainerById
);

// Deleta Trainer by ID
router.delete(
  "/delete/:id",
  authenticateJWT(["admin"]),
  trainerController.deleteTrainerById
);

module.exports = router;
