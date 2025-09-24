const dotenv = require('dotenv');
const app = require("./app");
const logger = require("./config/logger");
const connectDB = require("./config/db");
dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/personal_finance';

const startServer = async () => {
  try {
    // Using Singleton Pattern for database connection
    await connectDB(MONGODB_URI);

    app.listen(PORT, () => {
      logger.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.log(`Failed to start server: ${error}`);
    // Ensure the process exits with a non-zero code to indicate failure
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.log(`Unhandled Rejection: ${err}`);
  // Close server & exit process
  process.exit(1);
});

startServer();
