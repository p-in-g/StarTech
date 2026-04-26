'use strict';
const pool = require('../config/db');

const TRUST_THRESHOLD = 0.5;

async function calculateTrustScore(userId, date) {
  try {
    const activityResult = await pool.query(
      `SELECT * FROM activity_logs WHERE user_id=$1 AND log_date=$2`,
      [userId, date]
    );

    if (activityResult.rows.length === 0) {
      return { trustScore: 0, reason: 'No activity found for this date' };
    }

    const activity = activityResult.rows[0];
    let trustScore = 0;

    if (activity.was_active) trustScore += 0.3;
    if (activity.deliveries_completed > 0) trustScore += 0.3;
    if (activity.hours_online > 2) trustScore += 0.2;
    if (activity.gps_trace && activity.gps_trace.length > 0) trustScore += 0.1;
    if (activity.accelerometer_variance > 0.1) trustScore += 0.1;

    trustScore = parseFloat(Math.min(trustScore, 1.0).toFixed(2));

    await pool.query(
      `INSERT INTO trust_scores 
        (user_id, score_date, gps_consistency, activity_match, behavior_pattern, platform_data_match, final_trust_score, flagged_for_review)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        userId, date,
        activity.gps_trace ? 0.8 : 0.2,
        activity.deliveries_completed > 0 ? 0.9 : 0.1,
        activity.hours_online > 2 ? 0.8 : 0.3,
        activity.deliveries_completed > 0 ? 0.9 : 0.1,
        trustScore,
        trustScore < TRUST_THRESHOLD,
      ]
    );

    return { trustScore, reason: 'Trust score calculated successfully' };
  } catch (err) {
    console.error('Trust score error:', err);
    return { trustScore: 0, reason: 'Error calculating trust score' };
  }
}

async function triggerPayout(req, res) {
  const { disruption_event_id, disruption_date } = req.body;
  const userId = req.user.id;

  if (!disruption_event_id || !disruption_date) {
    return res.status(400).json({ error: 'disruption_event_id and disruption_date are required' });
  }

  try {
    const eventResult = await pool.query(
      'SELECT * FROM disruption_events WHERE id=$1',
      [disruption_event_id]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Disruption event not found' });
    }

    const existing = await pool.query(
      'SELECT id FROM payout_claims WHERE user_id=$1 AND disruption_event_id=$2',
      [userId, disruption_event_id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Payout already claimed for this disruption' });
    }

    const weekStart = new Date(disruption_date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const claimsThisWeek = await pool.query(
      `SELECT COUNT(*) FROM payout_claims 
       WHERE user_id=$1 
       AND disruption_date >= $2 
       AND status IN ('approved','paid')`,
      [userId, weekStartStr]
    );

    if (parseInt(claimsThisWeek.rows[0].count) >= 3) {
      return res.status(400).json({ error: 'Maximum 3 payouts per week reached' });
    }

    const { trustScore, reason } = await calculateTrustScore(userId, disruption_date);

    const userResult = await pool.query(
      'SELECT plan_id FROM users WHERE id=$1',
      [userId]
    );

    const planId = userResult.rows[0]?.plan_id || 'basic';
    const coverageMap = { basic: 300, standard: 500, premium: 800 };
    const coverageAmount = coverageMap[planId] || 300;

    let status = 'approved';
    let message = 'Payout approved and will be processed';

    if (trustScore < TRUST_THRESHOLD) {
      status = 'flagged';
      message = 'Payout flagged for manual review due to low trust score';
    }

    const payout = await pool.query(
      `INSERT INTO payout_claims 
        (user_id, disruption_event_id, disruption_date, coverage_amount, trust_score_at_payout, status)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [userId, disruption_event_id, disruption_date, coverageAmount, trustScore, status]
    );

    res.json({
      message,
      payout: payout.rows[0],
      trust_score: trustScore,
      trust_reason: reason,
      coverage_amount: coverageAmount,
      status,
    });
  } catch (err) {
    console.error('Payout error:', err);
    res.status(500).json({ error: 'Server error during payout' });
  }
}

async function getMyPayouts(req, res) {
  try {
    const result = await pool.query(
      `SELECT pc.*, de.type as disruption_type, de.city 
       FROM payout_claims pc
       JOIN disruption_events de ON pc.disruption_event_id = de.id
       WHERE pc.user_id=$1
       ORDER BY pc.triggered_at DESC`,
      [req.user.id]
    );

    res.json({ payouts: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { triggerPayout, getMyPayouts };