const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  addIncome,
  downloadExcel,
  deleteIncome,
  getAllIncomes,
} = require("../controllers/income");
const router = express.Router();

router.post("/add-income", protect, addIncome);
router.get("/get-all-incomes", protect, getAllIncomes);
router.get("/download-excel", protect, downloadExcel);
router.delete("/:id", protect, deleteIncome);

module.exports = router;
