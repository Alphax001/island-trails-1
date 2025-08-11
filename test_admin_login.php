<?php
// Test admin login
require_once 'src/database/connection.php';

$email = 'admin@islandtrails.com';
$password = 'admin123';

echo "=== Testing Admin Login ===\n";
echo "Email: " . $email . "\n";
echo "Password: " . $password . "\n\n";

// Check user in database
$conn = DatabaseConnection::getConnection();
$sql = "SELECT id, name, email, password, role FROM users WHERE email = :email";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo "✅ User found in database:\n";
    echo "ID: " . $user['id'] . "\n";
    echo "Name: " . $user['name'] . "\n";
    echo "Email: " . $user['email'] . "\n";
    echo "Role: " . $user['role'] . "\n";
    echo "Password Hash: " . substr($user['password'], 0, 20) . "...\n\n";
    
    // Test password verification
    echo "=== Testing Password Verification ===\n";
    if (password_verify($password, $user['password'])) {
        echo "✅ Password verification PASSED\n";
    } else {
        echo "❌ Password verification FAILED\n";
        echo "Trying to create new password hash...\n";
        
        // Create new hash
        $newHash = password_hash($password, PASSWORD_DEFAULT);
        echo "New hash: " . substr($newHash, 0, 20) . "...\n";
        
        // Update the password
        $updateSql = "UPDATE users SET password = :password WHERE email = :email";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bindParam(':password', $newHash);
        $updateStmt->bindParam(':email', $email);
        
        if ($updateStmt->execute()) {
            echo "✅ Password updated in database\n";
        } else {
            echo "❌ Failed to update password\n";
        }
    }
} else {
    echo "❌ User not found in database\n";
}

echo "\n=== Testing Login API ===\n";

// Test via API
$loginData = json_encode([
    'action' => 'login',
    'email' => $email,
    'password' => $password
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/WAD/island-trails/src/api/auth/userApi.php');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
echo "API Response: " . $response . "\n";

$responseData = json_decode($response, true);
if ($responseData) {
    if ($responseData['status'] === 'success') {
        echo "✅ Login API SUCCESS\n";
    } else {
        echo "❌ Login API FAILED: " . $responseData['message'] . "\n";
    }
}
?>
