<?php

// ini_set('display_errors', 1);
// error_reporting(E_ALL);

//sleep(mt_rand(0, 3600*5)); 

require_once('/var/www/localhost/bot/functions.php'); 

$controller = new ActionsController($pdo);

if ($controller->isSleepingTime(date('G'))) {
    echo "Спим...\n";
    exit; 
}

$controller->addRegularActions2();

?>