<?php

$news = file_get_contents("https://newsapi.org/v2/everything?q=" . $_REQUEST['country_capital'] . "&apiKey=cfa057f3087e4282a3365b3678cc8b9a");
print_r($news);
?>