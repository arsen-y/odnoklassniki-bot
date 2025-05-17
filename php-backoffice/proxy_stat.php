<?php
require_once('/var/www/localhost/bot/functions.php'); 

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['proxy_list'])) {
            $proxyList = $_POST['proxy_list'];
            $proxies = explode("\n", $proxyList);
            $proxies = array_filter(array_map('trim', $proxies)); // Remove empty lines and trim spaces
            $proxies = array_unique($proxies); // Remove duplicate proxies

            if (empty($proxies)) {
                echo "<p>No proxies provided.</p>\n";
                exit;
            }

            // Prepare named placeholders for the IN clause
            $placeholders = [];
            $params = [];
            foreach ($proxies as $index => $proxy) {
                $key = ':proxy' . $index;
                $placeholders[] = $key;
                $params[$key] = $proxy;
            }
            $inClause = implode(',', $placeholders);

            // Fetch statistics for the provided proxies
            $stmt = $pdo->prepare("
                SELECT 
                    proxy,
                    COUNT(*) as total_count,
                    SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as active_count,
                    SUM(CASE WHEN active = 0 THEN 1 ELSE 0 END) as inactive_count
                FROM bots_data
                WHERE proxy IN ($inClause)
                GROUP BY proxy
            ");
            $stmt->execute($params);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Initialize the statistics array with zeros
            $proxyStats = [];
            foreach ($proxies as $proxy) {
                $proxyStats[$proxy] = [
                    'proxy' => $proxy,
                    'total_count' => 0,
                    'active_count' => 0,
                    'inactive_count' => 0
                ];
            }

            // Overwrite the counts with actual data from the database
            foreach ($results as $row) {
                $proxy = $row['proxy'];
                $proxyStats[$proxy] = [
                    'proxy' => $proxy,
                    'total_count' => $row['total_count'],
                    'active_count' => $row['active_count'],
                    'inactive_count' => $row['inactive_count']
                ];
            }

            // Convert the associative array to a numeric array for sorting
            $proxyStats = array_values($proxyStats);

            // Calculate total active and inactive accounts
            $totalActive = 0;
            $totalInactive = 0;
            foreach ($proxyStats as $stat) {
                $totalActive += $stat['active_count'];
                $totalInactive += $stat['inactive_count'];
            }

            // Start output buffering to capture the HTML content
            ob_start();
            ?>
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Proxy Usage Statistics</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <!-- Embedded CSS for styling -->
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f5f7fa;
                    }
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    h2 {
                        text-align: center;
                        margin-bottom: 20px;
                        color: #333;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        padding: 12px 15px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        background-color: #007BFF;
                        color: #ffffff;
                        position: sticky;
                        top: 0;
                        cursor: pointer;
                    }
                    tr:hover {
                        background-color: #f1f1f1;
                    }
                    .icon {
                        width: 16px;
                        height: 16px;
                        vertical-align: middle;
                        margin-right: 5px;
                    }
                    .green {
                        color: green;
                    }
                    .red {
                        color: red;
                    }
                    .summary {
                        font-size: 18px;
                        margin-top: 20px;
                    }
                    .summary p {
                        margin: 5px 0;
                    }
                    @media (max-width: 768px) {
                        th, td {
                            padding: 10px;
                        }
                        .icon {
                            width: 14px;
                            height: 14px;
                        }
                    }
                    @media (max-width: 480px) {
                        table, thead, tbody, th, td, tr {
                            display: block;
                        }
                        th {
                            position: relative;
                        }
                        tr {
                            margin-bottom: 15px;
                        }
                        th, td {
                            text-align: right;
                            padding-left: 50%;
                            position: relative;
                        }
                        th::before, td::before {
                            content: attr(data-label);
                            position: absolute;
                            left: 15px;
                            width: calc(50% - 30px);
                            white-space: nowrap;
                            text-align: left;
                            font-weight: bold;
                        }
                    }
                </style>
                <!-- JavaScript for sorting -->
                <script>
                    document.addEventListener('DOMContentLoaded', function() {
                        const table = document.querySelector('table');
                        const headers = table.querySelectorAll('th');
                        const tableBody = table.querySelector('tbody');
                        const rows = tableBody.querySelectorAll('tr');

                        // Track sort directions
                        const directions = Array.from(headers).map(function(header) {
                            return '';
                        });

                        // Transform the content of given cell in given column
                        const transform = function(index, content) {
                            // Get the data type of column
                            const type = headers[index].getAttribute('data-type');
                            switch (type) {
                                case 'number':
                                    return parseFloat(content);
                                case 'string':
                                default:
                                    return content.toLowerCase();
                            }
                        };

                        const sortColumn = function(index) {
                            // Get the current direction
                            let direction = directions[index] || 'asc';

                            // A factor based on the direction
                            const multiplier = direction === 'asc' ? 1 : -1;

                            const newRows = Array.from(rows);

                            newRows.sort(function(rowA, rowB) {
                                const cellA = rowA.querySelectorAll('td')[index].innerText;
                                const cellB = rowB.querySelectorAll('td')[index].innerText;

                                const a = transform(index, cellA);
                                const b = transform(index, cellB);

                                if (a > b) {
                                    return 1 * multiplier;
                                }
                                if (a < b) {
                                    return -1 * multiplier;
                                }
                                return 0;
                            });

                            // Remove old rows
                            [].forEach.call(rows, function(row) {
                                tableBody.removeChild(row);
                            });

                            // Append new row
                            newRows.forEach(function(newRow) {
                                tableBody.appendChild(newRow);
                            });

                            // Toggle the direction
                            directions[index] = direction === 'asc' ? 'desc' : 'asc';
                        };

                        // Attach click event to headers
                        [].forEach.call(headers, function(header, index) {
                            header.addEventListener('click', function() {
                                sortColumn(index);
                            });
                        });
                    });
                </script>
            </head>
            <body>
                <div class="container">
                    <h2>Proxy Usage Statistics, proxy count: <?php echo count($proxies); ?></h2>
                    <table>
                        <thead>
                            <tr>
                                <th data-type="string">Proxy</th>
                                <th data-type="number">Total Uses</th>
                                <th data-type="number">Active Bots</th>
                                <th data-type="number">Inactive Bots</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($proxyStats as $stat): ?>
                                <?php
                                $proxyDisplay = ($stat['proxy'] === null || $stat['proxy'] === '') ? '[Empty]' : htmlspecialchars($stat['proxy']);
                                ?>
                                <tr>
                                    <td data-label="Proxy">
                                        <!-- SVG icon for proxy -->
                                        <svg class="icon" viewBox="0 0 16 16" fill="#007BFF" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 2a2 2 0 00-2 2v4h1V4a1 1 0 011-1h4V2H4zm0 12a2 2 0 01-2-2v-4h1v4a1 1 0 001 1h4v1H4zm8-12a2 2 0 012 2v4h-1V4a1 1 0 00-1-1H8V2h4zm2 10a2 2 0 01-2 2H8v-1h4a1 1 0 001-1v-4h1v4z"/>
                                        </svg>
                                        <?php echo $proxyDisplay; ?>
                                    </td>
                                    <td data-label="Total Uses"><?php echo $stat['total_count']; ?></td>
                                    <td data-label="Active Bots">
                                        <span class="green"><?php echo $stat['active_count']; ?></span>
                                    </td>
                                    <td data-label="Inactive Bots">
                                        <span class="red"><?php echo $stat['inactive_count']; ?></span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <div class="summary">
                        <p><strong>Total Active Accounts:</strong> <?php echo $totalActive; ?></p>
                        <p><strong>Total Inactive Accounts:</strong> <?php echo $totalInactive; ?></p>
                    </div>
                </div>
            </body>
            </html>
            <?php
            // Output the content
            echo ob_get_clean();
        } else {
            echo "<p>The 'proxy_list' parameter is missing in the POST request.</p>\n";
        }
    } else {
        echo "<p>Invalid request method.</p>\n";
    }
} catch (Exception $e) {
    echo "<p>An error occurred: " . $e->getMessage() . "</p>\n";
}
?>
