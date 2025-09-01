const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const connectDB = require("./ConfigData/db");

// Import Routes
const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userroutes");
const classRoutes = require("./routes/classroutes");
const paymentRoutes = require("./routes/paymentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const salesRoutes = require("./routes/sales");
const heatmapRoutes = require("./routes/heatmap");

dotenv.config();
connectDB();

const app = express();

// ✅ Fix CORS (allow frontend domain explicitly)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ setup multer (disk storage for local uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // save in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Upload Route (save to local "uploads" folder)
app.post("/uploads", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`; // relative path

    res.json({
      message: "File uploaded successfully",
      fileUrl, // frontend can fetch this path
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ✅ Serve uploaded files statically
app.use("/uploads", express.static(uploadDir));

// ✅ Existing Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/class", classRoutes);
app.use("/payments", paymentRoutes);
app.use("/categories", categoryRoutes);
app.use("/sales", salesRoutes);
app.use("/heatmap", heatmapRoutes);
app.use("/employees", employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
