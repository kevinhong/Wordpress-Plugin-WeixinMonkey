<?php
class WeixinApi {
	public static function getAccessToken($appid, $appsecret) {
		$url = ("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$appid&secret=$appsecret");
		$ch = curl_init ();
		curl_setopt ( $ch, CURLOPT_URL, $url );
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt ( $ch, CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt ( $ch, CURLOPT_SSL_VERIFYHOST, false );
		$result = curl_exec ( $ch );
		$resultjson = json_decode ( $result, true );
		return $resultjson;
	}
	
	public static function uploadmenu($json, $accesstoken) {
		$url = ("https://api.weixin.qq.com/cgi-bin/menu/create?access_token=$accesstoken");
		$ch = curl_init ();
		curl_setopt ( $ch, CURLOPT_URL, $url );
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt ( $ch, CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt ( $ch, CURLOPT_SSL_VERIFYHOST, false );
		curl_setopt ( $ch, CURLOPT_POST, 1 ); // 设置为POST方式
		curl_setopt ( $ch, CURLOPT_POSTFIELDS, $json ); // POST数据
		
		$result = curl_exec ( $ch );
		$resultjson = json_decode ( $result, true );
		return $resultjson;
	}
	public static function fetchlongqrcode($sceneid,$accesstoken){
		$url = ("https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=$accesstoken");
		$postarray = array (
				'action_name' => 'QR_LIMIT_SCENE',
				'action_info' => array ('scene'=>array('scene_id'=>$sceneid))
		);
		
		$json = json_encode($postarray);
		
		$ch = curl_init ();
		curl_setopt ( $ch, CURLOPT_URL, $url );
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt ( $ch, CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt ( $ch, CURLOPT_SSL_VERIFYHOST, false );
		curl_setopt ( $ch, CURLOPT_POST, 1 ); // 设置为POST方式
		curl_setopt ( $ch, CURLOPT_POSTFIELDS, $json ); // POST数据
		
		$result = curl_exec ( $ch );
		$resultjson = json_decode ( $result, true );
		return $resultjson;
	}
	public static function replytextmsg($msg, $touseropenid, $accesstoken) {
		$url = ("https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=$accesstoken");
		$postarray = array (
				'touser' => $touseropenid,
				'msgtype' => 'text',
				'text' => array ('content'=>$msg) 
		);
		$json = json_encode($postarray);
		
		$ch = curl_init ();
		curl_setopt ( $ch, CURLOPT_URL, $url );
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, true );
		curl_setopt ( $ch, CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt ( $ch, CURLOPT_SSL_VERIFYHOST, false );
		curl_setopt ( $ch, CURLOPT_POST, 1 ); // 设置为POST方式
		curl_setopt ( $ch, CURLOPT_POSTFIELDS, $json ); // POST数据
		
		$result = curl_exec ( $ch );
		$resultjson = json_decode ( $result, true );
		return $resultjson;
	}
	public static function getAutoAccessToken() {
		$deltime = get_option ( 'kwr-accesstoken-expriesin' );
		$accesstoken = get_option ( "kwr-accesstoken" );
		
		$result = strtotime ( date ( "Y-m-d H:i:s" ) ) - strtotime ( $deltime );
		if ($result > 0 || strlen ( $accesstoken ) == 0) {
			// 已经过期
			$appid = get_option ( 'kwr-appid' );
			$appsecret = get_option ( 'kwr-appsecret' );
			if (strlen ( $appid ) > 0 && strlen ( $appsecret ) > 0) {
				$resultjson = WeixinApi::getAccessToken ( $appid, $appsecret );
				if ($resultjson != NULL && isset ( $resultjson ['access_token'] )) {
					$accesstoken = $resultjson ['access_token'];
					$expresin = $resultjson ['expires_in'];
					$deltime = date ( 'Y-m-d H:i:s', strtotime ( "+$expresin second" ) );
					update_option ( 'kwr-accesstoken', $accesstoken );
					update_option ( 'kwr-accesstoken-expriesin', $deltime );
					return $accesstoken;
				} else {
					return NULL;
				}
			} else {
				return NULL;
			}
		} else {
			return $accesstoken;
		}
	}
}

?>