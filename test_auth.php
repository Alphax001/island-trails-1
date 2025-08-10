<?php
require_once 'vendor/autoload.php';
require_once 'src/utils/JwtHandler.php';

// Simulate the Authorization header
$_SERVER['HTTP_AUTHORIZATION'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc2xhbmQtdHJhaWxzX2lzc3VlciIsImF1ZCI6ImlzbGFuZC10cmFpbHNfYXVkaWVuY2UiLCJpYXQiOjE3NTQ2ODY0MDEsImV4cCI6MTc1NDY5MDAwMSwidWlkIjo3LCJyb2xlIjoiY3VzdG9tZXIifQ.bEHTa7zNEpPWQzwvjyq7gT9N0c5hqkwJy4fNKr8-jQw';

$tokenResult = JwtHandler::getTokenFromHeader();
echo "Token validation result:\n";
print_r($tokenResult);

if ($tokenResult['valid']) {
    echo "\nRole from token: ";
    echo isset($tokenResult['data']['role']) ? $tokenResult['data']['role'] : 'NOT FOUND';
}
?>
