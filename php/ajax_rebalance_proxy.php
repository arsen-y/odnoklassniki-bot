<?php
/**
 * Скрипт перераспределения прокси только для активных ботов (active=1).
 *
 * Алгоритм:
 * 1. Получается список прокси из входящего POST-параметра: удаляются пустые строки, лишние пробелы, дубликаты.
 * 2. Из базы выбираются только активные боты (active=1).
 * 3. Вычисляется целевое распределение:
 *    - Если активных ботов меньше (или столько же, сколько) прокси, то первые N прокси получают target=1,
 *      остальные – target=0.
 *    - Если ботов больше, то вычисляется base = floor(totalBots/totalProxies) и remainder = totalBots % totalProxies.
 *      Для первых remainder прокси target = base+1, для остальных – base.
 * 4. Боты группируются по текущему назначенному proxy (если он входит в список). Те активные боты,
 *    у которых назначен прокси не из списка – сразу попадают в очередь на переназначение.
 * 5. Для каждого proxy, если число ботов, назначенных на него, превышает целевой показатель, оставляются
 *    только первые target записей, остальные – в очередь.
 * 6. Из очереди ботов равномерно заполняются недостающие места (дефициты) по прокси.
 * 7. Если итоговое назначение для бота отличается от текущего, производится обновление в базе.
 */

