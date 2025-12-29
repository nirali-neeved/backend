const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
