<?php

define ( 'KWR_TOKEN', 'kwr-token' );
define ( 'KWR_WELCOME', 'kwr-welcome' );
define ( 'KWR_WELCOME_CMD', 'kwr-welcome-cmd' );
define ( 'KWR_HELP', 'kwr-help' );
define ( 'KWR_HELP_CMD', 'kwr-help-cmd' );
define ( 'KWR_KEYWORD_LENGTH', 'kwr-keyword-length' );
define ( 'KWR_AUTO_REPLY', 'kwr-auto-reply' );
define ( 'KWR_KEYWORD_LENGTH_WARNING', 'kwr-keyword-length-warning' );
define ( 'KWR_KEYWORD_ERROR_WARNING', 'kwr-keyword-error-warning' );
define ( 'KWR_DEFAULT_ARTICLE_ACCOUNT', 'kwr-default-article-account' );
define ( 'KWR_NEW_ARTICLE_CMD', 'kwr-new-article-cmd' );
define ( 'KWR_RAND_ARTICLE_CMD', 'kwr-rand-article-cmd' );
define ( 'KWR_HOT_ARTICLE_CMD', 'kwr-hot-article-cmd' );
define ( 'KWR_CMD_SEPERATOR', 'kwr-cmd-seperator' );
define ( 'KWR_DEFAULT_THUMB', 'kwr-default-thumb' );
define ( 'KWR_MESSAGE_HOLDTIME', 'kwr-message-holdtime' );

define ( 'KWR_APPID', 'kwr-appid' );
define ( 'KWR_APPSECRET', 'kwr-appsecret' );
define ( 'KWR_ACCESSTOKEN', 'kwr-accesstoken' );
define ( 'KWR_ACCESSTOKEN_EXPRIESIN', 'kwr-accesstoken-expriesin' );

//geo
define ( 'KWR_GEOSETTINGS_CITY', 'kwr-geosettings-city' );
define ( 'KWR_GEOSETTINGS_CENTER', 'kwr-geosettings-center' );
define ( 'KWR_GEOSETTINGS_RADIS', 'kwr-geosettings-radis' );
define ( 'KWR_GEOSETTINGS_INFO', 'kwr-geosettings-info' );


$kwr_token = get_option ( KWR_TOKEN, 'weixin' );
// 定义微信 Token
define ( 'WEIXIN_TOKEN', $kwr_token );
// 定义默认缩略图
// define('WEIXIN_DEFAULT', $siteurl.'/wp-content/themes/Metropro/images/random2/tb'.rand(1, 12).'.jpg');
$kwr_thumb = get_option ( KWR_DEFAULT_THUMB );
if (empty ( $kwr_thumb )) {
	$kwr_thumb = KWR_URL . '/images/tb5.jpg';
}
define ( 'WEIXIN_DEFAULT', $kwr_thumb );



function get_kweixinrobot_option() {
	$array_kweixinrobot_option = array ();
	$array_kweixinrobot_option [KWR_TOKEN] = get_option ( KWR_TOKEN );
	$array_kweixinrobot_option [KWR_WELCOME] = get_option ( KWR_WELCOME );
	$array_kweixinrobot_option [KWR_WELCOME_CMD] = get_option ( KWR_WELCOME_CMD );
	$array_kweixinrobot_option [KWR_HELP] = get_option ( KWR_HELP );
	$array_kweixinrobot_option [KWR_HELP_CMD] = get_option ( KWR_HELP_CMD );
	$array_kweixinrobot_option [KWR_KEYWORD_LENGTH] = get_option ( KWR_KEYWORD_LENGTH );
	$array_kweixinrobot_option [KWR_AUTO_REPLY] = get_option ( KWR_AUTO_REPLY );
	$array_kweixinrobot_option [KWR_KEYWORD_LENGTH_WARNING] = get_option ( KWR_KEYWORD_LENGTH_WARNING );
	$array_kweixinrobot_option [KWR_KEYWORD_ERROR_WARNING] = get_option ( KWR_KEYWORD_ERROR_WARNING );
	$array_kweixinrobot_option [KWR_DEFAULT_ARTICLE_ACCOUNT] = get_option ( KWR_DEFAULT_ARTICLE_ACCOUNT );
	$array_kweixinrobot_option [KWR_NEW_ARTICLE_CMD] = get_option ( KWR_NEW_ARTICLE_CMD );
	$array_kweixinrobot_option [KWR_RAND_ARTICLE_CMD] = get_option ( KWR_RAND_ARTICLE_CMD );
	$array_kweixinrobot_option [KWR_HOT_ARTICLE_CMD] = get_option ( KWR_HOT_ARTICLE_CMD );
	$array_kweixinrobot_option [KWR_CMD_SEPERATOR] = get_option ( KWR_CMD_SEPERATOR );
	$array_kweixinrobot_option [KWR_DEFAULT_THUMB] = get_option ( KWR_DEFAULT_THUMB );
	$array_kweixinrobot_option [KWR_MESSAGE_HOLDTIME] = get_option ( KWR_MESSAGE_HOLDTIME );
	$array_kweixinrobot_option [KWR_APPID] = get_option ( KWR_APPID );
	$array_kweixinrobot_option [KWR_APPSECRET] = get_option ( KWR_APPSECRET );
	$array_kweixinrobot_option [KWR_ACCESSTOKEN] = get_option ( KWR_ACCESSTOKEN );
	$array_kweixinrobot_option [KWR_ACCESSTOKEN_EXPRIESIN] = get_option ( KWR_ACCESSTOKEN_EXPRIESIN );
	$array_kweixinrobot_option [KWR_GEOSETTINGS_CITY] = get_option ( KWR_GEOSETTINGS_CITY );
	$array_kweixinrobot_option [KWR_GEOSETTINGS_CENTER] = get_option ( KWR_GEOSETTINGS_CENTER );
	$array_kweixinrobot_option [KWR_GEOSETTINGS_RADIS] = get_option ( KWR_GEOSETTINGS_RADIS );
	$array_kweixinrobot_option [KWR_GEOSETTINGS_INFO] = get_option ( KWR_GEOSETTINGS_INFO );
	
	return $array_kweixinrobot_option;
}



?>
