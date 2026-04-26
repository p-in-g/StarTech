'use strict';
const pool = require('../config/db');

async function logActivity(req, res) {
  const userId = req.user.id;
  const {
    log_date,
    deliveries_completed,
    hours_online,
    earnings_that_day,
    was_active,
    gps_trace,
    accelerometer_variance,
  } = req.body;

  if (!log_date) {
    return res.status(400).json({ error: 'log_date is required' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM activity_logs WHERE user_id=$1 AND log_date=$2',
      [userId, log_date]
    );

    if (existing.rows.length > 0) {
      const result = await pool.query(
        `UPDATE activity_logs SET
          deliveries_completed=$1, hours_online=$2, earnings_that_day=$3,
          was_active=$4, gps_trace=$5, accelerometer_variance=$6
         WHERE user_id=$7 AND log_date=$8 RETURNING *`,
        [
          deliveries_completed || 0,
          hours_online || 0,
          earnings_that_day || 0,
          was_active || false,
          JSON.stringify(gps_trace || []),
          accelerometer_variance || 0,
          userId, log_date,
        ]
      );
      return res.json({ message: 'Activity updated', activity: result.rows[0] });
    }

    const result = await pool.query(
      `INSERT INTO activity_logs
        (user_id, log_date, deliveries_completed, hours_online, earnings_that_day, was_active, gps_trace, accelerometer_variance)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        userId, log_date,
        deliveries_completed || 0,
        hours_online || 0,
        earnings_that_day || 0,
        was_active || false,
        JSON.stringify(gps_trace || []),
        accelerometer_variance || 0,
      ]
    );

    res.status(201).json({ message: 'Activity logged', activity: result.rows[0] });
  } catch (err) {
    console.error('Activity log error:', err);
    res.status(500).json({ error: 'Server error during activity logging' });
  }
}

async function getMyActivity(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM activity_logs WHERE user_id=$1 ORDER BY log_date DESC LIMIT 30`,
      [req.user.id]
    );
    res.json({ activity: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

async function getActivitySummary(req, res) {
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_days,
        SUM(deliveries_completed) as total_deliveries,
        SUM(earnings_that_day) as total_earnings,
        AVG(earnings_that_day) as avg_daily_earnings,
        SUM(hours_online) as total_hours
       FROM activity_logs WHERE user_id=$1`,
      [req.user.id]
    );
    res.json({ summary: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { logActivity, getMyActivity, getActivitySummary };