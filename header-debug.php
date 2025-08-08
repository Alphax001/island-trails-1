<?php
echo "🔍 Header Debug Test\n\n";

// Check if getallheaders exists
if (function_exists('getallheaders')) {
    echo "✅ getallheaders() function exists\n";
    $headers = getallheaders();
    echo "Headers received:\n";
    print_r($headers);
} else {
    echo "❌ getallheaders() function NOT available\n";
    echo "Available headers from \$_SERVER:\n";
    
    foreach ($_SERVER as $key => $value) {
        if (strpos($key, 'HTTP_') === 0) {
            echo "$key: $value\n";
        }
    }
}

// Test JWT handler
echo "\n🔍 JWT Handler Test\n";
require_once 'src/utils/imports.php';

// Test with a sample token (you'll need to get a real one)
echo "JwtHandler class loaded\n";

// Test token extraction method
echo "\n🔍 Testing JwtHandler::getTokenFromHeader()\n";
$tokenResult = JwtHandler::getTokenFromHeader();
echo "Token result: \n";
print_r($tokenResult);
?>
