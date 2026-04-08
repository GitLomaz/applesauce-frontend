<?php
/**
 * CORS FIX - Add these headers to the TOP of kong_AJAX.php on the backend server
 * (applesauce-838900413941.us-west1.run.app/kong_AJAX.php)
 * 
 * These headers must be added BEFORE any other output
 */

// Allow requests from localhost development server
header('Access-Control-Allow-Origin: http://localhost:8080');

// If you need to allow multiple origins, use this instead:
// $allowed_origins = ['http://localhost:8080', 'http://localhost:3000', 'https://yourdomain.com'];
// $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
// if (in_array($origin, $allowed_origins)) {
//     header('Access-Control-Allow-Origin: ' . $origin);
// }

// Allow credentials (cookies, authorization headers, etc.)
header('Access-Control-Allow-Credentials: true');

// Allow these HTTP methods
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Allow these headers in requests
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');

// Cache preflight request for 1 hour
header('Access-Control-Max-Age: 3600');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ... rest of your kong_AJAX.php code goes here ...
?>
