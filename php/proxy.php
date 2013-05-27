<?php
/*!
 *
 * JSON Proxy for service-connector
 * http://coronadoland.com/service-connector
 *
 * Copyright (c) 2011-2013 Jose Antonio Garcia
 * Released under the MIT license
 * https://raw.github.com/coronadoland/service-connector/master/LICENSE.txt
 *
 * Date: 2013-04-10
 *
 * Inspired by: http://www.lornajane.net/posts/2011/posting-json-data-with-php-curl and others
 *
*/

// GLOBAL Variables
$URL = 'your url';
$CHARSET = 'utf-8';

// Initial parameters: Service name & JSON request
$service=$_GET["service"];
$request = file_get_contents('php://input');

// URl to connect
$curl_url = $URL . '/' . $service ;

// Opening CURL connection
$handler = curl_init($curl_url);

// CURL configuration
curl_setopt($handler, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($handler, CURLOPT_POSTFIELDS, $request);
curl_setopt($handler, CURLOPT_RETURNTRANSFER, true);
curl_setopt($handler, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($request))
);

// Executing CURL
if( $response = curl_exec($handler)) {

    //close connection
    curl_close($handler);

    header('Content-Type: application/json; charset=' . $CHARSET);
    echo $response;
// Executing CURL (Any problem)
} else {

    //close connection
    curl_close($handler);

    $status="500";
    $text="Server error";
    
    $response = 'HTTP/1.1 ' . $status . ' ' . $text;
    header($response);
}

?>
