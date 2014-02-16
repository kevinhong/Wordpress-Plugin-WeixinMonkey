<?php
class CustomMenuDao {
	public static function query($id) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_menu';
		$myrows = $wpdb->get_row ( "SELECT * FROM $table_name where id = $id" );
		return $myrows;
	}
	public static function getsubmenus($id) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_menu';
		$myrows = $wpdb->get_row ( "SELECT * FROM $table_name where parent = $id" );
		return $myrows;
	}
	
	public static function update($val) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_menu';
		$rtn = $wpdb->update ( $table_name, $val,array('id'=>$val['id']) );
		return $rtn;
	}

	public static function insert($val) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_menu';
		$rtn = $wpdb->insert ( $table_name, $val );
		return $rtn;
	}
	public static function queryall(&$wxmenuarray = NULL) {
		global $wpdb;
		$myrows = array ();
		$wxmenuarray = array (
				'button' => array () 
		);
		$table_name = $wpdb->prefix . 'kwrobot_custom_menu';
		$index = 0;
		
		$rootmenu = $wpdb->get_results ( "SELECT * FROM $table_name where type = 'root' order by orderd", ARRAY_A );
		for($i = 0; $i < count ( $rootmenu ); $i ++) {
			array_push ( $myrows, $rootmenu [$i] );
			$mainbutton = array ();
			
			$mainbutton = CustomMenuDao::getwxarray ( $rootmenu [$i] );
			//echo var_dump($mainbutton);
			
			$parent = $rootmenu [$i] ['id'];
			
			$submenu = $wpdb->get_results ( "SELECT * FROM $table_name where parent = $parent order by orderd", ARRAY_A );
			if (count ( $submenu ) > 0) {
				foreach ( $submenu as $v ) {
					array_push ( $mainbutton ['sub_button'], CustomMenuDao::getwxarray ( $v ) );
					array_push ( $myrows, $v );
				}
			}
			array_push ( $wxmenuarray ['button'], $mainbutton );
		}
		return $myrows;
	}
	public static function getwxarray($dbarray) {
		$rtn = array ();
		$rtn ['name'] = $dbarray ['name'];
		if (strcmp ( $dbarray ['type'], 'click' )==0) {
			$rtn ['type'] = $dbarray ['type'];
			$rtn ['key'] = $dbarray ['value'];
		} else if (strcmp ( $dbarray ['type'], 'view' )==0) {
			$rtn ['type'] = $dbarray ['type'];
			$rtn ['url'] = $dbarray ['value'];
		} else if (strcmp ( $dbarray ['type'], 'root' )==0) {
			$rtn ['sub_button'] = array ();
		}
		return $rtn;
	}
	public static function del($id) {
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_custom_menu';
		$rtn = $wpdb->delete ( $table_name, array (
				'id' => $id
		) ,array( '%d' ));
		return $rtn;
	}
}

?>