# Server-Side Changes for Local Session Authentication

## Changes Needed in kong_AJAX.php

Replace Kongregate authentication with local session handling. Add these changes to your backend:

### 1. Add CORS Headers (at the TOP of kong_AJAX.php)

```php
<?php
// CORS headers - MUST be at the very top before any other code
header('Access-Control-Allow-Origin: http://localhost:8080');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Access-Control-Max-Age: 3600');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
```

### 2. Replace Kongregate Login Handler

**Find and REPLACE** the `kongLoginCreate` function/case with:

```php
case 'createLocalSession':
    // New local session authentication
    $sessionId = $_POST['sessionId'] ?? '';
    
    if (empty($sessionId)) {
        echo "Error: Invalid session ID";
        exit;
    }
    
    // Check if session already exists
    $sql = "SELECT Cookie, Account FROM sessions WHERE SessionID = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, 's', $sessionId);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if ($row = mysqli_fetch_assoc($result)) {
        // Existing session - return cookie
        echo $row['Cookie'];
    } else {
        // New session - create account and session
        $cookie = bin2hex(random_bytes(8)); // Generate 16-char cookie
        
        // Create new account
        $sql = "INSERT INTO `character` (playerName, createdDate) VALUES (?, NOW())";
        $stmt = mysqli_prepare($conn, $sql);
        $playerName = substr($sessionId, 0, 20); // Use part of sessionId as temp name
        mysqli_stmt_bind_param($stmt, 's', $playerName);
        mysqli_stmt_execute($stmt);
        $playerId = mysqli_insert_id($conn);
        
        // Create session
        $sql = "INSERT INTO sessions (Cookie, Account, SessionID, lastActive) VALUES (?, ?, ?, NOW())";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, 'sis', $cookie, $playerId, $sessionId);
        
        if (mysqli_stmt_execute($stmt)) {
            echo $cookie;
        } else {
            echo "Error creating session";
        }
    }
    break;
```

### 3. Update Database Schema

Add a `SessionID` column to your sessions table if it doesn't exist:

```sql
ALTER TABLE sessions 
ADD COLUMN SessionID VARCHAR(50) UNIQUE NULL AFTER Cookie,
ADD INDEX idx_sessionid (SessionID);
```

### 4. Remove/Update Kongregate-Specific Calls

**Find and REMOVE or COMMENT OUT** these Kongregate-specific handlers:
- `updateStoreInv` (if it was only for Kongregate MTX)
- `kongBuff` (ad reward system)
- Any other Kongregate token validation

**Or UPDATE** them to work with local sessions by using the cookie instead of Kongregate tokens.

### 5. Update Session Validation

Anywhere you were validating with Kongregate tokens, replace with cookie-based validation:

```php
// OLD Kongregate way:
// if ($kongToken !== getExpectedToken($userId)) { ... }

// NEW local session way:
$cookie = $_POST['cookie'] ?? $_COOKIE['applesauce_session'] ?? '';
$sql = "SELECT Account FROM sessions WHERE Cookie = ? AND lastActive > DATE_SUB(NOW(), INTERVAL 30 DAY)";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, 's', $cookie);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($row = mysqli_fetch_assoc($result)) {
    $playerId = $row['Account'];
    // Valid session - proceed
} else {
    echo "Error: Invalid or expired session";
    exit;
}
```

### 6. Production CORS Update

When deploying to production, update the CORS origin:

```php
// For production, replace localhost with your actual domain
$allowed_origins = [
    'http://localhost:8080',
    'https://yourdomain.com',
    'https://www.yourdomain.com'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: http://localhost:8080'); // fallback
}
```

---

## Summary of Changes

✅ **Frontend (completed):**
- Removed all `kongregate` object references
- Simplified authentication to use `localStorage` session IDs
- Updated AJAX calls to use `createLocalSession` instead of `kongLoginCreate`
- Removed Kongregate MTX/ads from store.js

❌ **Backend (you need to do):**
1. Add CORS headers to kong_AJAX.php
2. Replace `kongLoginCreate` with `createLocalSession` handler
3. Add `SessionID` column to sessions table
4. Update session validation throughout your PHP files
5. Remove Kongregate-specific features (optional)

## Testing

After making backend changes:
1. Clear localStorage in browser console: `localStorage.clear()`
2. Reload the app
3. Check that a new session is created automatically
4. Verify the cookie is stored and subsequent requests work
