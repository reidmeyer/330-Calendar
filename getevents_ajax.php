<?php
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

$date = $json_obj["jdate"];

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

$success = false; 
$message = "";


require 'config.php';

$userid="";
//so no error
if (isset($_SESSION['userid']))
{
    $userid = $_SESSION['userid'];
}

//matches with user id logged in
$stmt = $mysqli->prepare("select event_id, event_content, event_time, event_tag from events where event_date like ? AND (madebyuserid like ? or madebyuserid like 37) order by event_time");
$stmt->bind_param('ss', $date, $userid);

if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    echo json_encode(array(
        "success" => false
    ));
    exit;
}
$stmt->execute();
$stmt->bind_result($resid, $rescont, $restime, $resTag);

$total = "";
while($stmt->fetch()){
    $total = htmlentities($total . "\nevent id: " . $resid . "\n content: " . $rescont . "\ntime: " . $restime . "\nevent tag: " . $resTag . "\n");
}

echo json_encode(array(
    "success" => true,
    "message" => nl2br($total)
));
$stmt->close();

exit;

?>