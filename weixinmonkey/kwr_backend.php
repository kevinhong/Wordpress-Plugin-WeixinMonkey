<?php
add_action ( 'wp_ajax_updateoption', 'update_kweixinrobot_option' );
function update_kweixinrobot_option() {
	foreach ( $_POST as $key => $value ) {
		if (strpos ( $key, 'kwr-' ) === 0) {
			// echo $key . "=>" . var_dump ( $value ) . " ";
			update_option ( $key, $value );
		}
	}
	if (isset ( $_POST ['kwr-auto-reply'] )) {
		$auto_reply = $_POST ['kwr-auto-reply'];
		
		if ($auto_reply != 1) {
			$auto_reply = 0;
		}
		update_option ( 'kwr-auto-reply', $auto_reply );
	}
	
	if (isset ( $_POST ['kwr-appid'] ) && isset ( $_POST ['kwr-appsecret'] )) {
		$appid = $_POST ['kwr-appid'];
		$appsecret = $_POST ['kwr-appsecret'];
		WeixinApi::getAutoAccessToken ();
	}
	
	echo "保存设置成功";
	die ();
}

add_action ( 'wp_ajax_deletecustomreply', 'deletecustomreply' );
function deletecustomreply() {
	$replyid = $_POST ['delid'];
	$dbrtn = CustomReplyDao::del ( $replyid );
	// ---sort
	$rtntable = Array (
			's' => $dbrtn,
			"rid" => $replyid 
	);
	echo json_encode ( $rtntable );
	
	die ();
}

