'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'GigShield API is running' });
});

const authRoutes = require('./src/routes/authRoutes');
const premiumRoutes = require('./src/routes/premiumRoutes');
const disruptionRoutes = require('./src/routes/disruptionRoutes');
const payoutRoutes = require('./src/routes/payoutRoutes');
const activityRoutes = require('./src/routes/activityRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/disruption', disruptionRoutes);
app.use('/api/payout', payoutRoutes);
app.use('/api/activity', activityRoutes);

app.listen(PORT, () => {
  console.log(`GigShield server running on port ${PORT}`);
});