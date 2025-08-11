<?php
echo "🔍 Island Trails - Backend & Database Connection Check\n";
echo "=" . str_repeat("=", 50) . "\n\n";

// Test 1: Check if database connection works
echo "1. DATABASE CONNECTION TEST\n";
echo "-" . str_repeat("-", 30) . "\n";

try {
    require_once 'src/database/connection.php';
    $conn = DatabaseConnection::getConnection();
    
    if ($conn) {
        echo "✅ Database connection: SUCCESS\n";
        echo "   - Host: localhost\n";
        echo "   - Database: island_trails\n";
        echo "   - Connection type: PDO MySQL\n";
        
        // Test database exists
        $stmt = $conn->query("SELECT DATABASE() as db_name");
        $dbName = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "   - Connected to: " . $dbName['db_name'] . "\n";
        
    } else {
        echo "❌ Database connection: FAILED\n";
    }
} catch (Exception $e) {
    echo "❌ Database connection error: " . $e->getMessage() . "\n";
}

// Test 2: Check users table structure
echo "\n2. USERS TABLE CHECK\n";
echo "-" . str_repeat("-", 30) . "\n";

try {
    // Check if users table exists
    $stmt = $conn->prepare("SHOW TABLES LIKE 'users'");
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo "✅ Users table: EXISTS\n";
        
        // Get table structure
        $stmt = $conn->query("DESCRIBE users");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "   Table structure:\n";
        foreach ($columns as $column) {
            echo "   - {$column['Field']}: {$column['Type']} " . 
                 ($column['Null'] === 'NO' ? '[NOT NULL]' : '[NULL]') . 
                 ($column['Key'] === 'PRI' ? ' [PRIMARY KEY]' : '') . "\n";
        }
        
        // Count existing users
        $stmt = $conn->query("SELECT COUNT(*) as user_count FROM users");
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "   - Total users in database: " . $count['user_count'] . "\n";
        
    } else {
        echo "❌ Users table: NOT FOUND\n";
        echo "   Creating users table...\n";
        
        $createTable = "
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('customer', 'admin') DEFAULT 'customer',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
        
        $conn->exec($createTable);
        echo "✅ Users table created successfully\n";
    }
} catch (Exception $e) {
    echo "❌ Users table error: " . $e->getMessage() . "\n";
}

// Test 3: Check authentication API files
echo "\n3. AUTHENTICATION API CHECK\n";
echo "-" . str_repeat("-", 30) . "\n";

$apiFiles = [
    'UserApi' => 'src/api/auth/userApi.php',
    'ApiResourceBase' => 'src/utils/ApiResourceBase.php',
    'JwtHandler' => 'src/utils/JwtHandler.php',
    'User Model' => 'src/classes/User.php',
    'Database Connection' => 'src/database/connection.php'
];

foreach ($apiFiles as $name => $path) {
    if (file_exists($path)) {
        echo "✅ $name: EXISTS ($path)\n";
    } else {
        echo "❌ $name: MISSING ($path)\n";
    }
}

// Test 4: Check JWT library
echo "\n4. JWT LIBRARY CHECK\n";
echo "-" . str_repeat("-", 30) . "\n";

try {
    require_once 'vendor/autoload.php';
    
    if (class_exists('Firebase\JWT\JWT')) {
        echo "✅ Firebase JWT library: AVAILABLE\n";
        
        // Test JWT generation
        require_once 'src/utils/JwtHandler.php';
        $testUser = ['id' => 999, 'role' => 'customer', 'email' => 'test@example.com'];
        $token = JwtHandler::generateToken($testUser);
        
        if ($token) {
            echo "✅ JWT token generation: WORKING\n";
            echo "   Sample token: " . substr($token, 0, 50) . "...\n";
            
            // Test JWT decoding
            $decoded = JwtHandler::decodeToken($token);
            if ($decoded['valid']) {
                echo "✅ JWT token validation: WORKING\n";
            } else {
                echo "❌ JWT token validation: FAILED\n";
            }
        } else {
            echo "❌ JWT token generation: FAILED\n";
        }
    } else {
        echo "❌ Firebase JWT library: NOT AVAILABLE\n";
    }
} catch (Exception $e) {
    echo "❌ JWT library error: " . $e->getMessage() . "\n";
}

// Test 5: Test registration endpoint
echo "\n5. REGISTRATION ENDPOINT TEST\n";
echo "-" . str_repeat("-", 30) . "\n";

try {
    require_once 'src/api/auth/userApi.php';
    $userApi = new UserApi();
    
    echo "✅ UserApi class: LOADED\n";
    
    // Test with unique data
    $testData = [
        'name' => 'Test User Backend',
        'email' => 'backend_test_' . time() . '@example.com',
        'password' => 'TestPassword123'
    ];
    
    echo "   Testing registration with: " . $testData['email'] . "\n";
    
    $result = $userApi->signUp($testData);
    
    if ($result['status'] === 'success') {
        echo "✅ Registration endpoint: WORKING\n";
        
        // Test login
        $loginData = [
            'email' => $testData['email'],
            'password' => $testData['password']
        ];
        
        $loginResult = $userApi->login($loginData);
        
        if ($loginResult['status'] === 'success') {
            echo "✅ Login endpoint: WORKING\n";
            echo "   - Token generated: YES\n";
            echo "   - User data returned: YES\n";
        } else {
            echo "❌ Login endpoint: FAILED - " . $loginResult['message'] . "\n";
        }
        
        // Cleanup test user
        $stmt = $conn->prepare("DELETE FROM users WHERE email = ?");
        $stmt->execute([$testData['email']]);
        echo "   Test user cleaned up\n";
        
    } else {
        echo "❌ Registration endpoint: FAILED - " . $result['message'] . "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Registration endpoint error: " . $e->getMessage() . "\n";
}

// Test 6: Test API via HTTP
echo "\n6. HTTP API ENDPOINT TEST\n";
echo "-" . str_repeat("-", 30) . "\n";

$testData = [
    'action' => 'register',
    'name' => 'HTTP Test User',
    'email' => 'http_test_' . time() . '@example.com',
    'password' => 'TestPassword123'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/WAD/island-trails/src/api/auth/userApi.php');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "   HTTP Status Code: $httpCode\n";

if ($httpCode === 200) {
    $data = json_decode($response, true);
    if ($data && $data['status'] === 'success') {
        echo "✅ HTTP Registration endpoint: WORKING\n";
        
        // Test HTTP login
        $loginData = [
            'action' => 'login',
            'email' => $testData['email'],
            'password' => $testData['password']
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://localhost/WAD/island-trails/src/api/auth/userApi.php');
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $loginResponse = curl_exec($ch);
        $loginCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($loginCode === 200) {
            $loginData = json_decode($loginResponse, true);
            if ($loginData && $loginData['status'] === 'success') {
                echo "✅ HTTP Login endpoint: WORKING\n";
            } else {
                echo "❌ HTTP Login endpoint: FAILED\n";
            }
        }
        
        // Cleanup
        $stmt = $conn->prepare("DELETE FROM users WHERE email = ?");
        $stmt->execute([$testData['email']]);
        echo "   HTTP test user cleaned up\n";
        
    } else {
        echo "❌ HTTP Registration endpoint: FAILED\n";
        echo "   Response: $response\n";
    }
} else {
    echo "❌ HTTP endpoint not accessible (Code: $httpCode)\n";
}

echo "\n" . str_repeat("=", 60) . "\n";
echo "🏁 BACKEND CHECK COMPLETE\n";
echo str_repeat("=", 60) . "\n";
?>
