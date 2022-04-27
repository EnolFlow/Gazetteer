
<?php

$data = file_get_contents("https://openexchangerates.org/api/latest.json?app_id=5e568e41b55043dfacbeca4399c92641");
print_r($data);

?>