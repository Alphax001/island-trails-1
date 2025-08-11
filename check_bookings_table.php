<?php
require_once 'src/database/connection.php';

echo "📋 BOOKINGS TABLE ANALYSIS\n";
echo str_repeat("=", 30) . "\n";

try {
    $conn = DatabaseConnection::getConnection();
    
    // Check table structure
    $stmt = $conn->query("DESCRIBE bookings");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Current structure:\n";
    foreach ($columns as $col) {
        echo "  {$col['Field']}: {$col['Type']}\n";
    }
    
    // Check if we need to add missing fields
    $requiredFields = [
        'number_of_people' => 'INT DEFAULT 1',
        'special_requests' => 'TEXT',
        'total_price' => 'DECIMAL(10,2)'
    ];
    
    $existingFields = array_column($columns, 'Field');
    $missingFields = [];
    
    foreach ($requiredFields as $field => $definition) {
        if (!in_array($field, $existingFields)) {
            $missingFields[] = $field;
        }
    }
    
    if (count($missingFields) > 0) {
        echo "\nMissing fields for booking functionality:\n";
        foreach ($missingFields as $field) {
            echo "  - $field\n";
        }
        
        echo "\nAdding missing fields...\n";
        foreach ($missingFields as $field) {
            $sql = "ALTER TABLE bookings ADD COLUMN $field {$requiredFields[$field]}";
            $conn->exec($sql);
            echo "  ✅ Added $field\n";
        }
    } else {
        echo "\n✅ All required fields present\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
