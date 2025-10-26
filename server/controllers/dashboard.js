const Income = require("../models/income");
const Expense = require("../models/expense");
const mongoose = require("mongoose");

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    console.log(userId, userObjectId);

    // ✅ Fetch all income and expenses for the user
    const incomes = await Income.find({ userId });
    const expenses = await Expense.find({ userId });

    // ✅ Calculate total income and expenses manually
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    console.log("Total Income:", totalIncome);
    console.log("Total Expenses:", totalExpenses);

    //Get Income Transactions in the last 60 days.
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const last60DaysIncomeTransactions = await Income.find({
      userId: userObjectId,
      date: { $gte: sixtyDaysAgo },
    }).sort({ date: -1 });
    console.log("last60DaysIncomeTransactions: ", last60DaysIncomeTransactions);

    //Get Total Income of Last 60 days.
    const totalIncomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    console.log("totalIncomeLast60Days: ", totalIncomeLast60Days);

    //Get Expense Transactions in the last 30 days.
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const last30DaysExpenseTransactions = await Expense.find({
      userId: userObjectId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 });
    console.log(
      "last30DaysExpenseTransactions: ",
      last30DaysExpenseTransactions
    );

    //Get Total Expenses of Last 30 days.
    const totalExpensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    console.log("totalExpensesLast30Days: ", totalExpensesLast30Days);

    //Fetch Recent 5 Income and Expense Transactions.
    const lastTransactions = [
      ...(
        await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)
      ).map((item) => ({ ...item.toObject(), type: "income" })),
      ...(
        await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)
      ).map((item) => ({ ...item.toObject(), type: "expense" })),
    ].sort((a, b) => b.date - a.date);
    console.log("lastTransactions: ", lastTransactions);

    res.status(200).json({
      success: true,
      totalBalance: totalIncome - totalExpenses,
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
      last30daysExpenses: {
        total: totalExpensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60daysIncome: {
        total: totalIncomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getDashboardData };
