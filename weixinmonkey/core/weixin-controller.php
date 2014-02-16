<?php
require_once (dirname ( __FILE__ ) . '/constants.php');
require_once (dirname ( __FILE__ ) . '/WPGenerateReturnService.php');
class weixinCallback {
	public $debug =0;
	public $content = "";
	
	public function valid() {
		
		$echoStr = $_GET ['echostr'];
		
		// valid signature , option
		if ($this->checkSignature ()) {
			echo $echoStr;
			$this->responseMsg ();
			
			exit ();
		}
	}
	public function responseMsg() {
		// get post data, May be due to the different environments
		$postStr = $GLOBALS ['HTTP_RAW_POST_DATA'];
		if($this->debug===1){
			$postStr = $this->content;
		}
		
		// extract post data
		if (! empty ( $postStr )) {
				
			$options = get_kweixinrobot_option ();
			$holdtime = $options [KWR_MESSAGE_HOLDTIME];
			
			$deltime = date ( 'Y-m-d H:i:s', strtotime ( "-$holdtime day" ) );
			RecievedMsgDao::deleteSinceWhen ( $deltime );
			

			$wgs = new WPGenerateReturnService();
			$returnmsg = $wgs->process ( $postStr );
			
			
			$msglog = Array (
					'msg' => $postStr
			);
			
			if(strlen($returnmsg)>0){
				$msglog['reply'] = $returnmsg;
				$msglog['replydate'] =date('Y-m-d H:i:s',time());
			}
			
			RecievedMsgDao::save ( $msglog );
			
			
			echo $returnmsg;
		} else {
			echo "";
			exit ();
		}
	}
	public function get_item($title, $description, $picUrl, $url) {
		if (! $description)
			$description = $title;
		
		return '
        <item>
            <Title><![CDATA[' . $title . ']]></Title>
            <Discription><![CDATA[' . $description . ']]></Discription>
            <PicUrl><![CDATA[' . $picUrl . ']]></PicUrl>
            <Url><![CDATA[' . $url . ']]></Url>
        </item>
        ';
	}
	private function checkSignature() {
		$signature = $_GET ["signature"];
		$timestamp = $_GET ["timestamp"];
		$nonce = $_GET ["nonce"];
		
		$weixin_token = apply_filters ( 'weixin_token', WEIXIN_TOKEN );
		if (isset ( $_GET ['debug'] )) {
			echo "\n" . 'WEIXIN_TOKEN：' . $weixin_token;
		}
		$tmpArr = array (
				$weixin_token,
				$timestamp,
				$nonce 
		);
		sort ( $tmpArr );
		$tmpStr = implode ( $tmpArr );
		$tmpStr = sha1 ( $tmpStr );
		
		if ($tmpStr == $signature) {
			return true;
		} else {
			return false;
		}
	}
}
?>