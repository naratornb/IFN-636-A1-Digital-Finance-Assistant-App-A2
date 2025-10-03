const mongoose = require("mongoose");

mongoose.set('strictQuery', true);

const connectDB = async (URI) => {
  try {
    await mongoose.connect(URI);  
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
