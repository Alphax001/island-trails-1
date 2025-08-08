<?php
// Direct test of booking API
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "🔍 Direct Booking API Test\n\n";

// Test different users
$testUsers = [
    ['email' => 'test@example.com', 'password' => 'password123'],
    ['email' => 'ashen@gmail.com', 'password' => 'password123'],
    ['email' => 'admin@example.com', 'password' => 'admin123']
];

foreach ($testUsers as $user) {
    echo "=== Testing with {$user['email']} ===\n";
    
    // First login
    $loginData = json_encode($user);
    $loginUrl = 'http://localhost/WAD/island-trails/src/api/auth/userApi.php?action=login';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $loginUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($loginData)
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $loginResponse = curl_exec($ch);
    curl_close($ch);
    
    $loginResult = json_decode($loginResponse, true);
    
    if ($loginResult['success'] ?? false) {
        $token = $loginResult['token'];
        echo "✅ Login successful\n";
        echo "User ID: {$loginResult['user']['id']}\n";
        echo "User Name: {$loginResult['user']['name']}\n";
        
        // Now test getting bookings
        $bookingUrl = 'http://localhost/WAD/island-trails/src/api/bookings/bookingApi.php?action=getUserBookings';
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $bookingUrl);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token,
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $bookingResponse = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "HTTP Status: {$httpCode}\n";
        echo "Booking API Response: {$bookingResponse}\n";
        
        $bookingResult = json_decode($bookingResponse, true);
        if ($bookingResult) {
            if ($bookingResult['status'] === 'success') {
                $bookings = $bookingResult['data'] ?? [];
                echo "✅ Found " . count($bookings) . " booking(s)\n";
                foreach ($bookings as $booking) {
                    echo "  - Booking #{$booking['id']}: {$booking['package_title']} (Status: {$booking['status']})\n";
                }
            } else {
                echo "❌ API Error: {$bookingResult['message']}\n";
            }
        } else {
            echo "❌ Invalid JSON response\n";
        }
        
        // Test with details
        echo "\n--- Testing with details ---\n";
        $detailsUrl = 'http://localhost/WAD/island-trails/src/api/bookings/bookingApi.php?action=getUserBookingsWithDetails';
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $detailsUrl);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token,
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $detailsResponse = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        echo "HTTP Status: {$httpCode}\n";
        $detailsResult = json_decode($detailsResponse, true);
        if ($detailsResult) {
            if ($detailsResult['status'] === 'success') {
                echo "✅ Details API working\n";
                echo "User Info: " . json_encode($detailsResult['user_info']) . "\n";
                echo "Bookings: " . count($detailsResult['data']) . "\n";
            } else {
                echo "❌ Details API Error: {$detailsResult['message']}\n";
            }
        }
        
    } else {
        echo "❌ Login failed: " . ($loginResult['message'] ?? 'Unknown error') . "\n";
    }
    
    echo "\n" . str_repeat('-', 50) . "\n\n";
}
?>
