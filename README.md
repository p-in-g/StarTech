# StarTech
Solution for Guidewire DEVTrails Hackathon - Phase 1

Our documnet includes the following content:

1. Problem understanding 

2. Specific persona-based solution idea

3. AI Usage

4. Expected weekly pricing model

5. Smart fraud prevention 

6. System workflow

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
| **Environmental Risks**     | Severe Air Pollution        | AQI > 400                                   | Workers avoid outdoor work              |
|                             | Smog / Low Visibility       | Visibility below safe limit                 | Unsafe driving, fewer orders            |
|                             | Dust Storms                 | High wind + dust alerts                     | Delivery disruption                     |
|                             | Industrial Pollution Alerts | Govt-issued warnings                        | Restricted movement, health concerns    |
| **Mobility Risks due to     |                             |                                             |                                         |
| (Government Restrictions**) | Curfews                     | Official curfew announcements               | No movement allowed → zero income       |
|                             | Emergency Lockdowns         | Govt emergency orders                       | Complete halt of work                   |
|                             | Restricted Delivery Zones   | Security restrictions                       | Limited service areas                   |
|                             | Election Restrictions       | Temporary mobility limits                   | Reduced delivery access                 |
| **Platform Disruptions**    | App Outages                 | Platform downtime (Zomato/Swiggy APIs)      | No order allocation                     |
|                             | Payment Gateway Failure     | Payment systems down                        | Orders halted                           |
|                             | Warehouse Shutdowns         | Fulfillment center closure                  | No pickups → no deliveries              |
|                             | Algorithmic Delivery Pause  | Platform disables orders                    | No earning opportunities                |
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


### 3. AI Usage in the model 


### 4. Expected Weekly pricing model

Traditional salaried employees benefit from built-in income stability through fixed wages, paid leave, and employer-backed risk absorption. 
These mechanisms ensure that temporary disruptions do not directly impact their earnings.
In contrast, gig workers face complete income volatility, as their earnings depend entirely on daily activity and external conditions.











