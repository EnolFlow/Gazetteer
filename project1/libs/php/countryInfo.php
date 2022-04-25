<?php

$country_code = $_REQUEST['country_code'];
$data = file_get_contents("https://restcountries.com/v3.1/alpha/$country_code");
print_r($data);

?>