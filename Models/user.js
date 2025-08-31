const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true }, 
    role: {
      type: String,
      enum: ["admin", "user","user2"], // add your roles
      default: "user",
    },
    // for password reset
    resetToken: { type: String },
    resetTokenExpire: { type: Date },
    // optional extra fields:
    name: { type: String, trim: true },
  },
  { timestamps: true }
);

// Hide password by default when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
