<?php
// Cleanup Test User
header('Content-Type: text/plain');

echo "=== CLEANING UP TEST USER ===\n\n";

// Include necessary files
require_once 'src/utils/imports.php';

// Check if test user ID file exists
if (file_exists('temp_test_user_id.txt')) {
    $testUserId = file_get_contents('temp_test_user_id.txt');
    echo "Found test user ID: " . $testUserId . "\n";
    
    try {
        // Delete test user from database
        $conn = DatabaseConnection::getConnection();
        $sql = "DELETE FROM users WHERE id = :user_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':user_id', $testUserId);
        
        if ($stmt->execute()) {
            echo "✅ Test user deleted successfully from database\n";
        } else {
            echo "❌ Failed to delete test user from database\n";
        }
        
        // Remove temporary file
        unlink('temp_test_user_id.txt');
        echo "✅ Temporary file removed\n";
        
    } catch (Exception $e) {
        echo "❌ Exception during cleanup: " . $e->getMessage() . "\n";
    }
    
} else {
    echo "No test user ID file found - nothing to clean up\n";
}

echo "\n=== CLEANUP COMPLETE ===\n";
?>
