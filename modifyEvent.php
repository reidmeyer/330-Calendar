<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

$eventId = $json_obj["eventId"];
$content = $json_obj["content"];
$time = $json_obj["time"];
ini_set("session.cookie_httponly", 1);

session_start();

$previous_ua = @$_SESSION['useragent'];
$current_ua = $_SERVER['HTTP_USER_AGENT'];

if(isset($_SESSION['useragent']) && $previous_ua !== $current_ua){
    die("Session hijack detected");
}else{
    $_SESSION['useragent'] = $current_ua;
}

$userId='';
if(isset($_SESSION['userid']))
{
    $userId = ($_SESSION['userid']);
}

//$user = $_SESSION['user'];
//$userid = $_SESSION['userid'];
//This is not working below!!!!!
//if(!hash_equals($_SESSION['token'], $_POST['token'])){
//	die("Request forgery detected");
//}
require 'config.php';




$stmt = $mysqli->prepare("update events set event_content = ?, event_time = ? where event_id like ? AND madebyuserid like ?");



if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    echo json_encode(array(
        "success" => false
    ));
    exit;
}

$stmt->bind_param('ssss', $content, $time , $eventId, $userId);
$stmt->execute();
$stmt->close();



echo json_encode(array(
    "success" => true,
    "message" => htmlentities($userId)
));

exit;

?>