-- Island Trails Database Schema

USE island_trails;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration VARCHAR(100),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    booking_date DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- Insert a test user
INSERT INTO users (name, email, password, role) VALUES 
('Test User', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer');

-- Insert some sample packages
INSERT INTO packages (title, description, price, duration, image_url) VALUES 
('Colombo City Tour', 'Explore the vibrant capital city of Sri Lanka with guided tours of historical sites, markets, and cultural landmarks.', 50.00, '1 day', 'https://example.com/colombo.jpg'),
('Kandy Cultural Experience', 'Visit the ancient city of Kandy, temple of the tooth, and experience traditional Sri Lankan culture.', 120.00, '2 days', 'https://example.com/kandy.jpg'),
('Galle Fort Heritage Walk', 'Walk through the historic Galle Fort, a UNESCO World Heritage site with colonial architecture.', 80.00, '1 day', 'https://example.com/galle.jpg'),
('Sigiriya Rock Fortress', 'Climb the famous Sigiriya Rock and explore ancient frescoes and royal gardens.', 150.00, '1 day', 'https://example.com/sigiriya.jpg'),
('Ella Tea Country Adventure', 'Experience the beautiful hill country, tea plantations, and scenic train rides in Ella.', 200.00, '3 days', 'https://example.com/ella.jpg');
