const Income = require("../models/expense");
const Expense = require("../models/income");
const { isValidObjectId, Types } = require("mongoose");

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    //Fetch Total Income and Expenses.
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    console.log("Total Income: ", {
      totalIncome,
      userId: isValidObjectId(userId),
    });
    const totalExpenses = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    console.log("Total Expenses: ", {
      totalExpenses,
      userId: isValidObjectId(userId),
    });

    //Get Income Transactions in the last 60 days.
    const last60DaysIncomeTransactions = await Income.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });
    //Get Total Income of Last 60 days.
    const totalIncomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    //Get Expense Transactions in the last 30 days.
    const last30DaysExpenseTransactions = await Expense.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    //Get Total Expenses of Last 30 days.
    const totalExpensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    //Fetch Recent 5 Income and Expense Transactions.
    const lastTransactions = [
      ...(
        await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)
      ).map((item) => ({ ...item.toObject(), type: "Income" })),
      ...(
        await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)
      ).map((item) => ({ ...item.toObject(), type: "Expense" })),
    ].sort((a, b) => b.date - a.date);

    res.status(200).json({
      success: true,
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
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
