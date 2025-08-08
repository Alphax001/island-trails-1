<?php
// Create a test user for booking functionality
require_once 'src/database/connection.php';
require_once 'src/classes/Model.php';
require_once 'src/classes/User.php';

try {
    echo "🧪 Creating test user for booking functionality...\n\n";
    
    // Create test user credentials
    $testUserData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'test123', // Will be hashed
        'role' => 'customer'
    ];
    
    // Check if user already exists
    $user = new User();
    if ($user->emailExists($testUserData['email'])) {
        echo "✅ Test user already exists:\n";
        echo "   Email: {$testUserData['email']}\n";
        echo "   Password: {$testUserData['password']}\n";
        echo "   Role: customer\n\n";
        exit(0);
    }
    
    // Create new user
    $user = new User(
        null,
        $testUserData['name'],
        $testUserData['email'],
        $testUserData['password'], // Will be hashed in the create method
        $testUserData['role']
    );
    
    $success = $user->create();
    
    if ($success) {
        echo "✅ Test user created successfully!\n\n";
        echo "📋 Test User Credentials:\n";
        echo "   Name: {$testUserData['name']}\n";
        echo "   Email: {$testUserData['email']}\n";
        echo "   Password: {$testUserData['password']}\n";
        echo "   Role: {$testUserData['role']}\n\n";
        
        echo "🎯 How to use:\n";
        echo "1. Go to the website\n";
        echo "2. Click 'Login' in the top navigation\n";
        echo "3. Use the credentials above\n";
        echo "4. Browse packages and click 'Book Now'\n";
        echo "5. Select a travel date and confirm booking\n\n";
        
        echo "📝 Note: You can also use the admin account:\n";
        echo "   Email: admin@example.com\n";
        echo "   Password: admin123\n";
        echo "   Role: admin\n\n";
        
    } else {
        echo "❌ Failed to create test user\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
