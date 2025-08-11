<?php
// Direct API Test
header('Content-Type: application/json');

echo "=== TESTING API ENDPOINTS DIRECTLY ===\n\n";

// Test registration endpoint
$testUser = [
    'action' => 'register',
    'username' => 'testuser_' . time(),
    'email' => 'test_' . time() . '@example.com',
    'password' => 'TestPassword123',
    'first_name' => 'Test',
    'last_name' => 'User'
];

echo "1. Testing Registration API...\n";
echo "POST data: " . json_encode($testUser, JSON_PRETTY_PRINT) . "\n";

// Simulate POST request
$_POST = $testUser;
$_SERVER['REQUEST_METHOD'] = 'POST';

try {
    // Include the userApi file
    require_once 'src/api/auth/userApi.php';
    
    echo "✅ UserApi included successfully\n";
    
} catch (Exception $e) {
    echo "❌ Error including UserApi: " . $e->getMessage() . "\n";
}

echo "\n=== API TEST COMPLETE ===\n";
?>
