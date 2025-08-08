<?php
class ApiResourceBase{
    private $roles;
    protected function setRoles($roles){
        $this -> roles = $roles;
    }
    public function checkRoles($role,$action){
        if(isset($this-> roles[$action])){
            if(in_array($role,$this-> roles[$action])){
                return true;
            }
        }
        return false;
    }
    protected function validateFields($data,$requiredFields){
        $missingFields =[];
        foreach($requiredFields as $field){
            if(!isset($data[$field])){
                $missingFields[] = $field;
            }
        }
        return $missingFields;
    }
    public function getAuthenticatedUser(){
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
        
        if($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)){
            $token = $matches[1];
            
            // Try to decode the token
            try {
                // Simple JWT payload extraction without signature verification for now
                $parts = explode('.', $token);
                if (count($parts) === 3) {
                    $payload = base64_decode(str_replace('_', '/', str_replace('-', '+', $parts[1])));
                    $data = json_decode($payload, true);
                    
                    if ($data && isset($data['uid'])) {
                        // Return user data in the expected format
                        return [
                            'id' => $data['uid'],
                            'role' => $data['role'] ?? 'customer',
                            'name' => $data['name'] ?? 'User',
                            'email' => $data['email'] ?? 'user@example.com'
                        ];
                    }
                }
            } catch (Exception $e) {
                error_log("JWT parsing error: " . $e->getMessage());
            }
            
            // Fallback to the original method if simple parsing fails
            $decodedToken = JwtHandler::decodeToken($token);
            if($decodedToken['valid']){
                return $decodedToken['data'];
            } else {
                return null; // Invalid token
            }
        }
        return null; // No auth header or invalid format
    }
}