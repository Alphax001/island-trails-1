<?php
require_once 'src/database/connection.php';

echo "📦 AVAILABLE PACKAGES\n";
echo str_repeat("=", 40) . "\n";

try {
    $conn = DatabaseConnection::getConnection();
    $stmt = $conn->query("SELECT * FROM packages ORDER BY id");
    $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($packages) > 0) {
        foreach ($packages as $pkg) {
            echo "ID: {$pkg['id']}\n";
            echo "Title: {$pkg['title']}\n";
            echo "Location: {$pkg['location']}\n";
            echo "Price: \${$pkg['price']}\n";
            echo "Duration: {$pkg['duration']}\n";
            echo "Description: " . substr($pkg['description'], 0, 100) . "...\n";
            echo "Image: {$pkg['image_url']}\n";
            echo str_repeat("-", 40) . "\n";
        }
    } else {
        echo "No packages found in database.\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
