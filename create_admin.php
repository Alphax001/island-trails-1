<?php
/**
 * Script to create an admin user for Island Trails website
 * Run this once to create your first admin account
 */

require_once 'src/database/connection.php';

// Admin user details - CHANGE THESE VALUES
$adminData = [
    'name' => 'Admin User',
    'email' => 'admin@islandtrails.com',
    'password' => 'admin123', // Change this password!
    'role' => 'admin'
];

try {
    $conn = DatabaseConnection::getConnection();
    
    // Check if admin user already exists
    $checkSql = "SELECT COUNT(*) FROM users WHERE email = :email";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bindParam(':email', $adminData['email']);
    $checkStmt->execute();
    $userExists = $checkStmt->fetchColumn() > 0;
    
    if ($userExists) {
        echo "Admin user with email '{$adminData['email']}' already exists!\n";
        echo "Try logging in with that email address.\n";
    } else {
        // Create admin user
        $sql = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)";
        $stmt = $conn->prepare($sql);
        
        $stmt->bindParam(':name', $adminData['name']);
        $stmt->bindParam(':email', $adminData['email']);
        $hashedPassword = password_hash($adminData['password'], PASSWORD_BCRYPT);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':role', $adminData['role']);
        
        if ($stmt->execute()) {
            echo "✅ Admin user created successfully!\n\n";
            echo "Login credentials:\n";
            echo "Email: {$adminData['email']}\n";
            echo "Password: {$adminData['password']}\n";
            echo "Role: {$adminData['role']}\n\n";
            echo "You can now log in through the website with these credentials.\n";
            echo "🔥 IMPORTANT: Change the password after first login!\n";
        } else {
            echo "❌ Failed to create admin user.\n";
        }
    }
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
