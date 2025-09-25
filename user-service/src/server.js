const app = require('./app');
const { initDatabase } = require('./config/db');
const config = require('./config/env');

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(config.port, () => {
      console.log(`User service running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
