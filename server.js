const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const connectDB = require("./ConfigData/db");

// Import Routes
const authRoutes = require('./routes/authroutes');
const userRoutes = require('./routes/userroutes');
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require('./routes/classroutes');
const paymentRoutes = require("./routes/paymentRoutes");
const datasroutes = require('./routes/datasroutes');
const exptraRoutes = require('./routes/extraroutes');

dotenv.config(); // make sure to load .env first
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// 👉 Serve uploaded files (so frontend can access them via URL)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 📌 Multer Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder name
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  }
});

const upload = multer({ storage: storage });

// 👉 File Upload Route
app.post("/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    filePath: `/uploads/${req.file.filename}`
  });
});

// Existing Routes
app.use("/items", require("./routes/itemroutes"));
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/students", studentRoutes);
app.use("/class", classRoutes);
app.use("/payments", paymentRoutes);
app.use("/extra", exptraRoutes);
app.use("/datas", datasroutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
