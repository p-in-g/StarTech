# StarTech
Solution for Guidewire DEVTrails Hackathon - Phase 1

Our documnet includes the following content:

1. Problem understanding 

2. Specific persona-based solution idea

3. Expected weekly pricing model(Architecture)

4. Smart fraud prevention 

5. AI Usage

6. System workflow

7. **Adversarial Defense & Anti-Spoofing Strategy**

### 1. Problem Understanding

Gig workers, such as delivery partners and service providers, rely heavily on **daily earnings **rather than **fixed salaries**. Their income is highly vulnerable to **external, uncontrollable factors** such as extreme weather conditions, poor air quality, and government-imposed restrictions.

These disruptions can significantly reduce or completely halt their ability to work, leading to sudden and unfair income loss. Unlike traditional employees, gig workers **lack access** to formal **financial protection systems** like paid leave or insurance coverage for such scenarios.

As a result, even short-term disruptions can create financial instability, making it difficult for workers to manage daily expenses.

The real-world scenarios which can disrupt the daily earning of these workers are as follows: 

| **Category**                | **Disruption Type**         | **Trigger Condition (Parametric)**          | **Impact on Gig Workers (Income Loss)** |
| --------------------------- | --------------------------- | ------------------------------------------- | --------------------------------------- |
| **Weather Risks**           | Extreme Heat                | Temperature > 40–45°C, Heatwave alerts      | Reduced working hours, fewer deliveries |
|                             | Heavy Rain                  | Rainfall > 50 mm/day                        | Delivery slowdown, unsafe roads         |
|                             | Flooding / Waterlogging     | Water levels above threshold                | Roads blocked, delivery zones disabled  |
|                             | Thunderstorms / Lightning   | Severe weather alerts                       | Temporary suspension of operations      |
|                             | Cyclones / Severe Storms    | Govt/Weather red alerts                     | Complete shutdown of deliveries         |
|                             | Cold Waves                  | Temperature below safe threshold            | Reduced outdoor activity                |
|                             |                             |                                             |                                         | 
| **Environmental Risks**     | Severe Air Pollution        | AQI > 400                                   | Workers avoid outdoor work              |
|                             | Smog / Low Visibility       | Visibility below safe limit                 | Unsafe driving, fewer orders            |
|                             | Dust Storms                 | High wind + dust alerts                     | Delivery disruption                     |
|                             | Industrial Pollution Alerts | Govt-issued warnings                        | Restricted movement, health concerns    |
| **Mobility Risks due to**   |                             |                                             |                                         |
| ( Government Restrictions ) | Curfews                     | Official curfew announcements               | No movement allowed → zero income       |
|                             | Emergency Lockdowns         | Govt emergency orders                       | Complete halt of work                   |
|                             | Restricted Delivery Zones   | Security restrictions                       | Limited service areas                   |
|                             | Election Restrictions       | Temporary mobility limits                   | Reduced delivery access                 | 
|                             |                             |                                             |                                         |
| **Platform Disruptions**    | App Outages                 | Platform downtime (Zomato/Swiggy APIs)      | No order allocation                     |
|                             | Payment Gateway Failure     | Payment systems down                        | Orders halted                           |
|                             | Warehouse Shutdowns         | Fulfillment center closure                  | No pickups -> No deliveries             |
|                             | Algorithmic Delivery Pause  | Platform disables orders                    | No earning opportunities                | 
|                             | Low Demand                  | The demand is low                           | No demands -> No deliveries             |
|                             |                             |                                             |                                         |
| **Geographic Risks**        | Landslides (Hilly Areas)    | Road blockage alerts                        | No route access                         |
|                             | Urban Flooding              | City flood alerts (e.g., Mumbai, Bengaluru) | Delivery suspension                     |
|                             | Coastal Storm Surges        | Coastal warning alerts                      | Zones shut down                         |


### 2. Persona based solution

Our primary target users are food delivery partners working with platforms like Zomato and Swiggy.
These workers operate in a gig-based model where their income depends on daily completed deliveries rather than fixed monthly salaries. 
As a result, their earnings are highly sensitive to real-world conditions such as weather disruptions, pollution levels, and mobility restrictions.

Our system introduces an AI-driven income protection model that dynamically evaluates potential income loss and compensates workers in a fair and automated manner.
Instead of relying on manual claims, the model:
  1. Identifies the type of disruption.
  2. Estimates expected income loss based on historical activity and real-time conditions.
  3. Calculates compensation proportionally, ensuring alignment with platform guidelines and realistic earning patterns.

This creates a transparent and unbiased loss recovery mechanism that supports workers without requiring complex claim processes.


### 3. Expected Weekly pricing model

Traditional salaried employees benefit from built-in income stability through fixed wages, paid leave, and employer-backed risk absorption. 
These mechanisms ensure that temporary disruptions do not directly impact their earnings.
In contrast, gig workers face complete income volatility, as their earnings depend entirely on daily activity and external conditions.

The weekly premium is calculated using a combination of disruption risk and expected income loss.

First, the system estimates the probability of income disruption using real-world data such as weather, pollution, and demand patterns.

Then, it calculates the expected financial loss based on the worker’s average earnings and likely downtime.

A small platform margin is added to ensure system sustainability, cover operational costs, and maintain a risk buffer.

