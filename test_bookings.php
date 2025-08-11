<?php
// Test booking API with proper authentication
require_once 'src/utils/JwtHandler.php';

// Create test user data like the real login would
$testUser = [
    'id' => 9,
    'name' => 'test 2',
    'email' => 'traveller@gmail.com',
    'role' => 'customer'
];

// Generate token using the same method as login
$token = JwtHandler::generateToken($testUser);

echo "=== Testing booking API with authentication ===\n";
echo "Generated token for user: " . $testUser['name'] . "\n";

// Test get_user_bookings with proper auth
$postData = json_encode(['action' => 'get_user_bookings']);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/WAD/island-trails/src/api/bookings/bookingApi.php');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: " . $httpCode . "\n";
echo "Response: " . $response . "\n";

// Try to decode and format the response
$responseData = json_decode($response, true);
if ($responseData) {
    echo "\n=== Formatted Response ===\n";
    print_r($responseData);
} else {
    echo "\n=== JSON Decode Failed ===\n";
    echo "Raw response: " . $response . "\n";
}
?>
