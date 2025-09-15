const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const { put } = require("@vercel/blob");
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
const orderRoutes = require("./routes/orderRoutes");
const recordRoutes = require("./routes/recordRoutes");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS Setup (allow multiple origins)



// this is cors setup
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "https://student-management-xi-six.vercel.app",
    ].filter(Boolean), // remove undefined
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Multer setup (memory storage for Vercel Blob + file size limit)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB max
});

// ✅ Upload Route
app.post("/uploads", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // infer content type
    const contentType = file.mimetype || "application/octet-stream";

    // upload to Vercel Blob
    const blob = await put(
      `uploads/${Date.now()}-${file.originalname}`,
      file.buffer,
      {
        access: "public",
        contentType,
      }
    );

    res.json({
      message: "File uploaded successfully",
      fileUrl: blob.url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ error: "Upload failed", details: error.message });
  }
});

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/class", classRoutes);
app.use("/payments", paymentRoutes);
app.use("/categories", categoryRoutes);
app.use("/sales", salesRoutes);
app.use("/heatmap", heatmapRoutes);
app.use("/employees", employeeRoutes);
app.use("/orders", orderRoutes);
app.use("/records", recordRoutes);

// ✅ Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
