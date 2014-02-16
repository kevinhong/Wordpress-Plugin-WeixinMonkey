<?php
/** custom message **/
function kweixinrobot_topbarmessage($msg) {
	echo '<div class="alert  alert-warning alert-dismissable"><p>' . $msg . '</p></div>';
}
function getdistance($lng1, $lat1, $lng2, $lat2) {
	// 将角度转为狐度
	$radLat1 = deg2rad ( $lat1 ); // deg2rad()函数将角度转换为弧度
	$radLat2 = deg2rad ( $lat2 );
	$radLng1 = deg2rad ( $lng1 );
	$radLng2 = deg2rad ( $lng2 );
	$a = $radLat1 - $radLat2;
	$b = $radLng1 - $radLng2;
	$s = 2 * asin ( sqrt ( pow ( sin ( $a / 2 ), 2 ) + cos ( $radLat1 ) * cos ( $radLat2 ) * pow ( sin ( $b / 2 ), 2 ) ) ) * 6378.137 * 1000;
	return $s;
}

?>
