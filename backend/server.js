const dotenv = require('dotenv');
const app = require("./app");
const logger = require("./config/logger");
const connectDB = require("./config/db");
dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/personal_finance';
const swaggerDocs = require("./config/swagger");

const startServer = async () => {
  try {
    await connectDB(MONGODB_URI);

    swaggerDocs(app, PORT);

    app.listen(PORT, () => {
      logger.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.log(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  logger.log(`Unhandled Rejection: ${err}`);
  process.exit(1);
});

startServer();
