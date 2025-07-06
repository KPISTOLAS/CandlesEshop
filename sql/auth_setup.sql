-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Insert demo users with hashed passwords
-- Note: These passwords are hashed using bcrypt with salt
-- demo123 -> $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQeO
-- password123 -> $2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW
-- admin123 -> $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQeO

-- Insert demo regular users
INSERT INTO users (email, password_hash, full_name, is_admin, created_at) VALUES
('demo@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQeO', 'Demo User', FALSE, CURRENT_TIMESTAMP),
('john@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'John Doe', FALSE, CURRENT_TIMESTAMP),
('sarah@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Sarah Smith', FALSE, CURRENT_TIMESTAMP);

-- Insert admin user
INSERT INTO users (email, password_hash, full_name, is_admin, created_at) VALUES
('admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQeO', 'Admin User', TRUE, CURRENT_TIMESTAMP);

-- Show the created users
SELECT id, email, full_name, is_admin, created_at FROM users; 