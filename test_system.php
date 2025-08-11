<?php
echo "🔍 Testing Database Connection and Authentication System\n\n";

// Test 1: Database Connection
echo "=== Database Connection Test ===\n";
try {
    require_once 'src/database/connection.php';
    $connection = new Connection();
    $conn = $connection->getConnection();
    
    if ($conn) {
        echo "✅ Database connection successful\n";
        
        // Test if users table exists
        $stmt = $conn->prepare("SHOW TABLES LIKE 'users'");
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            echo "✅ Users table exists\n";
            
            // Check table structure
            $stmt = $conn->prepare("DESCRIBE users");
            $stmt->execute();
            $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
            echo "📋 Table columns: " . implode(', ', $columns) . "\n";
        } else {
            echo "❌ Users table not found\n";
        }
    } else {
        echo "❌ Database connection failed\n";
    }
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}

echo "\n=== Authentication API Test ===\n";

// Test 2: UserApi Class
try {
    require_once 'src/api/auth/userApi.php';
    $userApi = new UserApi();
    echo "✅ UserApi class loaded successfully\n";
    
    // Test registration with unique data
    $testUsername = 'testuser_' . time();
    $testEmail = 'test_' . time() . '@example.com';
    
    echo "\n--- Testing Registration ---\n";
    $_POST = [
        'action' => 'register',
        'username' => $testUsername,
        'email' => $testEmail,
        'password' => 'TestPassword123',
        'first_name' => 'Test',
        'last_name' => 'User'
    ];
    
    // Capture output
    ob_start();
    $userApi->signUp();
    $regOutput = ob_get_clean();
    
    echo "Registration response: " . $regOutput . "\n";
    
    // Test login
    echo "\n--- Testing Login ---\n";
    $_POST = [
        'action' => 'login',
        'username' => $testUsername,
        'password' => 'TestPassword123'
    ];
    
    ob_start();
    $userApi->login();
    $loginOutput = ob_get_clean();
    
    echo "Login response: " . $loginOutput . "\n";
    
    // Cleanup - delete test user
    echo "\n--- Cleanup ---\n";
    $stmt = $conn->prepare("DELETE FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$testUsername, $testEmail]);
    echo "✅ Test user cleaned up\n";
    
} catch (Exception $e) {
    echo "❌ Authentication API error: " . $e->getMessage() . "\n";
}

echo "\n🏁 Test completed!\n";
?>
