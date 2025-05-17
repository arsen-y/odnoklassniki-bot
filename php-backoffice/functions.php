<?php

date_default_timezone_set('Europe/Moscow');

$servername = "localhost";
$username = "root";
$password = "root";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=okBot", $username, $password);
    // set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //echo "Connected successfully \n\n";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage()."\n";
    exit;
}

function getNextName()
{
    global $pdo;

    // Список популярных имён
    // $names = [
    //     'Арсен','Арсений','Артем','Анатолий',
    //     'Максим', 'Макс', 'Михаил', 'Миша', 'Александр', 'Алекс', 'Саша', 'Дмитрий', 'Дима',
    //     'Денис', 'Илья', 'Андрей', 'Даниил', 'Даня', 'Артём', 'Иван', 'Алексей', 'Алёша',
    //     'Никита', 'Павел', 'Паша', 'Евгений', 'Антон', 'Лев', 'Эльдар', 'Григорий', 'Гриша',
    //     'Владимир', 'Влад', 'Владислав', 'Руслан', 'Василий', 'Вася', 'Виталий', 'Витя',
    //     'Вячеслав', 'Игнат', 'Николай', 'Коля', 'Олег', 'Ренат', 'Роман', 'Рома', 'Сергей',
    //     'Серёжа', 'Тимур', 'Богдан', 'Гарик', 'Давид', 'Камиль', 'Кирилл', 'Константин',
    //     'Костя', 'Леонид', 'Лёня', 'Матвей', 'Степан', 'Стёпа', 'Филипп', 'Аркадий', 'Вадим',
    //     'Виктор', 'Витя', 'Георгий', 'Егор', 'Макар', 'Семён', 'Станислав', 'Тимофей', 'Юрий',
    //     'Юра', 'Анна', 'Мария', 'Маша', 'Юлия', 'Юля', 'Алёна', 'Анастасия', 'Екатерина',
    //     'Дарья', 'Ксения', 'Ксюша', 'Кристина', 'Алиса', 'Яна', 'Ольга', 'Оля', 'Александра',
    //     'Саша', 'Светлана', 'Света', 'Елизавета', 'Лиза', 'Маргарита', 'Елена', 'Лена', 'Агата',
    //     'Юлиана', 'Ирина', 'Алина', 'Арина', 'Валерия', 'Виктория', 'Вика', 'Диана', 'Ева',
    //     'Карина', 'Каролина', 'Марина', 'Наталья', 'Наташа', 'Варвара', 'Василиса', 'Вера',
    //     'Любовь', 'Марьяна', 'Надежда', 'Надя', 'Оксана', 'Регина', 'Софья', 'Татьяна', 'Алла',
    //     'Ангелина', 'Вероника', 'Евгения', 'Женя', 'Жанна', 'Лилия', 'Лиля', 'Милана', 'Полина',
    //     'Поля', 'Рената', 'Эльвира'
    // ];

    $names = [
        'Арсен','Арсений','Артем','Анатолий',
        'Максим', 'Макс', 'Михаил', 'Миша', 'Александр', 'Алекс', 'Саша', 'Дмитрий', 'Дима',
        'Денис', 'Илья', 'Андрей', 'Даниил', 'Даня', 'Артём', 'Иван', 'Алексей', 'Алёша',
        'Никита', 'Павел', 'Паша', 'Евгений', 'Антон', 'Лев', 'Эльдар', 'Григорий', 'Гриша',
        'Владимир', 'Влад', 'Владислав', 'Руслан', 'Василий', 'Вася', 'Виталий', 'Витя',
        'Вячеслав', 'Игнат', 'Николай', 'Коля', 'Олег', 'Ренат', 'Роман', 'Рома', 'Сергей',
        'Серёжа', 'Тимур', 'Богдан', 'Гарик', 'Давид', 'Камиль', 'Кирилл', 'Константин',
        'Костя', 'Леонид', 'Лёня', 'Матвей', 'Степан', 'Стёпа', 'Филипп', 'Аркадий', 'Вадим',
        'Виктор', 'Витя', 'Георгий', 'Егор', 'Макар', 'Семён', 'Станислав', 'Тимофей', 'Юрий',
        'Юра'
    ];

    // Получение текущего индекса
    $stmt = $pdo->prepare("SELECT vars FROM global_vars WHERE id = 2");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $currentIndex = (int)$result['vars'];

    // Проверка и получение имени
    if ($currentIndex >= count($names)) {
        $currentIndex = 0; // Обнуление индекса, если он вышел за пределы списка
    }
    $selectedName = $names[$currentIndex];

    // Увеличение индекса на 1
    $newIndex = $currentIndex + 1;

    // Обновление индекса в базе данных
    $stmt = $pdo->prepare("UPDATE global_vars SET vars = :newIndex WHERE id = 2");
    $stmt->bindParam(':newIndex', $newIndex, PDO::PARAM_INT);
    $stmt->execute();

    return $selectedName;
}