add_action ( 'wp_ajax_delcustommenu', 'delcustommenu' );
function delcustommenu() {
	$replyid = $_POST ['delid'];
	$custommenus = CustomMenuDao::getsubmenus ( $replyid );
	if (count ( $custommenus ) > 0) {
		echo "删除自定义菜单失败，因为该菜单下含有子菜单";
	} else {
		$dbrtn = CustomMenuDao::del ( $replyid );
		if ($dbrtn >= 1) {
			echo "删除自定义菜单成功";
		} else {
			echo "删除自定义菜单失败";
		}
	}
	
	die ();
}
add_action ( 'wp_ajax_updatecustomreply', 'update_kweixinrobot_customrpy' );
function update_kweixinrobot_customrpy() {
	$crply = array ();
	foreach ( $_POST as $key => $value ) {
		if (strpos ( $key, 'kwrq-' ) === 0) {
			$qword = substr ( $key, 5 - strlen ( $key ) );
			$crply [$qword] = stripcslashes ( $value );
		}
	}
	if (! $crply ['qword']) {
		echo "关键字必须输入";
	} else if (! $crply ['reply']) {
		echo "回复必须输入";
	} else {
		$needgetqrcode = false;
		if ($crply ['id'] > 0 && $crply ['isqrvalid'] == 1) {
			$old = CustomReplyDao::query ( $crply ['id'] );
			if (isset ( $old ) && strlen ( $old ['qrticket'] ) == 0) {
				$needgetqrcode = true;
				echo 'sssss';
			}
		} else if ($crply ['id'] == 0 && $crply ['isqrvalid'] == 1) {
			
			$needgetqrcode = true;
		}
		
		if ($needgetqrcode == true) {
			
			$accesstoken = WeixinApi::getAutoAccessToken ();
			if ($accesstoken != NULL) {
				$sceneid = CustomReplyDao::getNewSceneid ();
				if ($sceneid > 0) {
					$qrrtn = WeixinApi::fetchlongqrcode ( $sceneid, $accesstoken );
				} else {
					$qrrtn ['errmsg'] = '无法获取场景ID';
				}
				
				if (isset ( $qrrtn ['errmsg'] )) {
					echo "获取二维码失败 " . $qrrtn ['errmsg'] . "，";
					$crply ['isqrvalid'] = 0;
				} else {
					echo "获取二维码成功 ";
					$crply ['qrticket'] = $qrrtn ['ticket'];
					$crply ['qrsceneid'] = $sceneid;
					$crply ['isqrvalid'] = 1;
				}
			} else {
				$crply ['isqrvalid'] == 0;
				echo "无法获取AccrssToken，";
			}
		} else if ($crply ['isqrvalid'] == 0) {
			$crply ['qrticket'] = '';
			$crply ['qrsceneid'] = '';
			$crply ['isqrvalid'] = 0;
		}
		
		if ($crply ['id'] == 0) {
			$rtn = CustomReplyDao::insert ( $crply );
		} else {
			$rtn = CustomReplyDao::update ( $crply );
		}
		if ($rtn != false) {
			echo "保存自定义回复成功";
		} else {
			echo "保存自定义回复失败";
		}
	}
	die ();
}
add_action ( 'wp_ajax_getcustomreplies', 'getcustomreplies' );
function getcustomreplies() {
	$options = str_replace ( "\\", "", $_POST ['options'] );
	$optarray = Array ();
	foreach ( json_decode ( $options, true ) as $opt ) {
		$optarray [$opt ['name']] = $opt ['value'];
	}
	// keyword search
	$keyword = $optarray ['sSearch'];
	$queryResult = CustomReplyDao::queryall ();
	;
	// ---keyword search
	
	// page
	$iDisplayStart = $optarray ['iDisplayStart'];
	$iDisplayLength = $optarray ['iDisplayLength'];
	$iDisplayEnd = count ( $queryResult ) >= ($iDisplayStart + $iDisplayLength) ? ($iDisplayStart + $iDisplayLength) : count ( $queryResult );
	$rtn = Array ();
	$index = 0;
	for($i = $iDisplayStart; $i < $iDisplayEnd; $i ++) {
		
		$isvaild = $queryResult [$i] ['isvalid'];
		if ($isvaild >= 1) {
			$queryResult [$i] ['isvalid'] = "启用";
		} else {
			$queryResult [$i] ['isvalid'] = '禁用';
		}
		$customreplyjson = json_decode ( $queryResult [$i] ['reply'], true );
		
		if (NULL == $customreplyjson || ! is_array ( $customreplyjson )) {
			$queryResult [$i] ['type'] = '文本内容';
		} else {
			$queryResult [$i] ['type'] = '站点资源';
			;
		}
		$rtn [$index ++] = $queryResult [$i];
	}
	
	// --page
	
	// sort
	$iSortCol_0 = $optarray ['iSortCol_0'];
	$sSortDir_0 = $optarray ['sSortDir_0'];
	// ---sort
	$rtntable = Array (
			'sdssd' => count ( $queryResult ),
			
			'aaData' => $rtn,
			'sEcho' => $optarray ['sEcho'],
			'iTotalRecords' => count ( $queryResult ),
			'iTotalDisplayRecords' => count ( $queryResult ) 
	);
	echo json_encode ( $rtntable );
	
	die ();
}
add_action ( 'wp_ajax_getcustommenu', 'getcustommenu' );
function getcustommenu() {
	$options = str_replace ( "\\", "", $_POST ['options'] );
	$optarray = Array ();
	foreach ( json_decode ( $options, true ) as $opt ) {
		$optarray [$opt ['name']] = $opt ['value'];
	}
	
	$queryResult = CustomMenuDao::queryall ();
	$rtntable = Array (
			'sdssd' => count ( $queryResult ),
			'aaData' => $queryResult,
			'sEcho' => $optarray ['sEcho'],
			'iTotalRecords' => count ( $queryResult ),
			'iTotalDisplayRecords' => count ( $queryResult ) 
	);
	echo json_encode ( $rtntable );
	die ();
}
add_action ( 'wp_ajax_getcustommenubyid', 'getcustommenubyid' );
function getcustommenubyid() {
	$queryResult = CustomMenuDao::query ( $_POST ['id'] );
	
	echo json_encode ( $queryResult );
	die ();
}

add_action ( 'wp_ajax_getcustomreplybyid', 'getcustomreplybyid' );
function getcustomreplybyid() {
	$queryResult = CustomReplyDao::query ( $_POST ['id'] );
	
	echo json_encode ( $queryResult );
	die ();
}

add_action ( 'wp_ajax_replytouser', 'replytouser' );
function replytouser() {
	$msg = $_POST ['msg'];
	
	if (strlen ( $msg ) == 0) {
		echo "回复消息失败：消息内容不能为空";
		die ();
	}
	
	$queryResult = RecievedMsgDao::query ( $_POST ['id'] );
	if (count ( $queryResult ) > 0) {
		$rcv = $queryResult [0] ['msg'];
		$rcvObj = simplexml_load_string ( $rcv, 'SimpleXMLElement', LIBXML_NOCDATA );
		$touser = $rcvObj->ToUserName;
		
		$accesstoken = WeixinApi::getAutoAccessToken ();
		if ($accesstoken == NULL) {
			echo "回复消息失败：获取AccessToken失败，请确认您有正确权限或联系技术人员";
			die ();
		}
		$rtnjson = WeixinApi::replytextmsg ( $msg, $touser, $accesstoken );
		$errmsg = $rtnjson ['errmsg'];
		if ($rtnjson ['errcode'] === 0) {
			$queryResult ['reply'] = $msg;
			$queryResult ['replydate'] = date ( 'Y-m-d H:i:s', time () );
			
			RecievedMsgDao::update ( $queryResult );
			
			echo '回复消息成功';
		} else {
			echo "回复消息失败：$errmsg";
		}
		die ();
	}
	echo "找不到该消息";
	die ();
}

