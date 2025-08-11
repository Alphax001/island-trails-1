<?php
require_once __DIR__ . '/../../utils/ApiResourceBase.php';
require_once __DIR__ . '/../../utils/JwtHandler.php';
require_once __DIR__ . '/../../classes/Model.php';
require_once __DIR__ . '/../../classes/User.php';
require_once __DIR__ . '/../../database/connection.php';

class UserApi extends ApiResourceBase{
   public function __construct(){
    $this -> setRoles([
        "create" => ["admin", "user"],
        "login" => ["customer", "admin", null],
        "profile" => ["customer", "admin"],
    ]);
   }

   
   public function checkRoles($role, $action) {
       if ($action === 'signUp') {
           return true; 
       }
       if ($action === 'profile') {
           // For profile, just check if we have any authentication (regardless of role)
           $authUser = $this->getAuthenticatedUser();
           return $authUser !== null;
       }
       return parent::checkRoles($role, $action);
   }

   public function signUp($data){
        $user = new User();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = $data['password'];
        $user->role = 'customer'; 

        if ($user->create()) {
            return ['status' => 'success', 'message' => 'User created successfully.'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to create user.'];
        }
   }
   
   public function login($data){
     if (!isset($data['email'])) {
        return [ "status" => "error", "message" => "Email is required" ];
    }
    if (!isset($data['password'])) {
        return [ "status" => "error", "message" => "Password is required" ];
    }
    $conn = DatabaseConnection::getConnection();
    $sql = "SELECT * FROM users WHERE email = :email";
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':email', $data['email']);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        if (password_verify($data['password'], $result['password'])) {
            
            $result['password'] = "";
            
            
            $token = JwtHandler::generateToken($result);

            return [
                "status" => "success",
                "message" => "Login successful",
                "token" => $token,
                "user" => $result
            ];
        } else {
            return [
                "status" => "error",
                "message" => "Invalid password"
            ];
        }
    } else {
        return [
            "status" => "error",
            "message" => "User not found"
        ];
    }

   }

   public function profile($data){
        // Get the authenticated user from JWT token
        $authenticatedUser = $this->getAuthenticatedUser();
        if (!$authenticatedUser) {
            return [
                "status" => "error",
                "message" => "Authentication required"
            ];
        }
        
        $conn = DatabaseConnection::getConnection();
        $sql = "SELECT id, name, email, role FROM users WHERE id = :user_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':user_id', $authenticatedUser['id']);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            return [
                "status" => "success",
                "message" => "User profile retrieved successfully",
                "user" => $user
            ];
        } else {
            return [
                "status" => "error",
                "message" => "User not found"
            ];
        }
   }

    
}

// Handle direct HTTP requests when file is accessed directly
if (basename($_SERVER['PHP_SELF']) === 'userApi.php') {
    header('Content-Type: application/json');
    
    try {
        $userApi = new UserApi();
        
        // Get request data
        $method = $_SERVER['REQUEST_METHOD'];
        $data = [];
        
        if ($method === 'GET') {
            $data = $_GET;
        } else {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            if ($data === null) {
                $data = $_POST;
            }
        }
        
        // Determine action
        $action = isset($data['action']) ? $data['action'] : '';
        
        switch ($action) {
            case 'register':
                $response = $userApi->signUp($data);
                break;
            case 'login':
                $response = $userApi->login($data);
                break;
            case 'profile':
                $response = $userApi->profile($data);
                break;
            default:
                $response = [
                    'status' => 'error',
                    'message' => 'Invalid action. Supported actions: register, login, profile'
                ];
        }
        
        echo json_encode($response);
        
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Server error: ' . $e->getMessage()
        ]);
    }
}