const { Kafka } = require('kafkajs');
const config = require('../config/env');

class KafkaService {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'payment-service',
      brokers: [config.kafka.broker]
    });
    this.producer = this.kafka.producer();
    this.isConnected = false;
  }

  async connect(retries = 5, delay = 3000) {
    if (this.isConnected) {
      return;
    }

    for (let i = 0; i < retries; i++) {
      try {
        await this.producer.connect();
        this.isConnected = true;
        console.log('Kafka producer connected');
        return;
      } catch (error) {
        console.log(`Kafka producer connection attempt ${i + 1}/${retries} failed:`, error.message);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.error('Failed to connect to Kafka after retries');
          throw error;
        }
      }
    }
  }

  async publishPaymentCreated(paymentData) {
    try {
      try {
        await this.connect();
      } catch (connectError) {
        console.error('Cannot connect to Kafka, skipping event publication');
        return;
      }
      await this.producer.send({
        topic: 'payment-events',
        messages: [
          {
            key: `payment-${paymentData.paymentId}`,
            value: JSON.stringify({
              eventType: 'payment.created',
              timestamp: new Date().toISOString(),
              data: {
                paymentId: paymentData.paymentId,
                userId: paymentData.userId,
                orderId: paymentData.orderId,
                amount: paymentData.amount,
                status: paymentData.status
              }
            })
          }
        ]
      });
      console.log('Payment created event published to Kafka');
    } catch (error) {
      console.error('Error publishing to Kafka:', error);
    }
  }

  async publishPaymentStatusUpdated(paymentData) {
    try {
      try {
        await this.connect();
      } catch (connectError) {
        console.error('Cannot connect to Kafka, skipping event publication');
        return;
      }
      await this.producer.send({
        topic: 'payment-events',
        messages: [
          {
            key: `payment-${paymentData.paymentId}`,
            value: JSON.stringify({
              eventType: 'payment.status.updated',
              timestamp: new Date().toISOString(),
              data: {
                paymentId: paymentData.paymentId,
                userId: paymentData.userId,
                orderId: paymentData.orderId,
                status: paymentData.status
              }
            })
          }
        ]
      });
      console.log('Payment status updated event published to Kafka');
    } catch (error) {
      console.error('Error publishing to Kafka:', error);
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.isConnected = false;
      console.log('Kafka producer disconnected');
    }
  }
}

module.exports = new KafkaService();
