-- Sample Data for Island Trails
-- Run this after setting up admin users

-- Insert sample packages
INSERT INTO packages (title, description, price, duration, image_url, created_at) VALUES
(
    'Sigiriya Rock Fortress Adventure',
    'Explore the ancient Sigiriya Rock Fortress, a UNESCO World Heritage site featuring stunning frescoes, water gardens, and breathtaking views from the summit.',
    150.00,
    '1 Day',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    NOW()
),
(
    'Kandy Cultural Experience',
    'Immerse yourself in Sri Lankan culture with visits to the Temple of the Tooth, traditional dance performances, and a scenic walk around Kandy Lake.',
    120.00,
    '2 Days',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    NOW()
),
(
    'Nuwara Eliya Tea Plantation Tour',
    'Discover the hill country beauty of Nuwara Eliya, visit working tea plantations, learn about tea processing, and enjoy the cool mountain climate.',
    180.00,
    '3 Days',
    'https://images.unsplash.com/photo-1564518047129-3bd58b70cd1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    NOW()
),
(
    'Galle Fort Heritage Walk',
    'Explore the historic Galle Fort, a Dutch colonial fortress with cobblestone streets, boutique shops, cafes, and stunning ocean views.',
    90.00,
    '1 Day',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    NOW()
),
(
    'Yala National Park Safari',
    'Experience Sri Lanka wildlife on an exciting safari in Yala National Park. Spot elephants, leopards, sloth bears, and exotic birds.',
    200.00,
    '2 Days',
    'https://images.unsplash.com/photo-1549366021-9f761d040a94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    NOW()
),
(
    'Mirissa Whale Watching',
    'Embark on an unforgettable whale watching adventure in Mirissa. See blue whales, sperm whales, and dolphins in their natural habitat.',
    75.00,
    '4 Hours',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    NOW()
);

-- Verify packages were created
SELECT id, title, price, duration, created_at FROM packages;
