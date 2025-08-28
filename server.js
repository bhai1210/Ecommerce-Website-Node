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
app.post("/uploads", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Keep original extension (jpg, png, etc.)
    const originalName = req.file.originalname;
    const fileName = `uploads/${Date.now()}-${originalName}`;

    // Upload to vercel blob with correct MIME type
    const { url } = await put(fileName, req.file.buffer, {
      access: "public",
      contentType: req.file.mimetype,  // ✅ Important for browser preview
    });

    res.json({
      message: "File uploaded successfully",
      fileUrl: url, // ✅ Directly usable in <img src="">
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
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
