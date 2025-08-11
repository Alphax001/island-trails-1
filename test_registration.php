<?php
// Quick test to see what the registration API actually returns
header('Content-Type: application/json');

$testData = [
    'action' => 'register',
    'name' => 'Test User',
    'email' => 'test_' . time() . '@example.com',
    'password' => 'TestPassword123'
];

echo "Testing registration API call:\n";
echo "Request data: " . json_encode($testData) . "\n\n";

// Call the API directly
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/WAD/island-trails/src/api/auth/userApi.php');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";

// Cleanup test user
try {
    require_once 'src/database/connection.php';
    $conn = DatabaseConnection::getConnection();
    $stmt = $conn->prepare("DELETE FROM users WHERE email = ?");
    $stmt->execute(['test@example.com']);
    echo "\nTest user cleaned up.\n";
} catch (Exception $e) {
    echo "\nCleanup error: " . $e->getMessage() . "\n";
}
?>