This results in a fair and adaptive weekly premium that balances affordability with financial protection.


Our system is built around a parametric insurance model that eliminates manual claims and ensures real-time income protection.

We classify disruption risks into five categories: 
1. weather (r1)
2. environmental(r2)
3. mobility(r3)
4. demand-based(r4)
5. location-specific risks(r5)

These factors are used to compute a dynamic risk score for each user.

Instead of fixed pricing, the system calculates a weekly premium based on expected income loss and real-time risk conditions.

                         Premium = (Risk Score × Expected Loss) + Margin

                         Expected Loss = Daily Income × Expected Disruption Days

                         Margin = Platfrom Cost + Risk Buffer

                         Payout = Predefined Coverage × Number of Disruption Days

                         Max Weekly Payout = Coverage per Day × Max Claimable Days

**1. Risk Score** : r1 + r2 + r3 + r4 + r5

**2. Expected Weekly Loss** : Based on the user's estimated income loss per disruption days. 

**3. Expected Disruption Days** : Estimated using historical patterns and short-term forecasts (e.g., predicted rainy days, high AQI alerts, or known restriction periods)

**4. Income estimation**: Derived from historical delivery activity, including working hours, order frequency, and earnings per delivery.

**5. Coverage** : Coverage is selected based on the user’s income level

**6. Expected Disruption Days** : Estimated using historical patterns and short-term forecasts (e.g., predicted rainy days, high AQI alerts, or known restriction periods)

**7. Risk Buffers** : Extra money kept aside to handle unexpected or higher-than-predicted payouts. To avoid the system to collapse.

Payouts are triggered automatically when predefined conditions are met, eliminating the need for manual claims.

                         Payouts will be triggered only when the user is active during the disrupted day.


### 4. Smart Fraud Prevention

Our system incorporates multiple layers of risk management to ensure financial sustainability, prediction accuracy, and fair usage

  ## Financial risk 
     Controlled through capped payouts, tiered plans, dynamic pricing, and inclusion of a risk buffer to handle unexpected surges in claims.

  ## Prediction risk 
     Minimized by combining multiple real-world signals such as weather, pollution, demand patterns, and location-based risks, along with continuous updates using real-time data.

  ## Fraud risk 
     Addressed through activity verification, behavioral analysis, and anomaly detection techniques that identify irregular usage patterns and potential spoofing attempts.

**User fairness** is maintained by avoiding strict rejections and instead using review mechanisms and partial payouts to support genuine users.

Together, these mechanisms ensure that the system remains robust, scalable, and trustworthy under varying real-world conditions.


### 5. AI Usage in the model 

// Risk prediction

// risk calculation on the basis of the factors.

// Auto payouts

// where will we get our moel from

// expected Ai models used

// predictive disruption days, and coverage.


### 6. System Workflow

  ## User Onboarding
    User signs up and logs into the platform
    Links or simulates connection with delivery platforms like Zomato / Swiggy
    System collects:
      1. Delivery history
      2. Working hours
      3. Earnings data

  ## Activity Tracking
    User status is tracked as:
      1. Active : when available for deliveries
      2. Inactive : when not working
    System monitors:
      1. Number of deliveries
      2. Time spent online
      3. Movement patterns

  ## Income Estimation
    Weekly income is calculated using:
      1. Average earnings per delivery
      2. Number of deliveries
      3. Active working hours

  ## Risk Prediction
    System calculates Risk Score using:
      1. Weather forecasts
      2. AQI levels
      3. Mobility restrictions
      4. Demand patterns
      5. Location risk

    Expected disruption days (max capped at 3 days/week)

  ## Premium Calculation
    Weekly premium is calculated:
      Premium = (Risk Score × Expected Loss) + Margin

  ## Real - Time Monitoring ( Future - City wise) 
    System continuously tracks:
      1. Weather changes
      2. AQI spikes
      3. Traffic/curfew updates
      4. Platform demand
    Disruption Detection
      When predefined thresholds are met

  ## Activity Verifiaction & Payouts 
    Before payout, system checks:
      Was the user active during disruption?
      Did they show normal delivery behavior?
    If conditions are satisfied:
      Payout = Coverage × Number of Disruption Days


### 7. Adversarial Defense & Anti-Spoofing Strategy

After reading the we were clear of the doubt of whether something can go wrong in our systemor not :

To tackle the challenge specified in the given document our system follows:
  
      A ‘trust but verify’ approach, combining automation with intelligent validation to ensure both security and fairness.
      
To ensure robust detection, the system analyzes multiple data points beyond GPS:
      
    1. Accelerometer data : Detects real physical movement
    2. Network signal variation : Real users show fluctuating signal strength
    3. App activity logs : Order acceptance, navigation usage
    4. Delivery platform data : Number of deliveries, timestamps
    5. Historical behavior patterns : Usual working hours and zones
    6. Weather vs activity mismatch : Active location must align with realistic behavior

The system uses AI models to identify anomalies such as:

    1. Sudden location shifts without corresponding movement
    2. Users marked “active” but with no delivery activity
    3. Identical movement patterns across multiple users
    4. Presence in high-risk zones without realistic behavioral signals
    5. Each user is assigned a trust score, and payouts are only processed if the score meets a predefined threshold.









   
