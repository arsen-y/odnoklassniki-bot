<?php

require_once('./includes/func.php');

header('Content-Type: text/plain; charset=utf-8');
header("Cache-Control: no-cache");
header("Expires: -1"); 
header('Pragma: no-cache');

$proxy = trim($_POST['proxy']);
$count_req = intval($_POST['count_req']);

$n = rand(74, 84);
$n2 = rand(0, 99);

$agent[0] = 'Mozilla/5.0 (Linux x86_64; rv:'.$n.'.'.$n2.') Gecko/20100101 Firefox/'.$n.'.'.$n2;
$agent[1] = 'Mozilla/5.0 (X11; Linux i686; rv:'.$n.'.'.$n2.') Gecko/20100101 Firefox/'.$n.'.'.$n2;
$agent[2] = 'Mozilla/5.0 (Linux x86_64; rv:'.$n.'.'.$n2.') Gecko/20100101 Firefox/'.$n.'.'.$n2;
$agent[3] = 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:'.$n.'.'.$n2.') Gecko/20100101 Firefox/'.$n.'.'.$n2;
$agent[4] = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:'.$n.'.'.$n2.') Gecko/20100101 Firefox/'.$n.'.'.$n2;

$agn = rand(0,4);
$ag = $agent[$agn];
$i = $count_req;

while($i > 0) {
	
	$i--;
	
	$addr_req = 'https://google.ru';

	$response = curl_getpage($addr_req, $ag, $proxy);

	if($response['errno'] != 0) {
		
		echo '<span style="color:red"><b>proxy error: '.$response['errmsg'].'</b></span>';
		
	} else {
		
		echo 'response time '.htmlspecialchars($response['total_time']);
		
	}

	echo '<br>';
		
}
	
?>
