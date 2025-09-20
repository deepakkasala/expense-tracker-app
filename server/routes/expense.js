const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExcel,
} = require("../controllers/expense");

const router = express.Router();

router.use(protect);
router.post("/add-expense", addExpense);
router.get("/get-all-expenses", getAllExpenses);
router.delete("/:id", deleteExpense);
router.get("/download-excel", downloadExcel);

module.exports = router;
