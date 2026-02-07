-- MS SQL Server Database Setup Script
-- Run this script to manually create the database and table

-- Create Database
CREATE DATABASE angular_springboot_db;
GO

-- Use the Database
USE angular_springboot_db;
GO

-- Create Users Table
CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT chk_username_length CHECK (LEN(username) >= 3),
    CONSTRAINT chk_password_length CHECK (LEN(password) >= 6)
);
GO

-- Create Index on Username for faster lookups
CREATE INDEX idx_username ON users(username);
GO

-- Create Index on Email for faster lookups
CREATE INDEX idx_email ON users(email);
GO

-- Insert Sample Users (Passwords are BCrypt hashed for "password123")
INSERT INTO users (username, email, password, created_at) VALUES 
('admin', 'admin@example.com', '$2a$10$SlYQMW7hXLEHBXMaW.5LqOu4M2AnfLEHGLHGLHGLHGLHGLHGLHGLHGL', GETDATE()),
('user1', 'user1@example.com', '$2a$10$SlYQMW7hXLEHBXMaW.5LqOu4M2AnfLEHGLHGLHGLHGLHGLHGLHGLHGL', GETDATE());
GO

-- Verify Table Creation
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users';
GO

-- View Users
SELECT id, username, email, created_at FROM users;
GO
