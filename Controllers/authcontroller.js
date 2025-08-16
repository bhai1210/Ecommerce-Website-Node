// controllers/authController.js
const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Services/emailService");

// Helper: Generate JWT
const generateToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn });
};

// @desc Register a new user
// controllers/authController.js
exports.registerUser = async (req, res) => {
  const { email, password, role } = req.body; // add role here

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role: role || "user" });
    await user.save();

    res.status(201).json({ message: `${role || "User"} registered successfully` });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// @desc Login user
// @desc Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Include password for comparison
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateToken({ id: user._id });

    // Exclude password in the response
    const { password: pwd, ...userData } = user._doc;

    res.json({
      token,
      user: userData,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// @desc Forgot Password - Send Reset Link
// @desc Forgot Password (send email with reset link)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const token = generateToken({ id: user._id }, "15m"); // expires in 15 min
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await sendEmail(
      user.email,
      "Password Reset Request",
      `<p>Click the link below to reset your password (valid for 15 min):</p>
       <a href="${resetLink}">${resetLink}</a>`
    );

    res.json({ message: "Password reset link sent to your email!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid or expired token" });
  }
};
