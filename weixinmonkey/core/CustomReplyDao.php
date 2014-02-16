<?php
class CustomReplyDao {
	public static function query($id) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_reply';
		$myrows = $wpdb->get_row ( "SELECT * FROM $table_name where id = $id", ARRAY_A );
		return $myrows;
	}
	public static function queryall() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_reply';
		$myrows = $wpdb->get_results ( "SELECT * FROM $table_name where isprivate = 0", ARRAY_A );
		return $myrows;
	}
	public static function querybyqword($qword) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_reply';
		$myrows = $wpdb->get_row ( "SELECT * FROM $table_name where qword = '$qword'", ARRAY_A );
		return $myrows;
	}
	public static function getNewSceneid() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_reply';
		$myrows = $wpdb->get_row ( "SELECT max(qrsceneid) as maxqrid FROM $table_name " , ARRAY_A );
		$limit = 100001;
		$rtn = 0;
		if (count ( $myrows ) > 0) {
			$currentmax = $myrows [0] ['maxqrid'];
			if ($currentmax + 1 < $limit) {
				$rtn = $currentmax + 1;
			} else {
				for($i = 1; i < $limit; $i ++) {
					$tmprow = $wpdb->get_row ( "SELECT * FROM $table_name where qrsceneid = $i" );
					if (count ( $tmprow ) == 0) {
						$rtn = $i;
						break;
					}
				}
			}
		}
		
		return $rtn;
	}
	public static function querybysceneid($qrsceneid) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_reply';
		$myrows = $wpdb->get_row ( "SELECT * FROM $table_name where qrsceneid = '$qrsceneid'", ARRAY_A );
		return $myrows;
	}
	public static function update($val) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_reply';
		$rtn = $wpdb->update ( $table_name, $val, array (
				'id' => $val ['id'] 
		) );
		return $rtn;
	}
	public static function insert($val) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_reply';
		$rtn = $wpdb->insert ( $table_name, $val );
		return $rtn;
	}
	public static function del($id) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_reply';
		$rtn = $wpdb->delete ( $table_name, array (
				'id' => $id 
		), array (
				'%d' 
		) );
		return $rtn;
	}
}

?>