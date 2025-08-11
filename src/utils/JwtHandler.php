<?php 
require_once __DIR__ . '/../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHandler{
    private static $secretKey = "island-trails";
    private static $issuer = "island-trails_issuer";
    private static $audience =  "island-trails_audience";
    private static $issueAt;
    private static $expire;

    public static function generateToken($user){
        self::$issueAt = time();
        self::$expire = self::$issueAt + (60 * 60 * 24); // Token valid for 24 hours
        $payLoad = [
            "iss" => self::$issuer,
            "aud" => self::$audience,
            "iat" => self::$issueAt,
            "exp"=> self::$expire,
            "uid" => $user['id'] ?? null,
            "role" => $user['role'] ?? null,
        ];
        return JWT::encode($payLoad, self::$secretKey, 'HS256');

    }    public static function decodeToken($token){
        try{
            $decoded = JWT::decode($token, new Key(self::$secretKey, 'HS256'));
            return [
                'valid' => true,
                'data' => (array)$decoded,
            ];
        }catch(Exception $ex){
            return[
                'valid'=> false,
                'data'=> $ex->getMessage(),
            ];
        }
    }
    
    /**
     * Extract and validate JWT token from Authorization header
     * 
     * @return array Token data or error information
     */
    public static function getTokenFromHeader() {
        // Try multiple methods to get Authorization header
        $authHeader = '';
        
        // Method 1: getallheaders() if available
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
            $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : 
                         (isset($headers['authorization']) ? $headers['authorization'] : '');
        }
        
        // Method 2: $_SERVER fallback
        if (!$authHeader) {
            $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : 
                         (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION']) ? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] : '');
        }
        
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            return self::decodeToken($token);
        }
        
        return [
            'valid' => false,
            'data' => 'No token found in Authorization header'
        ];
    }
}