const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connect successfully");
  } catch (error) {
    if (process.env.NODE_ENV === "test") {
      throw error;
    }
    console.log("DB not connected ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
