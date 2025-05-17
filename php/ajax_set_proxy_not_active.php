<?php
require_once('/var/www/localhost/bot/functions.php'); 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['proxy'])) {
        $proxyList = $_POST['proxy'];
        $proxies = explode("\n", $proxyList);
        $proxies = array_filter(array_map('trim', $proxies)); // Удаляем пустые строки и пробелы
        $proxies = array_unique($proxies); // Удаляем дубликаты прокси
        $totalProxies = count($proxies);

        if ($totalProxies == 0) {
            echo "<p>Не предоставлено прокси для обработки.</p>\n";
            exit;
        }

        // Инициализируем массив для детальной статистики по каждому прокси
        $proxyStats = [];
        foreach ($proxies as $proxy) {
            $proxyStats[$proxy] = [
                'active_count' => 0,
                'active_bots' => [],
                'inactive_count_before' => 0,
                'inactive_bots_before' => [],
                'inactive_count_after' => 0,
                'inactive_bots_after' => []
            ];
        }

        // Получаем информацию об использовании прокси среди активных ботов
        $placeholders = implode(',', array_fill(0, count($proxies), '?'));
        $stmt = $pdo->prepare("SELECT proxy, id FROM bots_data WHERE active=1 AND proxy IN ($placeholders)");
        $stmt->execute(array_values($proxies));
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($results as $row) {
            $proxy = $row['proxy'];
            $botId = $row['id'];
            if (isset($proxyStats[$proxy])) {
                $proxyStats[$proxy]['active_count']++;
                $proxyStats[$proxy]['active_bots'][] = $botId;
            }
        }

        // Получаем информацию об использовании прокси среди неактивных ботов (до обновления)
        $stmt = $pdo->prepare("SELECT proxy, id FROM bots_data WHERE active=0 AND proxy IN ($placeholders)");
        $stmt->execute(array_values($proxies));
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($results as $row) {
            $proxy = $row['proxy'];
            $botId = $row['id'];
            if (isset($proxyStats[$proxy])) {
                $proxyStats[$proxy]['inactive_count_before']++;
                $proxyStats[$proxy]['inactive_bots_before'][] = $botId;
            }
        }

        // Инициализируем общий счётчик использования прокси (активные боты)
        $proxyTotalUsageCounts = [];
        foreach ($proxyStats as $proxy => $stats) {
            $proxyTotalUsageCounts[$proxy] = $stats['active_count'];
        }

        // Получаем всех ботов, где active=0 и login!=''
        $stmt = $pdo->query("SELECT id FROM bots_data WHERE active=0 AND login!='' ORDER BY id ASC");
        $botsToUpdate = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $totalBotsToUpdate = count($botsToUpdate);
        if ($totalBotsToUpdate == 0) {
            echo "<p>Не найдено неактивных ботов для обновления.</p>\n";
            exit;
        }

        $successCount = 0;
        $errorMessages = [];
        $updates = []; // Для хранения информации об обновлениях

        // Распределяем прокси среди ботов, минимизируя повторения среди active=1
        foreach ($botsToUpdate as $botId) {
            // Сортируем прокси по общему счётчику использования
            asort($proxyTotalUsageCounts);
            // Получаем прокси с наименьшим количеством использований
            reset($proxyTotalUsageCounts);
            $leastUsedProxy = key($proxyTotalUsageCounts);

            // Обновляем бота выбранным прокси
            try {
                $stmt = $pdo->prepare("UPDATE bots_data SET proxy = :proxy WHERE id = :id AND active=0 AND login!=''");
                $stmt->bindParam(':proxy', $leastUsedProxy);
                $stmt->bindParam(':id', $botId, PDO::PARAM_INT);
                $stmt->execute();
                $successCount++;

                // Сохраняем информацию об обновлении
                $updates[] = [
                    'bot_id' => $botId,
                    'assigned_proxy' => $leastUsedProxy
                ];

                // Увеличиваем общий счётчик использования прокси
                $proxyTotalUsageCounts[$leastUsedProxy]++;

                // Обновляем статистику прокси
                $proxyStats[$leastUsedProxy]['inactive_count_after']++;
                $proxyStats[$leastUsedProxy]['inactive_bots_after'][] = $botId;
            } catch (PDOException $e) {
                $errorMessages[] = "Ошибка при обновлении прокси '{$leastUsedProxy}' для бота ID {$botId}: " . $e->getMessage();
            }
        }

        // Выводим результат
        echo "<p>Всего предоставлено прокси: {$totalProxies}</p>\n";
        echo "<p>Всего неактивных ботов для обновления: {$totalBotsToUpdate}</p>\n";
        echo "<p>Прокси были распределены среди неактивных ботов.</p>\n";
        echo "<p>Успешно обновлены прокси для {$successCount} ботов.</p>\n";

        // Выводим подробную информацию об обновлениях
        if (!empty($updates)) {
            echo "<h3>Обновленные записи:</h3>\n<ul>\n";
            foreach ($updates as $update) {
                echo "<li>Бот ID <strong>{$update['bot_id']}</strong> назначен прокси '<strong>{$update['assigned_proxy']}</strong>'</li>\n";
            }
            echo "</ul>\n";
        }

        // Выводим максимально подробную статистику по каждому прокси
        echo "<h3>Детальная статистика по каждому прокси:</h3>\n";
        foreach ($proxyStats as $proxy => $stats) {
            echo "<h4>Прокси: <strong>{$proxy}</strong></h4>\n";
            echo "<ul>\n";
            echo "<li>Используется активными ботами: <strong>{$stats['active_count']}</strong> раз(а)</li>\n";
            if (!empty($stats['active_bots'])) {
                echo "<li>ID активных ботов: " . implode(', ', $stats['active_bots']) . "</li>\n";
            }
            echo "<li>Использовался неактивными ботами (до обновления): <strong>{$stats['inactive_count_before']}</strong> раз(а)</li>\n";
            if (!empty($stats['inactive_bots_before'])) {
                echo "<li>ID неактивных ботов (до обновления): " . implode(', ', $stats['inactive_bots_before']) . "</li>\n";
            }
            echo "<li>Используется неактивными ботами (после обновления): <strong>{$stats['inactive_count_after']}</strong> раз(а)</li>\n";
            if (!empty($stats['inactive_bots_after'])) {
                echo "<li>ID неактивных ботов (после обновления): " . implode(', ', $stats['inactive_bots_after']) . "</li>\n";
            }
            echo "</ul>\n";
        }

        if (!empty($errorMessages)) {
            echo "<h3>Обнаружены ошибки:</h3>\n<ul>\n";
            foreach ($errorMessages as $error) {
                echo "<li>$error</li>\n";
            }
            echo "</ul>\n";
        }
    } else {
        echo "<p>Переменная 'proxy' не найдена в POST-запросе.</p>\n";
    }
} else {
    echo "<p>Неверный метод запроса.</p>\n";
}

?>
