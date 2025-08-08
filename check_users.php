<?php
/**
 * Script to check existing users in the database
 */

require_once 'src/database/connection.php';

try {
    $conn = DatabaseConnection::getConnection();
    
    // Get all users
    $sql = "SELECT id, name, email, role, created_at FROM users ORDER BY role DESC, created_at ASC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($users)) {
        echo "No users found in the database.\n";
    } else {
        echo "Users in the database:\n";
        echo str_repeat("=", 80) . "\n";
        printf("%-5s %-20s %-30s %-10s %-20s\n", "ID", "Name", "Email", "Role", "Created");
        echo str_repeat("-", 80) . "\n";
        
        foreach ($users as $user) {
            printf("%-5s %-20s %-30s %-10s %-20s\n", 
                $user['id'], 
                substr($user['name'], 0, 20), 
                substr($user['email'], 0, 30), 
                $user['role'],
                substr($user['created_at'] ?? 'N/A', 0, 20)
            );
        }
        echo str_repeat("=", 80) . "\n";
        
        // Count by role
        $adminCount = count(array_filter($users, function($u) { return $u['role'] === 'admin'; }));
        $customerCount = count(array_filter($users, function($u) { return $u['role'] === 'customer'; }));
        
        echo "\nSummary:\n";
        echo "Admin users: $adminCount\n";
        echo "Customer users: $customerCount\n";
        echo "Total users: " . count($users) . "\n";
        
        if ($adminCount > 0) {
            echo "\n🔑 Admin Login Credentials:\n";
            foreach ($users as $user) {
                if ($user['role'] === 'admin') {
                    echo "Email: {$user['email']}\n";
                    echo "Password: [You need to know this or reset it]\n";
                    break;
                }
            }
        }
    }
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
