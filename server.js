const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./ConfigData/db");
const { put } = require("@vercel/blob"); // ✅ import vercel blob

// Import Routes
const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userroutes");
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classroutes");
const paymentRoutes = require("./routes/paymentRoutes");
const datasroutes = require("./routes/datasroutes");
const exptraRoutes = require("./routes/extraroutes");

dotenv.config(); 
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ File Upload Route with Vercel Blob
app.post("/uploads", async (req, res) => {
  try {
    if (!req.headers["content-type"]?.startsWith("multipart/form-data")) {
      return res.status(400).json({ message: "Content-Type must be multipart/form-data" });
    }

    // Collect raw request body (since Express doesn’t parse multipart automatically)
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", async () => {
      const buffer = Buffer.concat(chunks);

      // Save file to Vercel Blob
      const blob = await put(`uploads/${Date.now()}.bin`, buffer, {
        access: "public", // so frontend can access
      });

      res.json({
        message: "File uploaded successfully",
        fileUrl: blob.url, // ✅ Blob URL instead of local path
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "File upload failed", error });
  }
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
