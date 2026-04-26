const pool = require('../config/db');
const { calculateRiskScore, calculatePremium } = require('../services/riskService');

async function getPremiumQuote(req, res) {
  const { city, daily_income, plan_id } = req.body;
  const userId = req.user.id;

  if (!city || !daily_income || !plan_id) {
    return res.status(400).json({ error: 'city, daily_income and plan_id are required' });
  }

  try {
    const riskData = await calculateRiskScore(city);
    const premiumData = calculatePremium(riskData.totalRiskScore, daily_income, plan_id);

    const today = new Date().toISOString().split('T')[0];

    await pool.query(
      `INSERT INTO risk_scores 
        (user_id, score_date, weather_risk, env_risk, mobility_risk, demand_risk, location_risk, total_risk_score, raw_signals)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        userId, today,
        riskData.weatherRisk, riskData.envRisk,
        riskData.mobilityRisk, riskData.demandRisk,
        riskData.locationRisk, riskData.totalRiskScore,
        JSON.stringify(riskData.rawSignals),
      ]
    );

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const existing = await pool.query(
      'SELECT id FROM premiums WHERE user_id=$1 AND week_start=$2',
      [userId, weekStartStr]
    );

    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO premiums (user_id, week_start, risk_score, expected_loss, platform_margin, final_premium, status)
         VALUES ($1,$2,$3,$4,$5,$6,'pending')`,
        [userId, weekStartStr, riskData.totalRiskScore,
         premiumData.expectedLoss, premiumData.platformMargin, premiumData.finalPremium]
      );
    }

    res.json({
      message: 'Premium quote calculated',
      risk: riskData,
      premium: premiumData,
      week_start: weekStartStr,
    });
  } catch (err) {
    console.error('Premium calculation error:', err);
    res.status(500).json({ error: 'Server error during premium calculation' });
  }
}

async function getMyPremiums(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM premiums WHERE user_id=$1 ORDER BY week_start DESC',
      [req.user.id]
    );
    res.json({ premiums: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getPremiumQuote, getMyPremiums };