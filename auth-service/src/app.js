const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth-service' });
});

module.exports = app;