require_once('/var/www/localhost/bot/functions.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 1. Обработка входящего списка прокси
    if (!isset($_POST['proxy'])) {
        echo "<p>Переменная 'proxy' не найдена в POST-запросе.</p>\n";
        exit;
    }

    $proxyInput = trim($_POST['proxy']);
    $proxyLines = explode("\n", $proxyInput);
    // Убираем пустые строки, обрезаем пробелы и сохраняем порядок без дубликатов
    $proxies = array_values(array_unique(array_filter(array_map('trim', $proxyLines))));
    $totalProxies = count($proxies);
    if ($totalProxies === 0) {
        echo "<p>Не предоставлено ни одного прокси для обработки.</p>\n";
        exit;
    }

    // 2. Получаем из базы только активных ботов (active=1)
    $stmt = $pdo->query("SELECT id, proxy FROM bots_data WHERE active=1");
    $bots = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $totalBots = count($bots);
    if ($totalBots === 0) {
        echo "<p>Не найдено активных ботов для обновления.</p>\n";
        exit;
    }

    echo "<h3>Общее количество активных ботов: <strong>{$totalBots}</strong></h3>\n";
    echo "<h3>Общее количество предоставленных прокси: <strong>{$totalProxies}</strong></h3>\n";

    // 3. Вычисляем целевое распределение для активных ботов
    $targetDistribution = [];
    if ($totalBots <= $totalProxies) {
        // Если активных ботов меньше (или столько же), чем прокси – первые N прокси получают target=1, остальные 0.
        foreach ($proxies as $index => $proxy) {
            $targetDistribution[$proxy] = ($index < $totalBots) ? 1 : 0;
        }
    } else {
        $base = intdiv($totalBots, $totalProxies);
        $remainder = $totalBots % $totalProxies;
        foreach ($proxies as $index => $proxy) {
            $targetDistribution[$proxy] = $base + (($index < $remainder) ? 1 : 0);
        }
    }

    echo "<h3>Целевая (идеальная) распределённость прокси:</h3>\n<ul>";
    foreach ($targetDistribution as $proxy => $target) {
        echo "<li>Прокси '<strong>{$proxy}</strong>' должно быть назначено <strong>{$target}</strong> раз(а)</li>";
    }
    echo "</ul>\n";

    // 4. Группируем ботов по их текущему назначению, если их proxy входит в список.
    // Боты с proxy, которого нет в списке, сразу отправляются в очередь переназначения.
    $currentAssignments = [];
    foreach ($proxies as $proxy) {
        $currentAssignments[$proxy] = [];
    }
    $reassignPool = []; // Очередь ботов для переназначения
    foreach ($bots as $bot) {
        if (in_array($bot['proxy'], $proxies)) {
            $currentAssignments[$bot['proxy']][] = $bot;
        } else {
            $reassignPool[] = $bot;
        }
    }

    // 5. Формируем предварительное «финальное» распределение.
    // Для каждого proxy оставляем не более target назначений; лишние боты попадают в очередь.
    $finalAssignments = []; // ключ: bot_id => назначенный proxy
    foreach ($proxies as $proxy) {
        $botsForProxy = $currentAssignments[$proxy];
        $target = $targetDistribution[$proxy];
        if (count($botsForProxy) <= $target) {
            // Если назначений меньше или равно target – оставляем их все
            foreach ($botsForProxy as $bot) {
                $finalAssignments[$bot['id']] = $proxy;
            }
        } else {
            // Если назначений больше target – оставляем первые target, а остальные в очередь
            $keep = array_slice($botsForProxy, 0, $target);
            $toReassign = array_slice($botsForProxy, $target);
            foreach ($keep as $bot) {
                $finalAssignments[$bot['id']] = $proxy;
            }
            foreach ($toReassign as $bot) {
                $reassignPool[] = $bot;
            }
        }
    }

    // 6. Определяем дефицит назначений для каждого proxy и заполняем его ботами из очереди
    $deficits = [];
    foreach ($proxies as $proxy) {
        $assigned = 0;
        foreach ($finalAssignments as $botId => $assignedProxy) {
            if ($assignedProxy === $proxy) {
                $assigned++;
            }
        }
        $deficits[$proxy] = $targetDistribution[$proxy] - $assigned;
    }
    foreach ($proxies as $proxy) {
        while ($deficits[$proxy] > 0 && count($reassignPool) > 0) {
            $bot = array_shift($reassignPool);
            $finalAssignments[$bot['id']] = $proxy;
            $deficits[$proxy]--;
        }
    }
    // Если что-то осталось в очереди (непредвиденная ситуация), то назначаем оставшимся ботам proxy с наименьшим числом назначений
    while (count($reassignPool) > 0) {
        $minProxy = null;
        $minCount = PHP_INT_MAX;
        foreach ($proxies as $proxy) {
            $count = 0;
            foreach ($finalAssignments as $assignedProxy) {
                if ($assignedProxy === $proxy) {
                    $count++;
                }
            }
            if ($count < $minCount) {
                $minCount = $count;
                $minProxy = $proxy;
            }
        }
        $bot = array_shift($reassignPool);
        $finalAssignments[$bot['id']] = $minProxy;
    }

    // 7. Для отчёта – вычисляем итоговое распределение назначений по прокси
    $finalDistribution = [];
    foreach ($proxies as $proxy) {
        $finalDistribution[$proxy] = 0;
    }
    foreach ($finalAssignments as $botId => $assignedProxy) {
        if (isset($finalDistribution[$assignedProxy])) {
            $finalDistribution[$assignedProxy]++;
        }
    }
    echo "<h3>Итоговое распределение прокси среди активных ботов:</h3>\n<ul>";
    foreach ($finalDistribution as $proxy => $count) {
        echo "<li>Прокси '<strong>{$proxy}</strong>' используется <strong>{$count}</strong> раз(а)</li>";
    }
    echo "</ul>\n";

    // 8. Формируем список обновлений – обновляем только те записи, где итоговое назначение отличается от текущего
    $updates = [];
    foreach ($bots as $bot) {
        $botId = $bot['id'];
        $currentProxy = $bot['proxy'];
        $newProxy = isset($finalAssignments[$botId]) ? $finalAssignments[$botId] : null;
        if ($newProxy !== null && $newProxy !== $currentProxy) {
            $updates[] = [
                'id'  => $botId,
                'old' => $currentProxy,
                'new' => $newProxy
            ];
        }
    }
    echo "<h3>Общее количество изменений: " . count($updates) . "</h3>\n";
    if (count($updates) > 0) {
        echo "<h3>Детали изменений:</h3>\n<ul>";
        foreach ($updates as $upd) {
            $old = ($upd['old'] === '' ? 'не было' : $upd['old']);
            echo "<li>Бот ID <strong>{$upd['id']}</strong>: proxy изменён с '<strong>{$old}</strong>' на '<strong>{$upd['new']}</strong>'</li>";
        }
        echo "</ul>\n";
    } else {
        echo "<p>Изменения не требовались. Прокси уже распределены равномерно.</p>\n";
    }

    // 9. Обновляем записи в базе данных в транзакции
    try {
        $pdo->beginTransaction();
        $stmtUpdate = $pdo->prepare("UPDATE bots_data SET proxy = :proxy WHERE id = :id");
        foreach ($updates as $upd) {
            $stmtUpdate->execute([
                ':proxy' => $upd['new'],
                ':id'    => $upd['id']
            ]);
        }
        $pdo->commit();
        echo "<p>Обновление базы данных прошло успешно.</p>";
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo "<p>Ошибка при обновлении базы данных: " . $e->getMessage() . "</p>";
    }
} else {
    echo "<p>Недопустимый метод запроса.</p>";
}
?>
