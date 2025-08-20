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
  "🔐 Reset Your Password - Action Required",
  `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        background: #f4f7fb;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        animation: fadeIn 0.8s ease-in-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .header {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: #fff;
        padding: 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
      }
      .content {
        padding: 25px;
        color: #333;
        line-height: 1.6;
      }
      .content p {
        margin-bottom: 16px;
      }
      .btn {
        display: inline-block;
        padding: 12px 20px;
        background: #667eea;
        color: #fff !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        transition: background 0.3s ease;
      }
      .btn:hover {
        background: #5a67d8;
      }
      .footer {
        font-size: 13px;
        color: #777;
        text-align: center;
        padding: 15px;
        border-top: 1px solid #eee;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Hello <strong>${user.name || "User"}</strong>,</p>
        <p>We received a request to reset your password. If you made this request, please click the button below to set a new password:</p>
        
        <p style="text-align:center;">
          <a href="${resetLink}" class="btn">Reset Password</a>
        </p>
        
        <p>This link will expire in <strong>15 minutes</strong> for your security.</p>
        <p>If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.</p>
      </div>
      <div class="footer">
        <p>⚡ Secure Reset by <strong>GFFF Security Team</strong></p>
        <p>&copy; ${new Date().getFullYear()} Your App. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `
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
