<?php
// Debug authentication flow
require_once 'vendor/autoload.php';
require_once 'src/utils/JwtHandler.php';

echo "🔍 JWT Debug Test\n\n";

// Test the specific token
$token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc2xhbmQtdHJhaWxzX2lzc3VlciIsImF1ZCI6amlzbGFuZC10cmFpbHNfYXVkaWVuY2UiLCJpYXQiOjE3NTQ2NzQzMzQsImV4cCI6MTc1NDc2MDczNCwiZGF0YSI6eyJpZCI6NywidXNlcm5hbWUiOiJUZXN0IFVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiY3VzdG9tZXIifX0.LDm5qcx8sHHs1BULxej8T2M2G228rW8OwRf8FEovyxI";

echo "Testing JWT decode:\n";
try {
    $decoded = JwtHandler::decodeToken($token);
    echo "✅ Token decoded successfully:\n";
    print_r($decoded);
} catch (Exception $e) {
    echo "❌ Token decode error: " . $e->getMessage() . "\n";
}

echo "\nTesting header extraction:\n";

// Simulate different header scenarios
$_SERVER['HTTP_AUTHORIZATION'] = "Bearer $token";
echo "HTTP_AUTHORIZATION set\n";

try {
    $extracted = JwtHandler::getTokenFromHeader();
    echo "✅ Token extracted:\n";
    print_r($extracted);
} catch (Exception $e) {
    echo "❌ Header extraction error: " . $e->getMessage() . "\n";
}
?>
