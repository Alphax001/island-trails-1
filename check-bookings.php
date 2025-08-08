<?php
// Check bookings in database
require_once 'src/database/connection.php';

echo "🔍 Checking Bookings in Database\n\n";

try {
    $conn = DatabaseConnection::getConnection();
    
    // Check if bookings table exists
    $tables = $conn->query("SHOW TABLES LIKE 'bookings'")->fetchAll();
    if (empty($tables)) {
        echo "❌ Bookings table does not exist!\n";
        
        // Show all tables
        echo "\nAvailable tables:\n";
        $allTables = $conn->query("SHOW TABLES")->fetchAll();
        foreach ($allTables as $table) {
            echo "- " . $table[0] . "\n";
        }
        exit;
    }
    
    echo "✅ Bookings table exists\n\n";
    
    // Show table structure
    echo "📋 Bookings table structure:\n";
    $structure = $conn->query("DESCRIBE bookings")->fetchAll();
    foreach ($structure as $column) {
        echo "- {$column['Field']}: {$column['Type']}\n";
    }
    
    echo "\n📊 All bookings in database:\n";
    $stmt = $conn->query("SELECT * FROM bookings ORDER BY id DESC");
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($bookings)) {
        echo "❌ No bookings found in database!\n";
    } else {
        echo "✅ Found " . count($bookings) . " booking(s):\n\n";
        foreach ($bookings as $booking) {
            echo "Booking ID: {$booking['id']}\n";
            echo "User ID: {$booking['user_id']}\n";
            echo "Package ID: {$booking['package_id']}\n";
            echo "Booking Date: {$booking['booking_date']}\n";
            echo "Status: {$booking['status']}\n";
            echo "Created: {$booking['created_at']}\n";
            echo "---\n";
        }
    }
    
    // Check users table to get user ID for test user
    echo "\n👤 Test user info:\n";
    $userStmt = $conn->prepare("SELECT id, name, email, role FROM users WHERE email = ?");
    $userStmt->execute(['test@example.com']);
    $testUser = $userStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($testUser) {
        echo "Test user found:\n";
        echo "- ID: {$testUser['id']}\n";
        echo "- Name: {$testUser['name']}\n";
        echo "- Email: {$testUser['email']}\n";
        echo "- Role: {$testUser['role']}\n";
        
        // Check bookings for this specific user
        echo "\n📅 Bookings for test user (ID: {$testUser['id']}):\n";
        $userBookingsStmt = $conn->prepare("SELECT * FROM bookings WHERE user_id = ?");
        $userBookingsStmt->execute([$testUser['id']]);
        $userBookings = $userBookingsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (empty($userBookings)) {
            echo "❌ No bookings found for test user!\n";
        } else {
            echo "✅ Found " . count($userBookings) . " booking(s) for test user:\n";
            foreach ($userBookings as $booking) {
                echo "- Booking #{$booking['id']}: Package {$booking['package_id']}, Status: {$booking['status']}\n";
            }
        }
    } else {
        echo "❌ Test user not found!\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
