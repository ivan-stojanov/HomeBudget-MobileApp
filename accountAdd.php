<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST');

$return['accountName'] = $_POST['accountName'];

echo json_encode($return);

?>