<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);


//variables for adding events
$day = $json_obj["day"];
$content = $json_obj["content"];
$time = $json_obj["time"];
$month = $json_obj["month"];
$year = $json_obj["year"];
$tag = $json_obj["tag"];


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

$message = "";

require 'config.php';


//$user = $_SESSION['user'];
//$userid = $_SESSION['userid'];

$success = false; 
//formatting date
$eventdate = $year . "-" . $month . "-" . $day;




//set up insert
$stmt = $mysqli->prepare("insert into events (madebyuser, event_content, event_date, madebyuserid, event_time, event_tag) values (?,?,?,?,?,?)");



if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    echo json_encode(array(
        "success" => false
    ));
    exit;
}

//only works if a user is logged in
if (isset($_SESSION['userid']) && isset($_SESSION['user']) && ($_SESSION['userid']!=""))
{
    $username = $_SESSION['user'];
    $id = $_SESSION['userid'];
    $stmt->bind_param('sssiss', $username, $content, $eventdate, $id, $time, $tag);
    $stmt->execute();
}


$stmt->close();


echo json_encode(array(
    "success" => true,
));

exit;

?>