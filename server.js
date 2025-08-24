const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./ConfigData/db");
const authRoutes = require('./routes/authroutes')
const userRoutes = require('./routes/userroutes')
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require('./routes/classroutes')
const paymentRoutes = require("./routes/paymentRoutes");
const datasroutes = require('./routes/datasroutes');

const exptraRoutes= require('./routes/extraroutes')
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
app.use("/payments", paymentRoutes);
app.use("/extra",exptraRoutes);
app.use('/datas',datasroutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
