<?php
// Set proper headers for API testing
header('Content-Type: application/json');

echo "🔍 Testing Island Trails Authentication System\n\n";

// Test 1: Database Connection
echo "=== Database Connection Test ===\n";
try {
    require_once 'src/database/connection.php';
    $conn = DatabaseConnection::getConnection();
    
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

echo "\n=== Direct API Testing ===\n";

// Test registration via POST request simulation
$testUsername = 'testuser_' . time();
$testEmail = 'test_' . time() . '@example.com';

echo "Testing with:\n";
echo "Username: $testUsername\n";
echo "Email: $testEmail\n\n";

// Test Registration
echo "--- Testing Registration ---\n";
$postData = json_encode([
    'action' => 'register',
    'name' => 'Test User',
    'email' => $testEmail,
    'password' => 'TestPassword123'
]);

// Simulate POST request to userApi.php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/WAD/island-trails/src/api/auth/userApi.php');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$regResponse = curl_exec($ch);
$regHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Registration HTTP Code: $regHttpCode\n";
echo "Registration Response: $regResponse\n";

// Test Login
echo "\n--- Testing Login ---\n";
$loginData = json_encode([
    'action' => 'login',
    'email' => $testEmail,
    'password' => 'TestPassword123'
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/WAD/island-trails/src/api/auth/userApi.php');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$loginResponse = curl_exec($ch);
$loginHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Login HTTP Code: $loginHttpCode\n";
echo "Login Response: $loginResponse\n";

// Cleanup
echo "\n--- Cleanup ---\n";
try {
    $stmt = $conn->prepare("DELETE FROM users WHERE email = ?");
    $stmt->execute([$testEmail]);
    echo "✅ Test user cleaned up\n";
} catch (Exception $e) {
    echo "⚠️ Cleanup warning: " . $e->getMessage() . "\n";
}

echo "\n🏁 Test completed!\n";
?>
