<?php

class Router
{
    private $resource = null;
    private $action = null;
    private $group = null;
    private $method = null;
    private $authRole = null;
    private $data = [];

    public function __construct()
    {
        $this->parseURL();
        $this->authRole = $this->parseAuth(); // Changed from hardcoded admin
        $this->method = $_SERVER['REQUEST_METHOD'];
        if ($this->method === 'GET') {
            $this->data = $_GET;
        } else {
            $this->data = json_decode(file_get_contents('php://input'), true);
        }
    }

    private function parseURL()
    {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $url = explode('/', $path);
        
        // Remove empty elements and reindex array
        $url = array_values(array_filter($url));
        
        // For path like /WAD/island-trails/api/auth/user/signUp
        // Find the 'api' position and parse from there
        $apiIndex = array_search('api', $url);
        
        if ($apiIndex !== false) {
            $this->group = isset($url[$apiIndex + 1]) ? $url[$apiIndex + 1] : null;     // 'auth'
            $this->resource = isset($url[$apiIndex + 2]) ? $url[$apiIndex + 2] : null;  // 'user'
            $this->action = isset($url[$apiIndex + 3]) ? $url[$apiIndex + 3] : null;    // 'signUp'
        } else {
            // Fallback to original parsing if 'api' not found
            $this->group = isset($url[2]) ? $url[2] : null;
            $this->resource = isset($url[3]) ? $url[3] : null;
            $this->action = isset($url[4]) ? $url[4] : null;
        }
    }

    private function parseSession()
    {
        if (isset($_SESSION['role'])) {
            return $_SESSION['role'];
        } else {
            return null;
        }
    }

    private function parseAuth()
    {
        // First check session
        if (isset($_SESSION['role'])) {
            return $_SESSION['role'];
        }
        
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
            
            // Try to decode the token using simple parsing
            try {
                $parts = explode('.', $token);
                if (count($parts) === 3) {
                    $payload = base64_decode(str_replace('_', '/', str_replace('-', '+', $parts[1])));
                    $data = json_decode($payload, true);
                    
                    if ($data && isset($data['role'])) {
                        error_log("DEBUG: Simple JWT parsing successful, role: " . $data['role']);
                        return $data['role'];
                    }
                }
            } catch (Exception $e) {
                error_log("JWT parsing error: " . $e->getMessage());
            }
            
            // Fallback to JwtHandler if simple parsing fails
            require_once 'src/utils/JwtHandler.php';
            $tokenResult = JwtHandler::getTokenFromHeader();
            
            if ($tokenResult['valid'] && isset($tokenResult['data']['role'])) {
                error_log("DEBUG: JwtHandler parsing successful, role: " . $tokenResult['data']['role']);
                return $tokenResult['data']['role'];
            }
        }
        
        error_log("DEBUG: No valid auth found");
        return null; // No valid auth found
    }

    public function runScript()
    {
        $path = $this->getScriptPath();
        header('Content-Type: application/json');
        if (file_exists($path)) {
            $this->runExistingScript($path);
        } else {
            $this->sendNotFoundResponse($path);
        }

        $this->sanitizeData($this->data);
    }

    private function getScriptPath()
    {
        return 'src/api/' . $this->group . '/' . $this->resource . 'Api.php';
    }

    private function runExistingScript($path)
    {
//        require_once($path);
        $className = ucfirst($this->resource).'Api';
        $class = new $className();
        if (method_exists($class, 'checkRoles')) {
            $this->handleRoleCheck($class);
        } else {
            $this->sendUnauthorizedResponse();
        }
    }

    private function handleRoleCheck($class)
    {
        try{
            if (!$class->checkRoles($this->authRole, $this->action)) {
                $this->sendForbiddenResponse();
            } else {
                $response = $class->{$this->action}($this->data);
                echo json_encode($response);
            }
        } catch (Exception $e) {
            echo json_encode([
                'message' => $e->getMessage(),
                'status' => 'error'
            ]);
        }
    }

    private function sendForbiddenResponse()
    {
        http_response_code(403);
        echo json_encode([
            'message' => 'Forbidden',
            'role' => $this->authRole,
            'action' => $this->action
        ]);
    }

    private function sendUnauthorizedResponse()
    {
        http_response_code(401);
        echo json_encode([
            'message' => 'Unauthorized',
            'role' => $this->authRole
        ]);
    }

    private function sendNotFoundResponse($msg)
    {
        http_response_code(404);
        echo json_encode([
            'message' => 'Resource not found',
            'data' => $msg
        ]);
    }

    private function sanitizeData($data)
        {
            foreach ($data as $key => $value) {
                if (is_array($value)) {
                    $data[$key] =$value;
                } else {
                    $data[$key] = htmlspecialchars(strip_tags($value));
                }
            }
            $this->data=  $data;
        }
}
