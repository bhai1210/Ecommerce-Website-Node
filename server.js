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

app.post("/uploads", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    // infer content type (so browser can render properly)
    const contentType = file.mimetype || "application/octet-stream";

    const blob = await put(`uploads/${Date.now()}-${file.originalname}`, file.buffer, {
      access: "public",
      contentType,   // ✅ important for images
    });

    res.json({
      message: "File uploaded successfully",
      fileUrl: blob.url,  // e.g. https://...vercel-storage.com/xxx.png
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
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
