const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ---------- helpers ----------
const allowedRoles = ["admin", "user","user2"]; // adjust to your app
const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

const pickUpdatableFields = (body) => {
  const out = {};
  if (isNonEmptyString(body.email)) out.email = body.email.trim();
  if (isNonEmptyString(body.role)) out.role = body.role.trim();
  if (isNonEmptyString(body.name)) out.name = body.name.trim(); // optional if you have it
  return out;
};

const sendEmail = async (to, subject, html) => {
  // Expect these in env:
  // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html,
  });
};

// ---------- CREATE ----------
exports.createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const exists = await User.findOne({ email: email.trim().toLowerCase() });
    if (exists) {
      return res.status(400).json({ error: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role && allowedRoles.includes(role) ? role : "user",
    });

    const userSafe = newUser.toObject();
    delete userSafe.password;

    return res.status(201).json({
      message: "User created successfully",
      user: userSafe,
    });
  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------- READ (ALL) ----------
exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.find()
    return res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------- READ (ONE) ----------
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error("getUserById error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ---------- UPDATE ----------
// UPDATE USER (password optional)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password, role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (email) user.email = email;
    if (role) user.role = role;

    // Password only updated if provided
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- DELETE ----------
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};



// Forgot Password - Send Reset Link
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const html = `<p>Click <a href="${resetURL}">here</a> to reset your password. This link is valid for 15 minutes.</p>`;

    await sendEmail(user.email, "Password Reset Request", html);

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.id,
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};