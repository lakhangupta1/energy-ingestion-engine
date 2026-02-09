CREATE TABLE meter_readings_history (
  id BIGSERIAL PRIMARY KEY,
  meter_id VARCHAR NOT NULL,
  kwh_consumed_ac FLOAT NOT NULL,
  voltage FLOAT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_meter_time 
ON meter_readings_history(meter_id, timestamp);


CREATE TABLE vehicle_readings_history (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id VARCHAR NOT NULL,
  soc FLOAT NOT NULL,
  kwh_delivered_dc FLOAT NOT NULL,
  battery_temp FLOAT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_vehicle_time 
ON vehicle_readings_history(vehicle_id, timestamp);


CREATE TABLE meter_live_status (
  meter_id VARCHAR PRIMARY KEY,
  kwh_consumed_ac FLOAT,
  voltage FLOAT,
  timestamp TIMESTAMPTZ
);

CREATE TABLE vehicle_live_status (
  vehicle_id VARCHAR PRIMARY KEY,
  soc FLOAT,
  kwh_delivered_dc FLOAT,
  battery_temp FLOAT,
  timestamp TIMESTAMPTZ
);
