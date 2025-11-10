require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const incomeRoutes = require("./routes/income");
const expenseRoutes = require("./routes/expense");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3080;

app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully on Vercel!");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
