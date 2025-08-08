<?php
/**
 * Script to reset admin password for Island Trails website
 * This will set a known password for an existing admin user
 */

require_once 'src/database/connection.php';

// Choose which admin to reset (change this email if needed)
$adminEmail = 'admin@example.com';  // This admin exists in your database
$newPassword = 'admin123';  // New password for the admin

try {
    $conn = DatabaseConnection::getConnection();
    
    // Check if admin user exists
    $checkSql = "SELECT id, name, email, role FROM users WHERE email = :email AND role = 'admin'";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bindParam(':email', $adminEmail);
    $checkStmt->execute();
    $admin = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        echo "❌ Admin user with email '{$adminEmail}' not found!\n";
        echo "Available admin emails:\n";
        
        // Show available admin emails
        $adminsSql = "SELECT email FROM users WHERE role = 'admin'";
        $adminsStmt = $conn->prepare($adminsSql);
        $adminsStmt->execute();
        $admins = $adminsStmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($admins as $adminUser) {
            echo "- {$adminUser['email']}\n";
        }
        exit;
    }
    
    // Update password
    $updateSql = "UPDATE users SET password = :password WHERE email = :email";
    $updateStmt = $conn->prepare($updateSql);
    
    $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
    $updateStmt->bindParam(':password', $hashedPassword);
    $updateStmt->bindParam(':email', $adminEmail);
    
    if ($updateStmt->execute()) {
        echo "✅ Admin password reset successfully!\n\n";
        echo "🔑 Admin Login Credentials:\n";
        echo "Email: {$adminEmail}\n";
        echo "Password: {$newPassword}\n";
        echo "Role: admin\n\n";
        echo "🌐 How to login:\n";
        echo "1. Go to: http://localhost/WAD/island-trails/frontend/\n";
        echo "2. Click the 'Login' button\n";
        echo "3. Enter the email and password above\n";
        echo "4. You'll see the 'Admin' menu item appear after login\n";
        echo "5. Click 'Admin' to access the admin dashboard\n\n";
        echo "🔥 IMPORTANT: Change this password after logging in!\n";
    } else {
        echo "❌ Failed to reset admin password.\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
