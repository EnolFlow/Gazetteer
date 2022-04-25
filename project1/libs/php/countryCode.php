<?php

$string = file_get_contents("countryBorders.geo.json");
$json = json_decode($string);
$features = $json->features;

$list_countries = array();
for($i=0;$i<sizeof($features);$i++){
    $feature = $features[$i];
    $country_name = $feature->properties->name;
    $country_iso_a2 = $feature->properties->iso_a2;
    $array = [$country_name, $country_iso_a2];
    array_push($list_countries, $array);
}

usort($list_countries, function($a, $b) {
    return strcasecmp($a[0], $b[0]);
});

print_r(json_encode($list_countries));
?>