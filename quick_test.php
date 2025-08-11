<?php
echo "🧪 Testing Registration Fix\n";
echo str_repeat("=", 30) . "\n";

$data = [
    'action' => 'register',
    'name' => 'Test Fix User',
    'email' => 'fix_test_' . time() . '@example.com',
    'password' => 'TestPassword123'
];

echo "Testing with data:\n";
echo "Name: " . $data['name'] . "\n";
echo "Email: " . $data['email'] . "\n\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/WAD/island-trails/src/api/auth/userApi.php');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n\n";

if ($httpCode === 200) {
    $result = json_decode($response, true);
    if ($result && $result['status'] === 'success') {
        echo "✅ Registration fix working! Frontend should now work.\n";
    } else {
        echo "❌ Registration still failing: " . ($result['message'] ?? 'Unknown error') . "\n";
    }
} else {
    echo "❌ HTTP error: $httpCode\n";
}
?>
