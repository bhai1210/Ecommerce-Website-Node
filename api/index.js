const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const serverless = require("serverless-http");
const path = require("path");

const connectDB = require("../ConfigData/db");

// Load env variables
dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://student-management-xi-six.vercel.app"
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // if you need cookies or auth headers
};

app.use(cors(corsOptions));

app.use(express.json());

// ✅ Routes
app.use("/auth", require("../routes/authRoutes"));
app.use("/users", require("../routes/userRoutes"));
app.use("/students", require("../routes/studentRoutes"));
app.use("/class", require("../routes/classRoutes"));
app.use("/api/payments", require("../routes/paymentRoutes"));
app.use("/extra", require("../routes/extraRoutes"));
app.use("/studentinfo", require("../routes/studentinfoRoutes"));
app.use("/items", require("../routes/itemRoutes"));

// Static files (optional for dev)
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Export both Express app and serverless handler
module.exports = {
  app,              // for local development
  handler: serverless(app) // for Vercel
};
