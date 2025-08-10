<?php
class DatabaseConnection {
    private static $conn;

    public static function getConnection(){
        if (self::$conn == null){
            try {
                // Local XAMPP MySQL configuration
                $host = "localhost";
                $dbname = "island_trails";
                $port = "3306";
                $username = "root";
                $password = ""; // Default XAMPP MySQL password is empty

                $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ];

                self::$conn = new PDO($dsn, $username, $password, $options);

            } catch(PDOException $e){
                die("Connection failed: " . $e->getMessage());
            }
        }
        return self::$conn;
    }
}
?>