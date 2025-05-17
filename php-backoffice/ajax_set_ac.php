<?php
require_once('/var/www/localhost/bot/functions.php'); 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['sData'])) {
        
        $sData = $_POST['sData']; 

        $lines = explode("\n", $sData);
        $delimiters = array(';', '|', ':');
        $totalAccounts = 0;
        $updatedCount = 0;
        $noRowCount = 0;
        $existingAccountCount = 0;
        $errors = array();
        $updIdList = array(); 

        foreach ($lines as $lineNumber => $line) {
            $line = trim($line);
            if (empty($line)) continue;

            $totalAccounts++;

            $fields = null;
            $login = null;
            $password = null;

            // Try different delimiters
            foreach ($delimiters as $delimiter) {
                $fields = explode($delimiter, $line);
                if (count($fields) >= 2) {
                    $login = $fields[0];
                    $password = $fields[1];
                    break;
                }
            }

            if (!isset($login) || !isset($password)) {
                // Could not parse the line
                $errors[] = "Строка " . ($lineNumber + 1) . ": Не удалось распарсить строку '$line'";
                continue;
            }

            try {
                // Check if an account with this login already exists
                $checkStmt = $pdo->prepare("SELECT id FROM bots_data WHERE login = :login LIMIT 1");
                $checkStmt->execute(array(':login' => $login));
                $existingAccount = $checkStmt->fetch(PDO::FETCH_ASSOC);

                if ($existingAccount) {
                    echo "<p>Аккаунт с логином '<strong>$login</strong>' уже существует. Пропускаем эту строку.</p>\n";
                    $existingAccountCount++;
                    continue;
                }

                $selectStmt = $pdo->prepare("SELECT id FROM bots_data WHERE login='' AND active=0 LIMIT 1");
                $selectStmt->execute();
                $row = $selectStmt->fetch(PDO::FETCH_ASSOC);

                if ($row) {
                    $id = $row['id'];
                    // Update the row
                    $updateStmt = $pdo->prepare("UPDATE bots_data SET login=:login, password=:password, cookies='', localStorage='', time=NOW() WHERE id=:id");
                    $updateStmt->execute(array(':login' => $login, ':password' => $password, ':id' => $id));
                    echo "<p>Обновлена строка ID $id с логином '<strong>$login</strong>' и паролем '<strong>$password</strong>'</p>\n";
                    $updIdList[] = $id; 
                    $updatedCount++;
                } else {
                    echo "<p>Нет доступных строк для обновления для логина '<strong>$login</strong>'</p>\n";
                    $noRowCount++;
                    continue;
                }
            } catch (Exception $e) {
                $errors[] = "Строка " . ($lineNumber + 1) . ": Ошибка базы данных - " . $e->getMessage();
            }
        }

        // Get total accounts currently active and inactive in the table
        try {
            $activeStmt = $pdo->prepare("SELECT COUNT(*) FROM bots_data WHERE active=1");
            $activeStmt->execute();
            $activeCount = $activeStmt->fetchColumn();

            $inactiveStmt = $pdo->prepare("SELECT COUNT(*) FROM bots_data WHERE active=0");
            $inactiveStmt->execute();
            $inactiveCount = $inactiveStmt->fetchColumn();

            $inactiveLeftStmt = $pdo->prepare("SELECT COUNT(*) FROM bots_data WHERE active=0 and login=''");
            $inactiveLeftStmt->execute();
            $inactiveLeftCount = $inactiveLeftStmt->fetchColumn();

        } catch (Exception $e) {
            $errors[] = "Ошибка при подсчете активных и неактивных аккаунтов: " . $e->getMessage();
            $activeCount = 'неизвестно';
            $inactiveCount = 'неизвестно';
        }

        // Calculate remaining accounts from the list that were not processed
        $remainingAccounts = $totalAccounts - ($updatedCount + $existingAccountCount + $noRowCount + count($errors));

        // Output summary
        echo "<h3>Сводная статистика:</h3>\n";
        echo "<p><strong>Всего обработано аккаунтов:</strong> $totalAccounts</p>\n";
        if ($updatedCount > 0) {
            echo "<p><strong>Всего обновлено строк:</strong> $updatedCount</p>\n";
        }
        if ($existingAccountCount > 0) {
            echo "<p><strong>Аккаунтов пропущено (уже существуют):</strong> $existingAccountCount</p>\n";
        }
        if ($noRowCount > 0) {
            echo "<p><strong>Аккаунтов не обновлено (не найдены подходящие строки):</strong> $noRowCount</p>\n";
        }
        if ($remainingAccounts > 0) {
            echo "<p><strong>Аккаунтов не обработано (ошибки парсинга и др.):</strong> $remainingAccounts</p>\n";
        }
        echo "<p><strong>Всего аккаунтов активно в таблице:</strong> $activeCount</p>\n";
        echo "<p><strong>Всего аккаунтов неактивно в таблице:</strong> $inactiveCount</p>\n";
        echo "<p><strong>Всего аккаунтов неактивно с неустановленными данными в таблице:</strong> $inactiveLeftCount</p>\n";

        if (!empty($errors)) {
            echo "<h3>Обнаружены ошибки:</h3>\n<ul>\n";
            foreach ($errors as $error) {
                echo "<li>$error</li>\n";
            }
            echo "</ul>\n";
        }

        if (!empty($updIdList)) {

            echo "<h3>Список айди обновленных аккаунтов:</h3>\n";
            echo '<p>'.implode(',', $updIdList).'</p>'; 

        }

    } else {
        echo "<p>Переменная 'sData' не найдена в POST-запросе.</p>\n";
    }
} else {
    echo "<p>Неверный метод запроса.</p>\n";
}
?>