<?php
header("Set-Cookie: cross-site-cookie=whatever; SameSite=None; Secure");
$lat = $_REQUEST['lat'];
$lng = $_REQUEST['lng'];
$data = file_get_contents("https://api.openweathermap.org/data/2.5/onecall?lat=$lat&lon=$lng&exclude=hourly,daily,minutely&appid=6e1abe8d6a74c560d636cae6e03d824b&units=metric");
print_r($data);
?>