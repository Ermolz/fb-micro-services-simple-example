const { MongoClient } = require('mongodb');
const config = require('./env');

let client = null;
let db = null;

const connectDB = async () => {
  try {
    if (!client) {
      client = new MongoClient(config.mongodb.url);
      await client.connect();
      db = client.db(config.mongodb.db);
      console.log('MongoDB connected');
      
      await db.collection('notifications').createIndex({ userId: 1 });
      await db.collection('notifications').createIndex({ createdAt: -1 });
      await db.collection('notifications').createIndex({ read: 1 });
    }
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB disconnected');
  }
};

module.exports = { connectDB, getDB, closeDB };
