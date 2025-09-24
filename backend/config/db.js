// config/db.js
const mongoose = require("mongoose");

// Set strictQuery explicitly to suppress the warning
mongoose.set('strictQuery', true);

const connectDB = async (URI) => {
  try {
    await mongoose.connect(URI);  // Remove deprecated options
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Throw the error instead of exiting here, so the caller can handle it properly
    throw error;
  }
};

module.exports = connectDB;
