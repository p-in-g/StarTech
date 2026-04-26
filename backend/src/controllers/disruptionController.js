'use strict';
const pool = require('../config/db');
const { calculateRiskScore } = require('../services/riskService');

const THRESHOLDS = {
  rainfall: 50,
  temperature_high: 45,
  temperature_low: 5,
  aqi: 400,
  wind_speed: 60,
};

async function checkDisruption(req, res) {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const riskData = await calculateRiskScore(city);
    const signals = riskData.rawSignals;

    const disruptions = [];

    if (signals.rainfall > THRESHOLDS.rainfall) {
      disruptions.push({
        type: 'heavy_rain',
        trigger_value: signals.rainfall,
        threshold_value: THRESHOLDS.rainfall,
      });
    }

    if (signals.temperature > THRESHOLDS.temperature_high) {
      disruptions.push({
        type: 'extreme_heat',
        trigger_value: signals.temperature,
        threshold_value: THRESHOLDS.temperature_high,
      });
    }

    if (signals.temperature < THRESHOLDS.temperature_low) {
      disruptions.push({
        type: 'cold_wave',
        trigger_value: signals.temperature,
        threshold_value: THRESHOLDS.temperature_low,
      });
    }

    if (signals.windSpeed > THRESHOLDS.wind_speed) {
      disruptions.push({
        type: 'strong_winds',
        trigger_value: signals.windSpeed,
        threshold_value: THRESHOLDS.wind_speed,
      });
    }

    const savedEvents = [];

    for (const d of disruptions) {
      const result = await pool.query(
        `INSERT INTO disruption_events 
          (city, type, trigger_value, threshold_value, source_data)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [city, d.type, d.trigger_value, d.threshold_value, JSON.stringify(signals)]
      );
      savedEvents.push(result.rows[0]);
    }

    res.json({
      city,
      disruptions_found: disruptions.length,
      events: savedEvents,
      current_conditions: signals,
      risk_score: riskData.totalRiskScore,
    });
  } catch (err) {
    console.error('Disruption check error:', err);
    res.status(500).json({ error: 'Server error during disruption check' });
  }
}

async function getActiveDisruptions(req, res) {
  const { city } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM disruption_events 
       WHERE city = $1 AND resolved_at IS NULL
       ORDER BY started_at DESC`,
      [city]
    );

    res.json({ city, active_disruptions: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { checkDisruption, getActiveDisruptions };