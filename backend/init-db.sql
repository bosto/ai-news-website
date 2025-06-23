-- Database initialization script for AI News Website
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (handled by POSTGRES_DB env var)
-- Create user if it doesn't exist (handled by POSTGRES_USER env var)

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE ai_news_db TO ai_news_user;

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_stat_statements for query performance monitoring
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create a schema for better organization (optional)
-- CREATE SCHEMA IF NOT EXISTS ai_news AUTHORIZATION ai_news_user;

-- The actual tables will be created by Prisma migrations