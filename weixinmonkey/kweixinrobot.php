<?php
/*
 * Plugin Name: 微信猴子 
 * Plugin URI: TBD 
 * Description: A developing wexin robot....; 
 * Version: 1.0.0 
 * Author: kevin yanghong 
 * Author URI: kevinyang.duapp.com
 */
require_once (plugin_dir_path ( __FILE__ ) . '/core/core.php');
require_once (plugin_dir_path ( __FILE__ ) . '/settings.php');
require_once (plugin_dir_path ( __FILE__ ) . '/recievedmsgs.php');
require_once (plugin_dir_path ( __FILE__ ) . '/custommenu.php');
require_once (plugin_dir_path ( __FILE__ ) . '/geosettings.php');

require_once (plugin_dir_path ( __FILE__ ) . '/aboutus.php');

require_once (plugin_dir_path ( __FILE__ ) . '/utility.php');
require_once (plugin_dir_path ( __FILE__ ) . '/extension.php');
define ( 'KWR_URL', plugins_url ( '', __FILE__ ) );
define ( 'KWR_FILE_PATH', dirname ( __FILE__ ) );
define ( 'KWR_DIR_NAME', basename ( KWR_FILE_PATH ) );

add_action ( 'admin_head', 'kwr_admin_head' );
function kwr_admin_head() {
	global $plugin_page;
	
	wp_enqueue_script ( 'jquery' );
	
	if (in_array ( $plugin_page, array (
			'kwxrobot-status',
			'kwxrobot',
			'kwxrobot-recievedmsgs',
			'kwxrobot-custommenu',
			"kwxrobot-geosetting",
			"kwxrobot-aboutus" 
	) )) {
		?>

<script src="<?php echo KWR_URL; ?>/include/bootstrap/js/bootstrap.js"></script>
<script
	src="<?php echo KWR_URL; ?>/include/jqueryvalidate/jquery.validate.js"></script>
<script
	src="<?php echo KWR_URL; ?>/include/jqueryvalidate/additional-methods.js"></script>

<script src="<?php echo KWR_URL; ?>/js/kwrcore.js"></script>
<script
	src="<?php echo KWR_URL; ?>/include/datatables/js/jquery.dataTables.js"></script>

<script src="<?php echo KWR_URL; ?>/include/datatables/js/datatables.js"></script>
<script
	src="<?php echo KWR_URL; ?>/include/noty/js/jquery.noty.packaged.js"></script>

<link rel="stylesheet"
	href="<?php echo KWR_URL; ?>/include/bootstrap/css/bootstrap.css" />
<link rel="stylesheet"
	href="<?php echo KWR_URL; ?>/include/datatables/css/datatables.css" />
<link rel="stylesheet"
	href="<?php echo KWR_URL; ?>/include/datatables/css/jquery.dataTables.css" />

<?php
	}
}

// 添加插件的菜单
add_action ( 'admin_menu', 'kweixinrobot_menu' );

add_action ( 'pre_get_posts', 'kweixinrobot_interface', 4 );
function init_db() {
	$kwrobot_db_version = "1.0";
	global $wpdb;
	
	$table_name = $wpdb->prefix . 'kwrobot_custom_reply';
	
	$installed_ver = get_option ( "kwrobot_db_version" );
	$dropsql = "";
	if ($kwrobot_db_version != $installed_ver) {
		$dropsql = "DROP $table_name  IF EXISTS ;";
	}
	global $kwrobot_db_version;
	$sql = "$dropsql CREATE TABLE if not exists $table_name(
	id mediumint(9) NOT NULL AUTO_INCREMENT,
	qword varchar(20) NOT NULL,
	type varchar(20),
	reply text,
	qrsceneid int DEFAULT 0,
	isqrvalid tinyint(1) DEFAULT 1,
	qrticket varchar(255) ,
	isprivate tinyint(1) DEFAULT 0,
	isvalid tinyint(1) DEFAULT 1,
	update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY(ID)) DEFAULT CHARSET=UTF8;";
	require_once (ABSPATH . 'wp-admin/includes/upgrade.php');
	dbDelta ( $sql );
	
	$table_name = $wpdb->prefix . 'kwrobot_recieved_msgs';
	$sql = "$dropsql CREATE TABLE if not exists $table_name(
	id mediumint(9) NOT NULL AUTO_INCREMENT,
	msg text,
	reply text,
	replydate datetime,
	create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY(ID)) DEFAULT CHARSET=UTF8;";
	dbDelta ( $sql );
	
	$table_name = $wpdb->prefix . 'kwrobot_custom_menu';
	$sql = "$dropsql CREATE TABLE if not exists $table_name(
	id mediumint(9) NOT NULL AUTO_INCREMENT,
	type varchar(20),
	name varchar(20),
	value varchar(20),
	parent mediumint(9),
	orderd mediumint(9),
	create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY(ID)) DEFAULT CHARSET=UTF8;";
	dbDelta ( $sql );
	
	add_option ( "kwrobot_db_version", $kwrobot_db_version );
}
register_activation_hook ( __FILE__, 'init_db' ); 
function kweixinrobot_menu() {
	add_menu_page ( "微信猴子", "微信猴子", 'manage_options', 'kwxrobot', "kweixinrobot_optionpage", KWR_URL . "/images/weixin.png" );
	
	add_submenu_page ( 'kwxrobot', '基本设置 &lsaquo; 微信猴子', '基本设置', 'manage_options', 'kwxrobot', 'kweixinrobot_optionpage' );
	add_submenu_page ( 'kwxrobot', '历史消息 &lsaquo; 微信猴子', '历史消息', 'manage_options', 'kwxrobot-recievedmsgs', 'kweixinrobot_recievedmsgspage' );
	add_submenu_page ( 'kwxrobot', '自定义菜单 &lsaquo; 微信猴子', '自定义菜单', 'manage_options', 'kwxrobot-custommenu', 'kweixinrobot_custommenupage' );
	add_submenu_page ( 'kwxrobot', '位置设置 &lsaquo; 微信猴子', '位置设置', 'manage_options', 'kwxrobot-geosetting', 'kwxrobot_geosetting' );
	
	add_submenu_page ( 'kwxrobot', '关于我们 &lsaquo; 微信猴子', '关于我们', 'manage_options', 'kwxrobot-aboutus', 'kwxrobot_aboutus' );
}

/**
 * MOVE TO SETTIGNS*
 */
function kweixinrobot_interface($wp_query) {
	if (isset ( $_GET ['kweixinrobot'] )) {
		global $kweixinrobot;
		if (! isset ( $kweixinrobot )) {
			$kweixinrobot = new weixinCallback ();
			$kweixinrobot->valid ();
			exit ();
		}
	}
}

// test

?>