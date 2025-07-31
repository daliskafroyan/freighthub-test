-- Logistics Tracking Database Initialization
-- This script runs when the PostgreSQL container starts for the first time

-- Ensure the database exists (it should be created by POSTGRES_DB env var)
-- But we can add any additional setup here

-- Create extensions that might be useful for logistics tracking
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Log successful initialization (using a comment instead of pg_settings)
-- Database initialized for Logistics Tracking App

-- Create a simple test table to verify everything works
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'OK',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert a test record
INSERT INTO health_check (status) VALUES ('Database initialized successfully');

-- Grant permissions (if needed for additional users in the future)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user; 