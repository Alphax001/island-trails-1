<?php
require_once 'src/database/connection.php';

echo "🗄️ CHECKING DATABASE STRUCTURE FOR TRAVELLER FUNCTIONALITY\n";
echo str_repeat("=", 60) . "\n\n";

try {
    $conn = DatabaseConnection::getConnection();
    
    // Check all tables
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "📋 Available Tables:\n";
    foreach ($tables as $table) {
        echo "  - $table\n";
    }
    
    echo "\n📊 Table Structures:\n";
    
    // Check each table structure
    foreach ($tables as $table) {
        echo "\n--- $table ---\n";
        $stmt = $conn->query("DESCRIBE $table");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($columns as $column) {
            echo "  {$column['Field']}: {$column['Type']} " . 
                 ($column['Null'] === 'NO' ? '[NOT NULL]' : '[NULL]') . 
                 ($column['Key'] === 'PRI' ? ' [PRIMARY KEY]' : '') . 
                 ($column['Key'] === 'MUL' ? ' [FOREIGN KEY]' : '') . "\n";
        }
        
        // Count records
        $stmt = $conn->query("SELECT COUNT(*) as count FROM $table");
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "  → Records: {$count['count']}\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
