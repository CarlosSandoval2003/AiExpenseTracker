require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();

// Middleware to handel CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api", chatbotRoutes);

// Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const sslOptions = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
};

const PORT = process.env.PORT || 5000;

app.get("/ping", (req, res) => {
  res.status(200).send("Pong! 🧠 Server is awake");
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
