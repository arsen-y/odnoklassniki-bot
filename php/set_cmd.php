<?php
require_once('/var/www/localhost/bot/functions.php');

$controller = new ActionsController($pdo);
//$controller->moveAllActionsToPreQueue();
//
$sql = "SELECT * FROM `bots_data` WHERE id in (180,191,221,222,223,224,225,226,227,228)";

$stmt = $pdo->prepare($sql);
$stmt->execute();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $botId = $row['id'];

    // $action = new Action($pdo, 'actions_queue');
    // $action->botId = $botId;
    // $action->route = 'login/auth';
    // $action->startPage = 'https://ok.ru';
    // $action->param1 = '';
    // $action->save();

    // $action = new Action($pdo, 'actions_queue');
    // $action->botId = $botId;
    // $action->route = 'password/change';
    // $action->startPage = 'https://ok.ru/settings/password';
    // $action->param1 = '';
    // $action->save();

    $action = new Action($pdo, 'actions_queue');
    $action->botId = $botId;
    $action->route = 'ownProfile/fillSchoolForm';
    $action->startPage = 'https://ok.ru';
    $action->param1 = '';
    $action->save();

    // $action = new Action($pdo, 'actions_queue');
    // $action->botId = $botId;
    // $action->route = 'ownProfile/cleanWall';
    // $action->startPage = 'https://ok.ru';
    // $action->param1 = '';
    // $action->save();

    // $action = new Action($pdo, 'actions_queue');
    // $action->botId = $botId;
    // $action->route = 'notifications/acceptAllNotifications';
    // $action->startPage = 'https://ok.ru/payments';
    // $action->param1 = '';
    // $action->save();

    // $action = new Action($pdo, 'actions_queue');
    // $action->botId = $botId;
    // $action->route = 'ownProfile/postVideo';
    // $action->startPage = 'https://ok.ru';
    // $action->param1 = '';
    // $action->save();

    // $action = new Action($pdo, 'actions_queue');
    // $action->botId = $botId;
    // $action->route = 'group/join';
    // $action->startPage = 'https://ok.ru/do6avb.v.dpy3b9l';
    // $action->param1 = '';
    // $action->save();

    for ($i = 0; $i < 4; $i++) {
        $searchQuery = getNextName();
        $startPage = 'https://ok.ru/dk?st.cmd=searchResult&st.mode=Users&st.grmode=Groups&st.query=' . urlencode($searchQuery) . '&st.onSite=on&st.tillAge=45';

        $action = new Action($pdo, 'actions_pre_queue');
        $action->botId = $botId;
        $action->route = 'search/people';
        $action->startPage = $startPage;
        $action->param1 = '';
        $action->save();
    }
   
    echo "Добавлен экшен для бота id {$botId} <br>";
}
