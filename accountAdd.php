<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');


$return['accountName'] = /*json_decode*/($_POST['accountName']);
//$return['accountType'] = json_decode($_POST['accountType']);
/*$return['accountBalance'] = $_POST['accountBalance'];
$return['accountDate'] = $_POST['accountDate'];*/

echo json_encode($return);

//echo json_encode($accountName);
//$data="I am sending response to you";
//echo /*$_GET['jsoncallback'] .*/ '(' . json_encode(/*$accountName*/"Ivn") . ');';
/*
$return['accountName']=$accountName;
$return['accountType']=$accountType;
$return['accountBalance']=$accountBalance;
$return['accountDate']=$accountDate;
*/
?>

