
<?php

$countryN = $_REQUEST['countryN'];
$data = file_get_contents("https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=$countryN");
print_r($data);

?>


