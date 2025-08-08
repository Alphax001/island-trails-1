<?php
require_once 'src/database/connection.php';

$conn = DatabaseConnection::getConnection();
$stmt = $conn->prepare('SELECT email, password FROM users WHERE email = ?');
$stmt->execute(['ashen@gmail.com']);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo "Email: " . $user['email'] . "\n";
    echo "Password hash: " . $user['password'] . "\n";
    
    // Test different passwords
    $testPasswords = ['password123', 'ashen123', '123456', 'ashen'];
    foreach ($testPasswords as $pass) {
        if (password_verify($pass, $user['password'])) {
            echo "✅ Correct password: $pass\n";
        }
    }
} else {
    echo "User not found\n";
}
?>
