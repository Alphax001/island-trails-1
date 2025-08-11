<?php
// Suppress warnings for clean JSON output
error_reporting(E_ERROR | E_PARSE);

require_once __DIR__ . '/../../utils/ApiResourceBase.php';
require_once __DIR__ . '/../../classes/Model.php';
require_once __DIR__ . '/../../classes/Packages.php';
require_once __DIR__ . '/../../database/connection.php';

class PackageApi extends ApiResourceBase {
    public function __construct() {
        $this->setRoles([
            "create" => ["admin"],
            "update" => ["admin"],
            "delete" => ["admin"],
            "read" => ["customer", "admin", null],
            "readAll" => ["customer", "admin", null], // Public access for reading all packages
        ]);
    }

    public function create($data) {
        $user = $this-> getAuthenticatedUser();

        if(!$user){
            return ["status" => "error", "message" => "Invalid Auth token"];
        }
        
        // Debug: Check what's in the user data
        // return ["status" => "debug", "user_data" => $user]; // Uncomment this line to debug
        
        if (!$user || !isset($user['email'])) {
            return ["status" => "error", "message" => "Invalid Auth token or user data"];
        }
        
        // Get user role from token
        $userRole = $user['role'] ?? null;
        
        if (!$userRole) {
            return ["status" => "error", "message" => "User role not found in token"];
        }
        
        if (!$this->checkRoles($userRole, 'create')) {
            return ["status" => "error", "message" => "Unauthorized action. Required role: admin, your role: " . $userRole];
        }

        $missing = $this->validateFields($data, ['title', 'price']); // Only title and price are required
        if(!empty($missing)){
           return [
                "status" => "error",
                "message" => "Invalid Request. Missing fields: " . implode(", ", $missing)
            ];

        }


        $package = new Packages();
        $package->title = $data['title'];
        $package->description = isset($data['description']) ? $data['description'] : null;
        $package->location = isset($data['location']) ? $data['location'] : null;
        $package->price = $data['price'];
        $package->duration = isset($data['duration']) ? $data['duration'] : null;
        $package->image_url = isset($data['image_url']) ? $data['image_url'] : null;

        if ($package->create()) {
            return ['status' => 'success', 'message' => 'Package created successfully.'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to create package.'];
        }
    }

    public function update($data) {
        $user = $this->getAuthenticatedUser();

        if (!$user || !isset($user['email'])) {
            return ["status" => "error", "message" => "Invalid Auth token or user data"];
        }

        $userRole = $user['role'] ?? null;

        if (!$userRole) {
            return ["status" => "error", "message" => "User role not found in token"];
        }

        if (!$this->checkRoles($userRole, 'update')) {
            return ["status" => "error", "message" => "Unauthorized action. Required role: admin, your role: " . $userRole];
        }

        if (!isset($data['id'])) {
            return ["status" => "error", "message" => "Package ID is required for update"];
        }

        $missing = $this->validateFields($data, ['id', 'title', 'price']);
        if (!empty($missing)) {
            return [
                "status" => "error",
                "message" => "Invalid Request. Missing fields: " . implode(", ", $missing)
            ];
        }

        $package = new Packages();
        $package->id = $data['id'];
        $package->title = $data['title'];
        $package->description = isset($data['description']) ? $data['description'] : null;
        $package->location = isset($data['location']) ? $data['location'] : null;
        $package->price = $data['price'];
        $package->duration = isset($data['duration']) ? $data['duration'] : null;
        $package->image_url = isset($data['image_url']) ? $data['image_url'] : null;

        if ($package->update()) {
            return ['status' => 'success', 'message' => 'Package updated successfully.'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to update package.'];
        }
    }

    public function delete($data) {
        $user = $this->getAuthenticatedUser();

        if (!$user || !isset($user['email'])) {
            return ["status" => "error", "message" => "Invalid Auth token or user data"];
        }

        $userRole = $user['role'] ?? null;

        if (!$userRole) {
            return ["status" => "error", "message" => "User role not found in token"];
        }

        if (!$this->checkRoles($userRole, 'delete')) {
            return ["status" => "error", "message" => "Unauthorized action. Required role: admin, your role: " . $userRole];
        }

        if (!isset($data['id'])) {
            return ["status" => "error", "message" => "Package ID is required for deletion"];
        }

        $package = new Packages();
        $package->id = $data['id'];

        if ($package->delete()) {
            return ['status' => 'success', 'message' => 'Package deleted successfully.'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to delete package or package not found.'];
        }
    }

    public function read($data) {
        // Read specific package by ID
        if (!isset($data['id'])) {
            return ["status" => "error", "message" => "Package ID is required"];
        }

        $package = new Packages();
        $package->id = $data['id'];
        $result = $package->read();

        if ($result) {
            return ['status' => 'success', 'data' => $result];
        } else {
            return ['status' => 'error', 'message' => 'Package not found.'];
        }
    }

    public function readAll($data) {
        // Read all packages - no authentication required (public access)
        $package = new Packages();
        $result = $package->readAll();

        return ['status' => 'success', 'data' => $result, 'count' => count($result)];
    }

    // Additional methods for update, delete, and read can be implemented similarly
}

// Handle direct HTTP requests when file is accessed directly
if (basename($_SERVER['PHP_SELF']) === 'packageApi.php') {
    header('Content-Type: application/json');
    
    try {
        $packageApi = new PackageApi();
        
        // Get request data
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $data = [];
        
        if ($method === 'GET') {
            $data = $_GET ?? [];
        } else {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            if ($data === null) {
                $data = $_POST ?? [];
            }
        }
        
        // Determine action
        $action = isset($data['action']) ? $data['action'] : 'readAll'; // Default to readAll for packages
        
        switch ($action) {
            case 'create':
                $response = $packageApi->create($data);
                break;
            case 'readAll':
            case 'getAll':
                $response = $packageApi->readAll($data);
                break;
            case 'read':
                $response = $packageApi->read($data);
                break;
            case 'update':
                $response = $packageApi->update($data);
                break;
            case 'delete':
                $response = $packageApi->delete($data);
                break;
            default:
                // Default to readAll for packages (for frontend compatibility)
                $response = $packageApi->readAll($data);
        }
        
        echo json_encode($response);
        
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Server error: ' . $e->getMessage()
        ]);
    }
}
?>