# energy-ingestion-engine
High-scale telemetry ingestion engine for Smart Meters and EVs. Processes 1-minute heartbeat streams, stores data in PostgreSQL using cold (history) and hot (live state) architecture, and provides fast 24-hour analytics including AC/DC energy, efficiency ratio, and battery temperature. Built for millions of records per day.



High-Scale Energy Ingestion Engine
Overview

This project implements a high-scale backend ingestion system designed to process real-time telemetry data from Smart Meters and EV vehicles. The system consumes two independent 1-minute heartbeat streams, persists them efficiently in PostgreSQL, and provides fast 24-hour analytical insights into energy efficiency and battery performance.

The architecture is optimized for write-heavy ingestion and read-heavy analytics, supporting millions of telemetry records per day.

Key Features

1. Polymorphic ingestion for Meter and Vehicle streams

2. Append-only historical storage (audit & analytics)

3. Upsert-based live status storage (operational dashboard)

4. Indexed analytical queries (no full table scans)

5. 24-hour performance analytics endpoint

6. Dockerized environment for easy deployment



Telemetry Streams
Meter Stream (Grid Side)
{
  "meterId": "M1",
  "kwhConsumedAc": 15.2,
  "voltage": 230,
  "timestamp": "2026-02-09T10:00:00Z"
}


Vehicle Stream (Vehicle Side)
{
  "vehicleId": "V1",
  "soc": 75,
  "kwhDeliveredDc": 12.5,
  "batteryTemp": 36,
  "timestamp": "2026-02-09T10:00:00Z"
}


Architecture

The system follows a layered structure:
Routes → Controllers → Services → PostgreSQL




Database Design
Historical Tables

1. meter_readings_history

2. vehicle_readings_history

Optimized with composite indexes:
CREATE INDEX idx_vehicle_time
ON vehicle_readings_history(vehicle_id, timestamp);
Ensures analytical queries avoid full table scans.


Live Tables

1. meter_live_status

2. vehicle_live_status

Use ON CONFLICT DO UPDATE for atomic upsert operations.



Analytical Endpoint
GET /v1/analytics/performance/:vehicleId

Returns 24-hour summary:
{
  "totalAc": 150.3,
  "totalDc": 125.2,
  "efficiency": 0.83,
  "avgBatteryTemp": 35.8
}


Efficiency Formula
Efficiency = Total DC Delivered / Total AC Consumed
If efficiency drops below 0.85, it may indicate power loss or hardware issues.



Scalability Considerations

The system is designed to handle:

1. 10,000+ devices

2. ~20,000 events per minute

3. ~28 million telemetry records per day

Scalability strategies:

1. Append-only write model

2. Indexed analytical queries

3. Hot vs Cold data separation

4. Connection pooling

5. Docker-based deployment

6. Future improvements for extreme scale:

7. Batch ingestion

8. Table partitioning

9. Message queue (Kafka/RabbitMQ)

10. Horizontal scaling (Node cluster mode)


Tech Stack

Node.js, Express.js, PostgreSQL, pg (database driver), Joi (validation), Docker


Running the Project
(bash )docker-compose up --build

Service runs at:
http://localhost:3000



Conclusion

This ingestion engine demonstrates:

1. High-throughput telemetry handling

2. Optimized data persistence strategy (Insert vs Upsert)

3. Efficient analytical querying without full table scans

4. Scalable backend architecture for millions of records per day
# energy-ingestion-engine
