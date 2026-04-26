'use strict';
require('dotenv').config();

const THRESHOLDS = {
  rainfall: 50,
  temperature_high: 45,
  temperature_low: 5,
  aqi: 400,
  wind_speed: 60,
};

async function getWeatherRisk(city) {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey || apiKey === 'b11c4272d5a3dbd6c22ecf4842460a2a') {
      console.log('Using mock weather data');
      return {
        weatherRisk: 0.2,
        envRisk: 0.1,
        rawSignals: {
          temperature: 32,
          rainfall: 5,
          windSpeed: 15,
          weatherCondition: 'clear sky',
          city,
        },
      };
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      console.log('Weather API error, using mock data');
      return {
        weatherRisk: 0.2,
        envRisk: 0.1,
        rawSignals: {
          temperature: 32,
          rainfall: 5,
          windSpeed: 15,
          weatherCondition: 'clear sky',
          city,
        },
      };
    }

    const temp = data.main.temp;
    const rainfall = data.rain ? data.rain['1h'] || data.rain['3h'] || 0 : 0;
    const windSpeed = data.wind.speed * 3.6;
    const weatherId = data.weather[0].id;

    let weatherRisk = 0;
    if (temp > THRESHOLDS.temperature_high) weatherRisk += 0.4;
    else if (temp < THRESHOLDS.temperature_low) weatherRisk += 0.3;
    if (rainfall > THRESHOLDS.rainfall) weatherRisk += 0.5;
    else if (rainfall > 20) weatherRisk += 0.2;
    if (windSpeed > THRESHOLDS.wind_speed) weatherRisk += 0.3;
    if (weatherId >= 200 && weatherId < 300) weatherRisk += 0.4;
    if (weatherId >= 900) weatherRisk += 0.5;

    weatherRisk = Math.min(weatherRisk, 1.0);

    return {
      weatherRisk: parseFloat(weatherRisk.toFixed(2)),
      envRisk: 0.1,
      rawSignals: {
        temperature: temp,
        rainfall,
        windSpeed,
        weatherCondition: data.weather[0].description,
        city,
      },
    };
  } catch (err) {
    console.error('Weather fetch error:', err);
    return {
      weatherRisk: 0.2,
      envRisk: 0.1,
      rawSignals: {
        temperature: 32,
        rainfall: 5,
        windSpeed: 15,
        weatherCondition: 'clear sky',
        city,
      },
    };
  }
}

function getMobilityRisk(city) {
  const highRiskCities = ['Delhi', 'Mumbai', 'Kolkata'];
  return highRiskCities.includes(city) ? 0.2 : 0.1;
}

function getDemandRisk() {
  const hour = new Date().getHours();
  if (hour >= 14 && hour <= 16) return 0.3;
  if (hour >= 22 || hour <= 6) return 0.2;
  return 0.1;
}

function getLocationRisk(city) {
  const coastalCities = ['Mumbai', 'Chennai', 'Kolkata'];
  const hillyCities = ['Dehradun', 'Shimla', 'Darjeeling'];
  if (coastalCities.includes(city)) return 0.3;
  if (hillyCities.includes(city)) return 0.25;
  return 0.1;
}

async function calculateRiskScore(city) {
  const { weatherRisk, envRisk, rawSignals } = await getWeatherRisk(city);
  const mobilityRisk = getMobilityRisk(city);
  const demandRisk = getDemandRisk();
  const locationRisk = getLocationRisk(city);

  const totalRiskScore = parseFloat(
    (weatherRisk + envRisk + mobilityRisk + demandRisk + locationRisk).toFixed(2)
  );

  return {
    weatherRisk,
    envRisk,
    mobilityRisk,
    demandRisk,
    locationRisk,
    totalRiskScore,
    rawSignals,
  };
}

function calculatePremium(riskScore, dailyIncome, planId) {
  const plans = {
    basic: { dailyCoverage: 300, maxDays: 3, margin: 50 },
    standard: { dailyCoverage: 500, maxDays: 3, margin: 75 },
    premium: { dailyCoverage: 800, maxDays: 3, margin: 100 },
  };

  const plan = plans[planId] || plans.basic;
  const expectedDisruptionDays = Math.min(riskScore * 3, 3);
  const expectedLoss = dailyIncome * expectedDisruptionDays;
  const finalPremium = parseFloat(
    (riskScore * expectedLoss + plan.margin).toFixed(2)
  );
  const maxWeeklyPayout = plan.dailyCoverage * plan.maxDays;

  return {
    expectedLoss: parseFloat(expectedLoss.toFixed(2)),
    platformMargin: plan.margin,
    finalPremium,
    maxWeeklyPayout,
    dailyCoverage: plan.dailyCoverage,
    expectedDisruptionDays: parseFloat(expectedDisruptionDays.toFixed(1)),
  };
}

module.exports = { calculateRiskScore, calculatePremium };