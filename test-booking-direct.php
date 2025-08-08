<?php
// Direct booking API test without router
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

echo "🔍 Direct Booking API Test\n\n";

// Include necessary files
require_once 'src/utils/imports.php';

try {
    // Get auth token from header
    $authHeader = '';
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
    } else {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    }
    
    echo "Auth header: " . substr($authHeader, 0, 50) . "...\n";
    
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = $matches[1];
        echo "Token extracted: " . substr($token, 0, 50) . "...\n";
        
        // Validate token
        $result = JwtHandler::decodeToken($token);
        echo "Token validation: " . json_encode($result) . "\n";
        
        if ($result['valid']) {
            $userId = $result['data']['id'];
            $userRole = $result['data']['role'];
            echo "User ID: $userId, Role: $userRole\n";
            
            // Create booking API instance
            $bookingApi = new BookingApi();
            echo "BookingApi created\n";
            
            // Call readUserBookings
            $bookingsResult = $bookingApi->readUserBookings([]);
            echo "Bookings result: " . json_encode($bookingsResult) . "\n";
            
        } else {
            echo "Invalid token: " . $result['data'] . "\n";
        }
    } else {
        echo "No Bearer token found\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>
