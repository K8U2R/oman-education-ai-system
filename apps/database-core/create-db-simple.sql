-- ============================================
-- Create oman_education_db Database
-- ============================================
-- Run this in psql:
--   psql -U postgres -f create-db-simple.sql
-- Or copy and paste in psql prompt

-- Check if database exists
SELECT 1 FROM pg_database WHERE datname = 'oman_education_db';

-- Create database (if not exists)
CREATE DATABASE oman_education_db;

-- Verify creation
\l oman_education_db
