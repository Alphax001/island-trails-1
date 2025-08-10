<?php
$token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc2xhbmQtdHJhaWxzX2lzc3VlciIsImF1ZCI6ImlzbGFuZC10cmFpbHNfYXVkaWVuY2UiLCJpYXQiOjE3NTQ2ODY0MDEsImV4cCI6MTc1NDY5MDAwMSwidWlkIjo3LCJyb2xlIjoiY3VzdG9tZXIifQ.bEHTa7zNEpPWQzwvjyq7gT9N0c5hqkwJy4fNKr8-jQw";

// Split token into parts
$parts = explode('.', $token);
if (count($parts) == 3) {
    // Decode payload (second part)
    $payload = base64_decode(str_replace('_', '/', str_replace('-', '+', $parts[1])));
    echo "JWT Payload:\n";
    echo $payload . "\n";
    
    // Parse as JSON
    $data = json_decode($payload, true);
    echo "\nParsed data:\n";
    print_r($data);
}
?>