function getNextYouTubeLink()
{
    global $pdo;
    
    $videoIds = [
        '12345'
    ];
    
    // Получаем текущий индекс из базы данных
    $stmt = $pdo->prepare("SELECT vars FROM global_vars WHERE id = 3");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $currentIndex = (int)$result['vars'];
    
    // Если индекс вышел за пределы массива, обнуляем его
    if ($currentIndex >= count($videoIds)) {
        $currentIndex = 0;
    }
    
    // Формируем конечную ссылку
    $baseUrl = 'https://www.youtube.com/watch?v=';
    $selectedLink = $baseUrl . $videoIds[$currentIndex];
    
    // Увеличиваем индекс на 1 для следующего вызова
    $newIndex = $currentIndex + 1;
    
    // Обновляем индекс в базе данных
    $stmt = $pdo->prepare("UPDATE global_vars SET vars = :newIndex WHERE id = 3");
    $stmt->bindParam(':newIndex', $newIndex, PDO::PARAM_INT);
    $stmt->execute();
    
    return $selectedLink;
}

class Action
{
    protected $pdo;
    protected $table;
    protected $data = [];

    public function __construct(PDO $pdo, $table = 'actions_queue')
    {
        $this->pdo = $pdo;
        $this->table = $table;
    }

    // Магические методы для доступа к данным
    public function __get($name)
    {
        return $this->data[$name] ?? null;
    }
    public function __set($name, $value)
    {
        $this->data[$name] = $value;
    }

    // Загрузка экшена по ID
    public function load($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        $this->data = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Сохранение экшена (вставка или обновление)
    public function save()
    {
        if (isset($this->data['id'])) {
            // Обновление
            $columns = array_keys($this->data);
            $columns = array_filter($columns, function ($col) { return $col != 'id'; });
            $setClause = implode(',', array_map(function ($col) { return "$col = :$col"; }, $columns));
            $sql = "UPDATE {$this->table} SET $setClause WHERE id = :id";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($this->data);
        } else {
            // Вставка
            $columns = array_keys($this->data);
            $columnsList = implode(',', $columns);
            $placeholders = implode(',', array_map(function ($col) { return ":$col"; }, $columns));
            $sql = "INSERT INTO {$this->table} ($columnsList) VALUES ($placeholders)";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($this->data);
            $this->data['id'] = $this->pdo->lastInsertId();
        }
    }

    // Удаление экшена
    public function delete()
    {
        if (isset($this->data['id'])) {
            $stmt = $this->pdo->prepare("DELETE FROM {$this->table} WHERE id = ?");
            $stmt->execute([$this->data['id']]);
            $this->data = [];
        }
    }

    public function getData()
    {
        return $this->data;
    }
}

class ActionsController
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function run()
    {
        while (true) {
            $currentHour = date('G');

            $this->removeActionsForInactiveBots();
            $this->processDialogs();

            // Проверяем текущее время и при необходимости приостанавливаем выполнение
            if ($this->isSleepingTime($currentHour)) {
                echo "Спим...\n";
                sleep(60);
                continue;
            }

            $this->addActionsFromPreQueue();
            $this->retryFailedSearchActions();

            sleep(60);
        }
    }

