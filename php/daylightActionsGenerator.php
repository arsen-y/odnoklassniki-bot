<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

//sleep(mt_rand(0, 3600*5)); 

require_once('/var/www/localhost/bot/functions.php'); 

$controller = new ActionsController($pdo);
$controller->addInitActions();

// удаляем старую историю экшенов
$pdo->prepare("DELETE FROM actions_history WHERE time < NOW() - INTERVAL 1 DAY")->execute([]);

$pdo->prepare("DELETE FROM actions_queue WHERE time < NOW() - INTERVAL 1 DAY")->execute([]);
$pdo->prepare("DELETE FROM actions_pre_queue WHERE time < NOW() - INTERVAL 1 DAY")->execute([]);
$pdo->prepare("DELETE FROM stickers_sended WHERE time < NOW() - INTERVAL 7 HOUR")->execute([]);
//$pdo->prepare("DELETE FROM video_sended WHERE time < NOW() - INTERVAL 7 DAY")->execute([]);
$pdo->prepare("DELETE FROM people_pre_send WHERE time < NOW() - INTERVAL 1 DAY")->execute([]);
$pdo->prepare("DELETE FROM dialogs WHERE time < NOW() - INTERVAL 3 DAY OR time2 < NOW() - INTERVAL 3 DAY")->execute([]);
$pdo->prepare("DELETE FROM `dialogs` WHERE botId IN(select id from bots_data WHERE active=0);")->execute([]);

?>