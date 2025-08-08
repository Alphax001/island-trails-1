<?php
// Check user details and test booking API
require_once 'src/database/connection.php';

echo "👥 User Details:\n\n";

try {
    $conn = DatabaseConnection::getConnection();
    
    // Get all users
    $stmt = $conn->query("SELECT id, name, email, role FROM users ORDER BY id");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($users as $user) {
        echo "User ID {$user['id']}: {$user['name']} ({$user['email']}) - {$user['role']}\n";
        
        // Count bookings for this user
        $bookingStmt = $conn->prepare("SELECT COUNT(*) as count FROM bookings WHERE user_id = ?");
        $bookingStmt->execute([$user['id']]);
        $bookingCount = $bookingStmt->fetch(PDO::FETCH_ASSOC)['count'];
        echo "  └── Has {$bookingCount} booking(s)\n\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