    public function isSleepingTime($hour)
    {
        return ($hour >= 1 && $hour <= 6);
    }

    public function isSleepingTime2($hour)
    {
        return ($hour >= 1 && $hour <= 9);
    }

    private function removeActionsForInactiveBots()
    {
        // Удаляем экшены в очередях для неактивных ботов
        $sql = "DELETE aq
                FROM actions_queue aq
                JOIN bots_data bd ON bd.id = aq.botId
                WHERE bd.active = 0";
        $this->pdo->exec($sql);

        $sql = "DELETE apq
                FROM actions_pre_queue apq
                JOIN bots_data bd ON bd.id = apq.botId
                WHERE bd.active = 0";
        $this->pdo->exec($sql);
    }

    private function processDialogs()
    {
        // Обработка диалогов
        $this->handleUnwatchedDialogs();
        $this->handleWatchedDialogs();
        $this->handleOldDialogs();
        //$this->handleRemindDialogs();
        // $this->handleRemindUnwatchedDialogs();
    }

    private function handleUnwatchedDialogs()
    {
        // Обработка диалогов, которые были отправлены, но не просмотрены/не получен ответ
        $sql = "SELECT d.*
                FROM dialogs d
                JOIN bots_data bd ON bd.id = d.botId
                WHERE bd.active = 1
                  AND d.time IS NOT NULL
                  AND d.time <= NOW() - INTERVAL 10 HOUR
                  AND d.time2 IS NULL";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        while ($dialog = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "Найден непросмотренный диалог с пользователем id {$dialog['id']} бот id {$dialog['botId']}\n";

            if (!$this->existsInAnyQueue($dialog['botId'], $dialog['id'], 'messages/deleteDialog')) {
                $this->deleteMessageActionsPrepare($dialog['botId'], $dialog['id']);

                $newAction = new Action($this->pdo);
                $newAction->botId = $dialog['botId'];
                $newAction->route = 'messages/deleteDialog';
                $newAction->startPage = 'https://ok.ru/messages/' . $dialog['id'];
                $newAction->param1 = $dialog['id'];
                $newAction->save();
                echo "Добавлен экшен messages/deleteDialog для бота id {$dialog['botId']} и пользователя id {$dialog['id']}\n";
            }
        }
    }

    private function handleWatchedDialogs()
    {
        // Обработка диалогов, которые были просмотрены/получен ответ и нужно удалить первое сообщение
        $sql = "SELECT d.*
                FROM dialogs d
                JOIN bots_data bd ON bd.id = d.botId
                WHERE bd.active = 1
                  AND d.time IS NOT NULL
                  AND d.time <= NOW() - INTERVAL 10 HOUR
                  AND d.time2 IS NOT NULL";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        while ($dialog = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "Найден просмотренный/отвеченный диалог с пользователем id {$dialog['id']} бот id {$dialog['botId']}\n";

            if (!$this->existsInAnyQueue($dialog['botId'], $dialog['id'], 'messages/deleteFirstMessage')) {
                $this->deleteMessageActionsPrepare($dialog['botId'], $dialog['id']);

                $newAction = new Action($this->pdo);
                $newAction->botId = $dialog['botId'];
                $newAction->route = 'messages/deleteFirstMessage';
                $newAction->startPage = 'https://ok.ru/messages/' . $dialog['id'];
                $newAction->param1 = $dialog['id'];
                $newAction->save();
                echo "Добавлен экшен messages/deleteFirstMessage для бота id {$dialog['botId']} и пользователя id {$dialog['id']}\n";
            }
        }
    }

    private function handleRemindDialogs()
    {
        // Обработка диалогов, где было отправлено 1 сообщение и прошло 4.5 и более часов без ответа
        $sql = "SELECT d.*
                FROM dialogs d
                JOIN bots_data bd ON bd.id = d.botId
                WHERE bd.active = 1
                  AND (d.timeWatched < NOW() - INTERVAL 30 MINUTE OR d.timeWatched IS NULL)
                  AND d.countMsgSended = 1
                  AND d.time2 IS NOT NULL
                  AND d.time2 <= NOW() - INTERVAL 270 MINUTE
                  ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        while ($dialog = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $this->updateDialogTimeWatched($dialog['id']);

            if (!$this->existsInAnyQueue($dialog['botId'], $dialog['id'], 'messages/watchDialog')) {
                $newAction = new Action($this->pdo);
                $newAction->botId = $dialog['botId'];
                $newAction->route = 'messages/watchDialog';
                $newAction->startPage = 'https://ok.ru/messages/' . $dialog['id'];
                $newAction->param1 = $dialog['id'];
                $newAction->save();

                echo "handleRemindDialogs: Добавлен экшен messages/watchDialog для пользователя id {$dialog['id']} бот id {$dialog['botId']}\n";
            }
        }

        while ($dialog = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "Найден просмотренный/отвеченный диалог с пользователем id {$dialog['id']} бот id {$dialog['botId']}\n";

            if (!$this->existsInAnyQueue($dialog['botId'], $dialog['id'], 'messages/deleteFirstMessage')) {
                $this->deleteMessageActionsPrepare($dialog['botId'], $dialog['id']);

                $newAction = new Action($this->pdo);
                $newAction->botId = $dialog['botId'];
                $newAction->route = 'messages/deleteFirstMessage';
                $newAction->startPage = 'https://ok.ru/messages/' . $dialog['id'];
                $newAction->param1 = $dialog['id'];
                $newAction->save();
                echo "Добавлен экшен messages/deleteFirstMessage для бота id {$dialog['botId']} и пользователя id {$dialog['id']}\n";
            }
        }
    }

    private function handleRemindUnwatchedDialogs()
    {
        // Обработка диалогов, где был отправлен только стикер и прошло 4.5 и более часов без ответа
        $sql = "SELECT d.*
                FROM dialogs d
                JOIN bots_data bd ON bd.id = d.botId
                WHERE bd.active = 1
                  AND (d.timeWatched < NOW() - INTERVAL 30 MINUTE OR d.timeWatched IS NULL)
                  AND d.countMsgSended = 0
                  AND d.time IS NOT NULL
                  AND d.time2 IS NULL
                  AND d.time <= NOW() - INTERVAL 270 MINUTE
                  ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        while ($dialog = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $this->updateDialogTimeWatched($dialog['id']);

            if (!$this->existsInAnyQueue($dialog['botId'], $dialog['id'], 'messages/watchDialog')) {
                $newAction = new Action($this->pdo);
                $newAction->botId = $dialog['botId'];
                $newAction->route = 'messages/watchDialog';
                $newAction->startPage = 'https://ok.ru/messages/' . $dialog['id'];
                $newAction->param1 = $dialog['id'];
                $newAction->save();

                echo "handleRemindUnwatchedDialogs: Добавлен экшен messages/watchDialog для пользователя id {$dialog['id']} бот id {$dialog['botId']}\n";
            }
        }

        while ($dialog = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "Найден просмотренный/отвеченный диалог с пользователем id {$dialog['id']} бот id {$dialog['botId']}\n";

            if (!$this->existsInAnyQueue($dialog['botId'], $dialog['id'], 'messages/deleteFirstMessage')) {
                $this->deleteMessageActionsPrepare($dialog['botId'], $dialog['id']);

                $newAction = new Action($this->pdo);
                $newAction->botId = $dialog['botId'];
                $newAction->route = 'messages/deleteFirstMessage';
                $newAction->startPage = 'https://ok.ru/messages/' . $dialog['id'];
                $newAction->param1 = $dialog['id'];
                $newAction->save();
                echo "Добавлен экшен messages/deleteFirstMessage для бота id {$dialog['botId']} и пользователя id {$dialog['id']}\n";
            }
        }
    }

    private function handleOldDialogs()
    {
        // Обработка старых диалогов, которые нужно полностью удалить
        $sql = "SELECT d.*
                FROM dialogs d
                JOIN bots_data bd ON bd.id = d.botId
                WHERE bd.active = 1
                  AND d.time2 IS NOT NULL
                  AND d.time2 <= NOW() - INTERVAL 10 HOUR";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        while ($dialog = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "Найден старый диалог с пользователем id {$dialog['id']} бот id {$dialog['botId']}\n";

            if (!$this->existsInAnyQueue($dialog['botId'], $dialog['id'], 'messages/deleteDialog')) {
                $this->deleteMessageActionsPrepare($dialog['botId'], $dialog['id']);

                $newAction = new Action($this->pdo);
                $newAction->botId = $dialog['botId'];
                $newAction->route = 'messages/deleteDialog';
                $newAction->startPage = 'https://ok.ru/messages/' . $dialog['id'];
                $newAction->param1 = $dialog['id'];
                $newAction->save();
                echo "Добавлен экшен messages/deleteDialog для бота id {$dialog['botId']} и пользователя id {$dialog['id']}\n";
            }
        }
    }

    private function deleteMessageActionsPrepare($botId, $param1)
    {
        $stmt = $this->pdo->prepare("DELETE FROM actions_queue WHERE botId = ? AND param1 = ? AND route LIKE 'messages/%'");
        $stmt->execute([$botId, $param1]);
        $stmt = $this->pdo->prepare("DELETE FROM actions_pre_queue WHERE botId = ? AND param1 = ? AND route LIKE 'messages/%'");
        $stmt->execute([$botId, $param1]);
    }

    private function deleteRoute($botId, $route)
    {
        $stmt = $this->pdo->prepare("DELETE FROM actions_queue WHERE botId = ? AND route = ?");
        $stmt->execute([$botId, $route]);
        $stmt = $this->pdo->prepare("DELETE FROM actions_pre_queue WHERE botId = ? AND route = ?");
        $stmt->execute([$botId, $route]);
    }

    private function addActionsFromPreQueue()
    {
        // Добавляем экшены из actions_pre_queue в actions_queue порционно
        $sql = "SELECT apq.*
                FROM actions_pre_queue apq
                JOIN bots_data bd ON bd.id = apq.botId
                WHERE bd.active = 1
                ORDER BY RAND()
                LIMIT 2";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $action = new Action($this->pdo);
            $action->botId = $row['botId'];
            $action->route = $row['route'];
            $action->startPage = $row['startPage'];
            $action->param1 = $row['param1'];
            $action->save();

            $stmtDelete = $this->pdo->prepare("DELETE FROM actions_pre_queue WHERE id = ?");
            $stmtDelete->execute([$row['id']]);
            echo "Добавлен экшен {$row['route']} из actions_pre_queue для бота id {$row['botId']}\n";
        }
    }

    private function retryFailedSearchActions()
    {
        // Повторяем неудачные экшены поиска пользователей
        $sql = "SELECT ah.*
                FROM actions_history ah
                JOIN bots_data bd ON bd.id = ah.botId
                WHERE bd.active = 1
                  AND ah.route = 'search/people'
                  AND ah.success = '0'
                  AND ah.time >= NOW() - INTERVAL 1 DAY";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "Найден неудачный экшен search/people, бот id {$row['botId']}\n";

            // Удаляем из actions_history
            $stmtDelete = $this->pdo->prepare("DELETE FROM actions_history WHERE id = ?");
            $stmtDelete->execute([$row['id']]);

            // Добавляем в actions_pre_queue
            $startPage = 'https://ok.ru/dk?st.cmd=searchResult&st.mode=Users&st.grmode=Groups&st.query=' . urlencode($this->getNextName()) . '&st.onSite=on&st.tillAge=45';

            $action = new Action($this->pdo, 'actions_pre_queue');
            $action->botId = $row['botId'];
            $action->route = 'search/people';
            $action->startPage = $startPage;
            $action->param1 = ''; // Если необходимо, можно добавить параметр
            $action->save();
            echo "Добавлен в actions_pre_queue экшен search/people для бота id {$row['botId']}\n";
        }
    }

    private function getNextName()
    {
        return getNextName();
    }

    private function handleDialogsWatchActions()
    {
        // Обработка экшенов messages/watchDialog
        $sql = "SELECT d.*
                FROM dialogs d
                JOIN bots_data bd ON bd.id = d.botId
                WHERE bd.active = 1
                  AND d.countMsgSended < 10
                  AND (d.timeWatched < NOW() - INTERVAL 30 MINUTE OR d.timeWatched IS NULL)";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $inserted = [];

        while ($dialog = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $this->updateDialogTimeWatched($dialog['id']);

            if (!$this->existsInAnyQueue($dialog['botId'], $dialog['id'], 'messages/watchDialog')) {
                $newAction = new Action($this->pdo);
                $newAction->botId = $dialog['botId'];
                $newAction->route = 'messages/watchDialog';
                $newAction->startPage = 'https://ok.ru/messages/' . $dialog['id'];
                $newAction->param1 = $dialog['id'];
                $newAction->save();

                echo "Добавлен экшен messages/watchDialog для пользователя id {$dialog['id']} бот id {$dialog['botId']}\n";

                if (!isset($inserted[$dialog['botId']])) {
                    $this->insertExtraBotActions($dialog['botId']);
                    $inserted[$dialog['botId']] = true;
                }
            }
        }
    }

    private function updateDialogTimeWatched($userId)
    {
        $stmt = $this->pdo->prepare("UPDATE dialogs SET timeWatched = NOW() WHERE id=?");
        $stmt->execute([$userId]);
    }

    private function insertExtraBotActions($botId)
    {
        $actions = [
            [
                'route' => 'messages/readDialogs',
                'startPage' => 'https://ok.ru/messages'
            ]
        ];

        foreach ($actions as $act) {
            // предварительно удаляем данный роут для данного botId, чтобы не накапливалось много однотипных экшенов
            $this->deleteRoute($botId, $act['route']);
            
            $action = new Action($this->pdo);
            $action->botId = $botId;
            $action->route = $act['route'];
            $action->startPage = $act['startPage'];
            $action->param1 = ''; // Если необходимо, можно добавить параметр
            $action->save();
            echo "Добавлен экшен {$act['route']} для бота id {$botId}\n";
        }
    }

    private function insertExtraBotActions2($botId)
    {
        $actions = [
            [
                'route' => 'notifications/acceptAllNotifications',
                'startPage' => 'https://ok.ru/payments'
            ],
            [
                'route' => 'ownProfile/cleanWall',
                'startPage' => 'https://ok.ru'
            ],
        ];

        foreach ($actions as $act) {
            // предварительно удаляем данный роут для данного botId, чтобы не накапливалось много однотипных экшенов
            $this->deleteRoute($botId, $act['route']);
            
            $action = new Action($this->pdo);
            $action->botId = $botId;
            $action->route = $act['route'];
            $action->startPage = $act['startPage'];
            $action->param1 = ''; // Если необходимо, можно добавить параметр
            $action->save();
            echo "Добавлен экшен {$act['route']} для бота id {$botId}\n";
        }
    }

    /**
     * Добавляет начальные экшены для ботов.
     * Вставляет 6 экшенов 'search/people' и 1 экшен 'ownProfile/cleanWall' в actions_pre_queue.
     *
     * @param bool $onlyActive Если true, добавляет только для активных ботов.
     */
    public function addInitActions($onlyActive = true)
    {
        $sql = "SELECT id FROM bots_data";
        if ($onlyActive) {
            $sql .= " WHERE active = 1";
        }
        $sql .= " ORDER BY id ASC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $botId = $row['id'];

            for ($i = 0; $i < 4; $i++) {
                $searchQuery = $this->getNextName();
                $startPage = 'https://ok.ru/dk?st.cmd=searchResult&st.mode=Users&st.grmode=Groups&st.query=' . urlencode($searchQuery) . '&st.onSite=on&st.tillAge=45';

                $action = new Action($this->pdo, 'actions_pre_queue');
                $action->botId = $botId;
                $action->route = 'search/people';
                $action->startPage = $startPage;
                $action->param1 = '';
                $action->save();
                echo "Добавлен экшен search/people для бота id {$botId}, запрос: {$searchQuery}\n";
            }
        }
    }

    public function addRegularActions($onlyActive = true)
    {
        $sql = "SELECT id FROM bots_data";
        if ($onlyActive) {
            $sql .= " WHERE active = 1";
        }
        $sql .= " ORDER BY id ASC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $botId = $row['id'];
            $this->insertExtraBotActions($botId);
        }
    }

    public function addRegularActions2($onlyActive = true)
    {
        $sql = "SELECT id FROM bots_data";
        if ($onlyActive) {
            $sql .= " WHERE active = 1";
        }
        $sql .= " ORDER BY id ASC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $botId = $row['id'];
            $this->insertExtraBotActions2($botId);
        }
    }

    public function addGroupRepostAction()
    {
        $sql = "SELECT id FROM bots_data WHERE active = 1 ORDER by RAND() LIMIT 0,1";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $urls = [
    "https://ok.ru/lucymik",
    "https://ok.ru/itsblackhumor",
    "https://ok.ru/megasmile",
    "https://ok.ru/in.humour",
    "https://ok.ru/smehugar",
    "https://ok.ru/humoranekdoty",
    "https://ok.ru/anekdot.tm",
    "https://ok.ru/yeslivyvs",
    "https://ok.ru/zabavydlya",
    "https://ok.ru/cheyumor",
    "https://ok.ru/ietovamvyidetbokom",
    "https://ok.ru/inhumour",
    "https://ok.ru/pelmeny",
    "https://ok.ru/smehuyochki",
    "https://ok.ru/dezhavyu",
    "https://ok.ru/yumorsmey119",
    "https://ok.ru/rojkovandrei",
    "https://ok.ru/anekdotu.klass",
    "https://ok.ru/optimizmmm",
    "https://ok.ru/klasssgroup",
    "https://ok.ru/rzhachyumomatros",
    "https://ok.ru/funsmile",
    "https://ok.ru/cool.greetings",
    "https://ok.ru/selecthumour",
    "https://ok.ru/sssr0"
];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $botId = $row['id'];

            $action = new Action($this->pdo, 'actions_queue');
            $action->botId = $botId;
            $action->route = 'group/repostToGroup';

            // Выбираем случайный индекс из массива
            $randomKey = array_rand($urls);

            $action->startPage = $urls[$randomKey];
            $action->param1 = ''; // Если необходимо, можно добавить параметр
            $action->save();
            echo "Добавлен экшен group/repostToGroup для бота id {$botId}\n";
        }
    }

    /**
    * Проверяет, существует ли экшен в текущей таблице или в actions_pre_queue
    *
    * @param int $botId
    * @param string $param1
    * @param string $route
    * @return bool
    */
    public function existsInAnyQueue($botId, $param1, $route)
    {
        $stmt = $this->pdo->prepare("SELECT id FROM actions_queue WHERE botId = ? AND param1 = ? AND route = ? LIMIT 1");
        $stmt->execute([$botId, $param1, $route]);
        if ($stmt->fetch()) {
            return true;
        }

        $stmt = $this->pdo->prepare("SELECT id FROM actions_pre_queue WHERE botId = ? AND param1 = ? AND route = ? LIMIT 1");
        $stmt->execute([$botId, $param1, $route]);
        if ($stmt->fetch()) {
            return true;
        }

        return false;
    }

    public function moveAllActionsToPreQueue()
    {
        // Fetch all actions from actions_queue
        $stmt = $this->pdo->prepare("SELECT * FROM actions_queue");
        $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Create a new Action object for actions_pre_queue
            $action = new Action($this->pdo, 'actions_pre_queue');
            $action->botId = $row['botId'];
            $action->route = $row['route'];
            $action->startPage = $row['startPage'];
            $action->param1 = $row['param1'];
        
            // Save the action to actions_pre_queue
            $action->save();

            // Delete the original action from actions_queue
            $stmtDelete = $this->pdo->prepare("DELETE FROM actions_queue WHERE id = ?");
            $stmtDelete->execute([$row['id']]);
        }
    }
}
