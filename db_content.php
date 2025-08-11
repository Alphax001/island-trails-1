<?php
require_once 'src/database/connection.php';

echo "📊 CURRENT DATABASE CONTENT\n";
echo str_repeat("=", 40) . "\n";

try {
    $conn = DatabaseConnection::getConnection();
    
    // Get all users
    $stmt = $conn->query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($users) > 0) {
        echo "Recent users in database:\n";
        foreach ($users as $user) {
            echo "ID: {$user['id']} | Name: {$user['name']} | Email: {$user['email']} | Role: {$user['role']} | Created: {$user['created_at']}\n";
        }
    } else {
        echo "No users found in database.\n";
    }
    
    // Get total count
    $stmt = $conn->query("SELECT COUNT(*) as total FROM users");
    $total = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "\nTotal users: " . $total['total'] . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
