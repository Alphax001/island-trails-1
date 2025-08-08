<?php
// Debug the router parsing
echo "🔍 Router Debug Test\n\n";

// Simulate different URL patterns
$testUrls = [
    '/WAD/island-trails/api/bookings/booking/readUserBookings',
    '/api/bookings/booking/readUserBookings',
    'api/bookings/booking/readUserBookings'
];

foreach ($testUrls as $url) {
    echo "Testing URL: $url\n";
    
    // Parse URL like the router does
    $urlParts = explode('/', $url);
    $urlParts = array_values(array_filter($urlParts));
    
    echo "URL parts: " . json_encode($urlParts) . "\n";
    
    // Find API index
    $apiIndex = array_search('api', $urlParts);
    
    if ($apiIndex !== false) {
        $group = isset($urlParts[$apiIndex + 1]) ? $urlParts[$apiIndex + 1] : null;
        $resource = isset($urlParts[$apiIndex + 2]) ? $urlParts[$apiIndex + 2] : null;
        $action = isset($urlParts[$apiIndex + 3]) ? $urlParts[$apiIndex + 3] : null;
        
        echo "Group: $group\n";
        echo "Resource: $resource\n";
        echo "Action: $action\n";
        
        $scriptPath = 'src/api/' . $group . '/' . $resource . 'Api.php';
        echo "Expected script path: $scriptPath\n";
        echo "File exists: " . (file_exists($scriptPath) ? 'YES' : 'NO') . "\n";
    } else {
        echo "API not found in URL\n";
    }
    
    echo "---\n";
}

// Test the actual current request
echo "\nCurrent request analysis:\n";
echo "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "\n";
echo "SCRIPT_NAME: " . $_SERVER['SCRIPT_NAME'] . "\n";

// Check if bookingApi.php file exists and what methods it has
$bookingApiPath = 'src/api/bookings/bookingApi.php';
if (file_exists($bookingApiPath)) {
    echo "\nBookingApi file exists!\n";
    require_once 'src/utils/imports.php';
    
    $bookingApi = new BookingApi();
    echo "BookingApi class loaded successfully\n";
    
    if (method_exists($bookingApi, 'readUserBookings')) {
        echo "readUserBookings method exists\n";
    } else {
        echo "readUserBookings method NOT found\n";
    }
} else {
    echo "\nBookingApi file NOT found at: $bookingApiPath\n";
}
?>
