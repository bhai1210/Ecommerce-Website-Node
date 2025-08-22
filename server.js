const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./ConfigData/db");
const authRoutes = require('./routes/authroutes')
const userRoutes = require('./routes/userroutes')
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require('./routes/classroutes')
const paymentRoutes = require("./routes/paymentRoutes");
const studentinforoutes= require('./routes/studentinforoutes')
const exptraRoutes= require('./routes/extraroutes')

const path = require("path");
dotenv.config(); // make sure to load .env first
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/items", require("./routes/itemroutes"));
app.use("/auth", authRoutes);
app.use("/users",userRoutes);
app.use("/students",studentRoutes);
app.use("/class",classRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/extra",exptraRoutes);
app.use('/StudentInfo',studentinforoutes)

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
