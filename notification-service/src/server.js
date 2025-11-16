const app = require('./app');
const { connectDB } = require('./config/db');
const kafkaConsumer = require('./services/kafka.consumer');
const config = require('./config/env');

const startServer = async () => {
  try {
    await connectDB();
    
    kafkaConsumer.run().catch(error => {
      console.error('Kafka consumer failed to start, will retry:', error.message);
      console.log('Service will continue without Kafka consumer');
    });
    
    app.listen(config.port, () => {
      console.log(`Notification service running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await kafkaConsumer.disconnect();
  process.exit(0);
});

startServer();
