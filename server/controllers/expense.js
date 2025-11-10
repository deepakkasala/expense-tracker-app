const User = require("../models/user");
const Expense = require("../models/expense");
const xlsx = require("xlsx");

const addExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const { icon, category, amount, date } = req.body;
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });
    await newExpense.save();
    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      newExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getAllExpenses = async (req, res) => {
  const userId = req.user.id;
  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
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
    const expenses = await Expense.find({ userId });

    const expenseData = expenses.map((expense) => ({
      Category: expense.category,
      Amount: expense.amount,
      Date: expense.date.toISOString().split("T")[0],
    }));

    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(expenseData);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Expenses");

    // ✅ Create in-memory Excel file
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    // ✅ Set response headers
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expense_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // ✅ Send file to client directly
    res.send(buffer);
  } catch (error) {
    console.error("Error generating expense Excel:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { addExpense, getAllExpenses, deleteExpense, downloadExcel };