add_action ( 'wp_ajax_getcustomrootmenu', 'getcustomrootmenu' );
function getcustomrootmenu() {
	$queryResult = CustomMenuDao::queryall ();
	
	echo json_encode ( $queryResult );
	die ();
}
add_action ( 'wp_ajax_savecustommenu', 'savecustommenu' );
function savecustommenu() {
	$crply = array ();
	foreach ( $_POST as $key => $value ) {
		if (strpos ( $key, 'kwrq-custommenu-' ) === 0) {
			$qword = substr ( $key, 16 - strlen ( $key ) );
			$crply [$qword] = stripcslashes ( $value );
		}
	}
	
	if ($crply ['id'] == 0) {
		$rtn = CustomMenuDao::insert ( $crply );
	} else {
		$rtn = CustomMenuDao::update ( $crply );
	}
	if ($rtn != false) {
		echo "保存自定义菜单成功";
	} else {
		echo "保存自定义菜单失败";
	}
	
	die ();
}

add_action ( 'wp_ajax_uploadcustommenu', 'uploadcustommenu' );
function uploadcustommenu() {
	$mainbutton = array ();
	
	$queryResult = CustomMenuDao::queryall ( $mainbutton );
	
	$rtn = json_encode ( $mainbutton );
	$accesstoken = WeixinApi::getAutoAccessToken ();
	if ($accesstoken == NULL) {
		echo "自定义菜单同步失败：获取AccessToken失败，请确认您有正确权限或联系技术人员";
		die ();
	}
	$rtnjson = WeixinApi::uploadmenu ( $rtn, $accesstoken );
	$errmsg = $rtnjson ['errmsg'];
	if ($rtnjson ['errcode'] === 0) {
		echo '自定义菜单同步成功';
	} else {
		echo "自定义菜单同步失败：$errmsg";
	}
	die ();
}
add_action ( 'wp_ajax_getrecievedmsgs', 'getrecievedmsgs' );
function getrecievedmsgs() {
	$options = str_replace ( "\\", "", $_POST ['options'] );
	$optarray = Array ();
	foreach ( json_decode ( $options, true ) as $opt ) {
		$optarray [$opt ['name']] = $opt ['value'];
	}
	// keyword search
	$keyword = $optarray ['sSearch'];
	$queryResult = RecievedMsgDao::querybykeyword ( $keyword );
	// ---keyword search
	
	// page
	$iDisplayStart = $optarray ['iDisplayStart'];
	$iDisplayLength = $optarray ['iDisplayLength'];
	$iDisplayEnd = count ( $queryResult ) >= ($iDisplayStart + $iDisplayLength) ? ($iDisplayStart + $iDisplayLength) : count ( $queryResult );
	$rtn = Array ();
	$index = 0;
	for($i = $iDisplayStart; $i < $iDisplayEnd; $i ++) {
		$msg = $queryResult [$i] ['msg'];
		$postObj = simplexml_load_string ( $msg, 'SimpleXMLElement', LIBXML_NOCDATA );
		$fromUsername = $postObj->FromUserName;
		$toUsername = $postObj->ToUserName;
		
		$msgType = strtolower ( trim ( $postObj->MsgType ) );
		
		if ($msgType == 'event') {
			$keywords = strtolower ( trim ( $postObj->Event ) );
		} else {
			$keywords = strtolower ( trim ( $postObj->Content ) );
		}
		
		// $queryResult [$i]['msg'] = "来自：$fromUsername<br>至：$toUsername<br>消息类型：$msgType<br>内容：$keywords";
		$queryResult [$i] ['msg'] = $keywords;
		$queryResult [$i] ['type'] = $msgType;
		
		if (strlen ( $queryResult [$i] ['reply'] ) > 0) {
			$queryResult [$i] ['status'] = '已回复';
		} else {
			$queryResult [$i] ['status'] = '未回复';
		}
		
		$rtn [$index ++] = $queryResult [$i];
	}
	
	// --page
	
	// sort
	$iSortCol_0 = $optarray ['iSortCol_0'];
	$sSortDir_0 = $optarray ['sSortDir_0'];
	// ---sort
	$rtntable = Array (
			'sdssd' => count ( $queryResult ),
			
			'aaData' => $rtn,
			'sEcho' => $optarray ['sEcho'],
			'iTotalRecords' => count ( $queryResult ),
			'iTotalDisplayRecords' => count ( $queryResult ) 
	);
	echo json_encode ( $rtntable );
	
	die ();
}

?>