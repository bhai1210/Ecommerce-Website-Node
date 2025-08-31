const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");   // ✅ required for file uploads
const connectDB = require("./ConfigData/db");
const { put } = require("@vercel/blob"); // ✅ vercel blob

// Import Routes
const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userroutes");
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classroutes");
const paymentRoutes = require("./routes/paymentRoutes");
const datasroutes = require("./routes/datasroutes");
const exptraRoutes = require("./routes/extraroutes");
const categoryRoutes = require('./routes/categoryRoutes')
const employeeRoutes = require("./routes/employeeRoutes");
dotenv.config();
connectDB();

const app = express();

// ✅ Fix CORS (allow frontend domain explicitly)
app.use(cors({
  // origin: process.env.CLIENT_URL || "*",   
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// ✅ setup multer (memory storage for vercel-blob)
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
    const blob = await put(`uploads/${Date.now()}-${file.originalname}`, file.buffer, {
      access: "public",
      contentType,
    });

    res.json({
      message: "File uploaded successfully",
      fileUrl: blob.url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ✅ Existing Routes
app.use("/items", require("./routes/itemroutes"));
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/students", studentRoutes);
app.use("/class", classRoutes);
app.use("/payments", paymentRoutes);
app.use("/extra", exptraRoutes);
app.use("/datas", datasroutes);
app.use("/categories", categoryRoutes);

app.use("/employees", employeeRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
