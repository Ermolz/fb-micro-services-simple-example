const { Kafka } = require('kafkajs');
const config = require('../config/env');
const notificationRepository = require('../repositories/notification.repository');

class KafkaConsumer {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'notification-service',
      brokers: [config.kafka.broker]
    });
    this.consumer = this.kafka.consumer({ groupId: 'notification-service-group' });
    this.isRunning = false;
  }

  async connect(retries = 10, delay = 5000) {
    for (let i = 0; i < retries; i++) {
      try {
        await this.consumer.connect();
        console.log('Kafka consumer connected');
        return;
      } catch (error) {
        console.log(`Kafka connection attempt ${i + 1}/${retries} failed:`, error.message);
        if (i < retries - 1) {
          console.log(`Retrying in ${delay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
  }

  async subscribe() {
    await this.consumer.subscribe({ topic: 'payment-events', fromBeginning: false });
    console.log('Subscribed to payment-events topic');
  }

  async run() {
    if (this.isRunning) {
      return;
    }

    await this.connect();
    await this.subscribe();

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value.toString());
          console.log('Received event:', event.eventType);

          await this.handleEvent(event);
        } catch (error) {
          console.error('Error processing Kafka message:', error);
        }
      }
    });

    this.isRunning = true;
    console.log('Kafka consumer started');
  }

  async handleEvent(event) {
    switch (event.eventType) {
      case 'payment.created':
        await this.handlePaymentCreated(event.data);
        break;
      case 'payment.status.updated':
        await this.handlePaymentStatusUpdated(event.data);
        break;
      default:
        console.log('Unknown event type:', event.eventType);
    }
  }

  async handlePaymentCreated(data) {
    try {
      await notificationRepository.create({
        userId: data.userId,
        type: 'payment',
        title: 'Payment Created',
        message: `Payment of $${data.amount} has been created for order #${data.orderId}`
      });
      console.log('Notification created for payment:', data.paymentId);
    } catch (error) {
      console.error('Error creating payment notification:', error);
    }
  }

  async handlePaymentStatusUpdated(data) {
    try {
      const statusMessages = {
        success: 'Payment completed successfully',
        failed: 'Payment failed',
        cancelled: 'Payment was cancelled'
      };

      await notificationRepository.create({
        userId: data.userId,
        type: 'payment',
        title: 'Payment Status Updated',
        message: statusMessages[data.status] || `Payment status changed to ${data.status}`
      });
      console.log('Notification created for payment status update:', data.paymentId);
    } catch (error) {
      console.error('Error creating payment status notification:', error);
    }
  }

  async disconnect() {
    if (this.isRunning) {
      await this.consumer.disconnect();
      this.isRunning = false;
      console.log('Kafka consumer disconnected');
    }
  }
}

module.exports = new KafkaConsumer();
