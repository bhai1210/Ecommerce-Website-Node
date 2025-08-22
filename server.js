const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./ConfigData/db");
const serverless = require("serverless-http");

// Import routes
const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userroutes");
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classroutes");
const paymentRoutes = require("./routes/paymentRoutes");
const studentinforoutes = require("./routes/studentinforoutes");
const exptraRoutes = require("./routes/extraroutes");
const itemRoutes = require("./routes/itemroutes");

dotenv.config();
connectDB();

const app = express();

// ✅ Fix CORS for both localhost + Vercel
app.use(cors({
  origin: [
    "http://localhost:3000",             // Local frontend
    "https://student-management-xi-six.vercel.app"   // Replace with your actual frontend domain
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Routes
app.use("/items", itemRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/students", studentRoutes);
app.use("/class", classRoutes);
app.use("/payments", paymentRoutes);
app.use("/extra", exptraRoutes);
app.use("/studentinfo", studentinforoutes);

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Export as serverless handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);

// ✅ Run locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
