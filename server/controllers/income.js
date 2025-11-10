const User = require("../models/user");
const Income = require("../models/income");
const xlsx = require("xlsx");

const addIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const { icon, source, amount, date } = req.body;
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });
    await newIncome.save();
    res
      .status(201)
      .json({ success: true, message: "Income added successfully", newIncome });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getAllIncomes = async (req, res) => {
  const userId = req.user.id;
  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      message: "Incomes fetched successfully",
      incomes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    await Income.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const downloadExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const incomes = await Income.find({ userId });

    const incomeData = incomes.map((income) => ({
      Source: income.source,
      Amount: income.amount,
      Date: income.date.toISOString().split("T")[0],
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(incomeData);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Incomes");

    // ✅ Generate Excel file in memory (no disk write)
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    // ✅ Set headers for download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=income_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // ✅ Send buffer
    res.send(buffer);
  } catch (error) {
    console.error("Error generating income Excel:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { addIncome, getAllIncomes, downloadExcel, deleteIncome };
