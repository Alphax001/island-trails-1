-- SQL Script to Update Admin User Role
-- Run this script in your Aiven MySQL database console

-- Update the admin user role
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@example.com';

-- Verify the update
SELECT id, name, email, role, created_at 
FROM users 
WHERE email = 'admin@example.com';

-- Also update test user if needed
UPDATE users 
SET role = 'customer' 
WHERE email = 'test@example.com';

-- View all users
SELECT id, name, email, role, created_at FROM users;
