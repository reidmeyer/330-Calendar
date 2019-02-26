<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//security stuff
ini_set("session.cookie_httponly", 1);

session_start();

$previous_ua = @$_SESSION['useragent'];
$current_ua = $_SERVER['HTTP_USER_AGENT'];

if(isset($_SESSION['useragent']) && $previous_ua !== $current_ua){
    die("Session hijack detected");
}else{
    $_SESSION['useragent'] = $current_ua;
}

$user = $json_obj["luser"];
$pass = $json_obj["lpass"];
$success = false; 
$_SESSION['loggedin']=false;
$_SESSION['userid']='0';



require 'config.php';

// This is a *good* example of how you can implement password-based user authentication in your web application.

// Use a prepared statement
$stmt = $mysqli->prepare("SELECT pass FROM users WHERE user=?");

// Bind the parameter
$stmt->bind_param('s', $user);
$stmt->execute();

// Bind the results
$stmt->bind_result($encry);
$stmt->fetch();

if(password_verify($pass, $encry)){
    // Login succeeded!
    $_SESSION['user'] = $user;
    $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));

    //assign session id id from sql
    $stmt->close();

    // Use a prepared statement
    $stmt = $mysqli->prepare("SELECT id FROM users WHERE user=?");

    // Bind the parameter
    $stmt->bind_param('s', $user);
    $stmt->execute();

    // Bind the results
    $stmt->bind_result($userid);
    $stmt->fetch();
    $_SESSION['userid'] = $userid;

    $_SESSION['loggedin']=true;

    echo json_encode(array(
        "success" => true
    ));
    exit;



} else{
    // Login failed; redirect back to the login screen
    echo json_encode(array(
        "success" => false,
        "message" => "Incorrect Username or Password"
    ));
    exit;
}

?>