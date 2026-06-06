-- SmartSub MVP Database Schema
-- Run this against your PostgreSQL database to create required tables

CREATE TABLE IF NOT EXISTS app_user (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_import (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES app_user(id),
  file_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'processing',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS merchant (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  normalized_name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transaction_record (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES app_user(id),
  data_import_id INTEGER REFERENCES data_import(id),
  merchant_id INTEGER REFERENCES merchant(id),
  transaction_date DATE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscription (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES app_user(id),
  merchant_id INTEGER REFERENCES merchant(id),
  average_amount NUMERIC(10,2),
  billing_cycle VARCHAR(50),
  next_payment_date DATE,
  confidence_score NUMERIC(3,2) DEFAULT 0.90,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscription_transaction (
  subscription_id INTEGER REFERENCES subscription(id),
  transaction_id INTEGER REFERENCES transaction_record(id),
  PRIMARY KEY (subscription_id, transaction_id)
);

CREATE TABLE IF NOT EXISTS notification (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES app_user(id),
  subscription_id INTEGER REFERENCES subscription(id),
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed demo user
INSERT INTO app_user (email)
VALUES ('demo@smartsub.com')
ON CONFLICT (email) DO NOTHING;
