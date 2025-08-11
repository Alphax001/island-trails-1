<?php
// Test Registration Function
header('Content-Type: application/json');

echo "=== TESTING REGISTRATION FUNCTION ===\n";

// Include necessary files
require_once 'src/utils/imports.php';

// Test data
$testUser = [
    'username' => 'testuser_' . time(),
    'email' => 'test_' . time() . '@example.com',
    'password' => 'TestPassword123',
    'first_name' => 'Test',
    'last_name' => 'User'
];

echo "1. Testing User Registration...\n";
echo "Test data: " . json_encode($testUser, JSON_PRETTY_PRINT) . "\n";

try {
    // Create User instance
    $user = new User();
    
    // Test registration
    $result = $user->register(
        $testUser['username'],
        $testUser['email'],
        $testUser['password'],
        $testUser['first_name'],
        $testUser['last_name']
    );
    
    if ($result['success']) {
        echo "✅ Registration successful!\n";
        echo "User ID: " . $result['user']['id'] . "\n";
        echo "Username: " . $result['user']['username'] . "\n";
        echo "Email: " . $result['user']['email'] . "\n";
        
        // Store test user ID for cleanup
        $testUserId = $result['user']['id'];
        file_put_contents('temp_test_user_id.txt', $testUserId);
        
    } else {
        echo "❌ Registration failed: " . $result['message'] . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Exception during registration: " . $e->getMessage() . "\n";
}

echo "\n=== REGISTRATION TEST COMPLETE ===\n";
?>
