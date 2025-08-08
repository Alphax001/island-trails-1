<?php
// Test user bookings directly from database
require_once 'src/database/connection.php';

$userId = $_GET['user_id'] ?? 8;

echo "🔍 Direct Database Query for User ID: {$userId}\n\n";

try {
    $conn = DatabaseConnection::getConnection();
    
    // Get user info
    $userStmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $userStmt->execute([$userId]);
    $user = $userStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo "❌ User not found!\n";
        exit;
    }
    
    echo "👤 User Info:\n";
    echo "- ID: {$user['id']}\n";
    echo "- Name: {$user['name']}\n";
    echo "- Email: {$user['email']}\n";
    echo "- Role: {$user['role']}\n\n";
    
    // Get bookings for this user with package details
    $sql = "
        SELECT 
            b.*,
            p.title as package_title,
            p.description as package_description,
            p.price as package_price,
            p.duration as package_duration,
            p.location as package_location
        FROM bookings b
        LEFT JOIN packages p ON b.package_id = p.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    ";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([$userId]);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "📅 Bookings for this user:\n";
    if (empty($bookings)) {
        echo "❌ No bookings found for this user!\n";
    } else {
        echo "✅ Found " . count($bookings) . " booking(s):\n\n";
        foreach ($bookings as $booking) {
            echo "=== Booking #{$booking['id']} ===\n";
            echo "Package: {$booking['package_title']}\n";
            echo "Package ID: {$booking['package_id']}\n";
            echo "Price: \${$booking['package_price']}\n";
            echo "Duration: {$booking['package_duration']}\n";
            echo "Location: {$booking['package_location']}\n";
            echo "Booking Date: {$booking['booking_date']}\n";
            echo "Status: {$booking['status']}\n";
            echo "Created: {$booking['created_at']}\n";
            echo "---\n\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
