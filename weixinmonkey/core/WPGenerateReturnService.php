<?php
require_once (dirname ( __FILE__ ) . '/constants.php');
require_once (dirname ( __FILE__ ) . '/Utils.php');
require_once (dirname ( __FILE__ ) . '/RecievedMsgDao.php');
require_once (dirname ( __FILE__ ) . '/WPQueryService.php');
class WPGenerateReturnService {
	private $textTpl = '<xml>
                        <ToUserName><![CDATA[%s]]></ToUserName>
                        <FromUserName><![CDATA[%s]]></FromUserName>
                        <CreateTime>%d</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[%s]]></Content>
                        <FuncFlag>0</FuncFlag>
                        </xml>';
	private $picTpl = ' <xml>
                        <ToUserName><![CDATA[%s]]></ToUserName>
                        <FromUserName><![CDATA[%s]]></FromUserName>
                        <CreateTime>%d</CreateTime>
                        <MsgType><![CDATA[news]]></MsgType>
                        <Content><![CDATA[]]></Content>
                        <ArticleCount>%d</ArticleCount>
                        <Articles>
                        %s
                        </Articles>
                         <FuncFlag>1</FuncFlag>
                        </xml>';
	private $qservice;
	private $options;
	private $postObj;
	private $result;
	function __construct() {
		$this->options = get_kweixinrobot_option ();
		$this->result = '';
		$textTpl = $this->textTpl;
		$picTpl = $this->picTpl;
		$this->qservice = new WPQueryService ();
	}
	public function process($data, $keywords = NULL) {
		$this->postObj = simplexml_load_string ( $data, 'SimpleXMLElement', LIBXML_NOCDATA );
		
		$msgType = strtolower ( trim ( $this->postObj->MsgType ) );
		if ($keywords == NULL) {
			if ($msgType == 'event') {
				if ($this->postObj->Event == 'LOCATION') {
					// 地理位事件
					$lat = $this->postObj->Latitude;
					$long = $this->postObj->Longitude;
					$center = $this->options ['KWR_GEOSETTINGS_CENTER'];
					$radis = $this->options ['KWR_GEOSETTINGS_RADIS'];
					
					if (isset ( $center ) && isset ( $radis )) {
						$centerarray = split ( ',', $center );
						$centerlng = $centerarray [0];
						$centerlat = $centerarray [1];
						$distance = getdistance ( $long, $lat, $centerlng, $centerlat );
						if ($distance <= $radis) {
							$keywords = $this->options ['KWR_GEOSETTINGS_INFO'];
						} else {
							return '';
						}
					}
				} else if (($msgType == 'event' && strpos ( $this->postObj->EventKey, 'qrscene_' ) >= 0) || $this->postObj->Event == 'SCAN') {
					// 二维码消息
					$sceneid = '';
					if (strpos ( $this->postObj->EventKey, 'qrscene_' ) >= 0) {
						$sceneid = substr ( $this->postObj->EventKey, strpos ( $this->postObj->EventKey, 'qrscene_' ) + strlen ( 'qrscene_' ) );
					} else {
						$sceneid = $this->postObj->EventKey;
					}
					$reply = CustomReplyDao::querybysceneid($sceneid);
					$keywords = $reply['qword'];
					
				} else if (($msgType == 'event' && $this->postObj->EventKey == 'CLICK')) {
					// 自定义菜单点击事件
					$keywords = strtolower ( trim ( $this->postObj->EventKey ) );
				} else {
					$keywords = strtolower ( trim ( $this->postObj->Event ) );
				}
			} else {
				
				$keywords = strtolower ( trim ( $this->postObj->Content ) );
			}
		}
		
		$rtn = $this->getContent ( $keywords );
		
		return $rtn;
	}
	public function getContent($keywords) {
		$rtn = "";
		
		$keywordArray = explode ( $this->options [KWR_CMD_SEPERATOR], $keywords, 2 );
		if (is_array ( $keywordArray )) {
			$keyword = $keywordArray [0];
			$this->qservice->arg = $keywordArray [1];
		} else {
			$keyword = $keywordArray;
		}
		
		$this->getContentByKeyword ( $keyword, 0 );
		
		$time = time ();
		$fromUsername = $this->postObj->FromUserName;
		$toUsername = $this->postObj->ToUserName;
		$result = $this->result;
		
		if (substr_count ( $result, '<item>' ) > 0) {
			$rtn = sprintf ( $this->picTpl, $fromUsername, $toUsername, $time, substr_count ( $result, '<item>' ), $result );
		} else if (strlen ( $result ) > 0) {
			$rtn = sprintf ( $this->textTpl, $fromUsername, $toUsername, $time, $result );
		} else if ($this->options [KWR_AUTO_REPLY] == 1) {
			$weixin_not_found = $this->options [KWR_KEYWORD_ERROR_WARNING];
			$rtn = sprintf ( $this->textTpl, $fromUsername, $toUsername, $time, $weixin_not_found );
		} else {
			$rtn = "";
		}
		return $rtn;
	}
	public function getTextMessage($fromUser, $toUser, $content) {
		return sprintf ( $this->textTpl, $fromUser, $toUser, time (), $content );
	}
	private function getContentByKeyword($keyword, $num) {
		$rtn = '';
		
		$customreply = CustomReplyDao::querybyqword ( $keyword );
		
		if (NULL != $customreply && $customreply ['isvalid'] == 1) {
			$customreplyjson = json_decode ( $customreply ['reply'], true );
			if (NULL == $customreplyjson || ! is_array ( $customreplyjson )) {
				$this->result = $customreply ["reply"];
			} else {
				foreach ( $customreplyjson as $value ) {
					if (isset ( $customreplyjson ['ref'] )) {
						$ref = $customreplyjson ['ref'];
						$nump = 0;
						if (isset ( $customreplyjson ['num'] )) {
							$nump = $customreplyjson ['num'];
						}
						$customreply = CustomReplyDao::querybyqword ( $ref );
						$this->getContentByKeyword ( '$ref', $nump );
					} else {
						$this->qservice->sargs = $value;
						$this->qservice->articleCountLimit = $num;
						$this->qservice->query ();
						if ($this->qservice->articleCount > 0) {
							// echo $this->qservice->items;
							$this->result = $this->result . $this->qservice->items;
							$this->qservice->items = '';
						}
					}
				}
			}
		} elseif (Utils::isWordInSentence ( $this->options [KWR_WELCOME_CMD], $keyword ) || (NULL != $this->postObj->Event && $this->postObj->Event == 'subscribe')) {
			// welcome
			$weixin_welcome = $this->options [KWR_WELCOME];
			$weixin_welcome = apply_filters ( 'weixin_welcome', $weixin_welcome );
			$this->result = $weixin_welcome;
		} elseif (Utils::isWordInSentence ( $this->options [KWR_HELP_CMD], $keyword )) {
			$weixin_help = $this->options [KWR_HELP];
			$weixin_help = apply_filters ( 'weixin_help', $weixin_help );
			$this->result = $weixin_help;
		} elseif (Utils::isWordInSentence ( $this->options [KWR_NEW_ARTICLE_CMD], $keyword )) {
			$this->qservice->query ( 'new' );
			$rtn = $this->result = $this->qservice->items;
		} elseif (Utils::isWordInSentence ( $this->options [KWR_RAND_ARTICLE_CMD], $keyword )) {
			$this->qservice->query ( 'rand' );
			$this->result = $this->qservice->items;
		} elseif (Utils::isWordInSentence ( $this->options [KWR_HOT_ARTICLE_CMD], $keyword )) {
			$this->qservice->query ( 'hot' );
			$this->result = $this->qservice->items;
		} else {
			$keyword_length = mb_strwidth ( preg_replace ( '/[\x00-\x7F]/', '', $keyword ), 'utf-8' ) + str_word_count ( $keyword ) * 2;
			$weixin_keyword_allow_length = $this->options [KWR_KEYWORD_LENGTH];
			$weixin_keyword_allow_length = apply_filters ( 'weixin_keyword_allow_length', $weixin_keyword_allow_length );
			
			if ($keyword_length > $weixin_keyword_allow_length) {
				if ($this->options [KWR_AUTO_REPLY]) { 
					$weixin_keyword_too_long = $this->options [KWR_KEYWORD_LENGTH_WARNING];
					$weixin_keyword_too_long = apply_filters ( 'weixin_keywords_too_long', $weixin_keyword_too_long );
					$rtn = $weixin_keyword_too_long;
				}
			} elseif (! empty ( $keyword )) {
				$this->qservice->query ();
				$this->qservice->items;
			}
		}
		
		return $rtn;
	}
}

?>