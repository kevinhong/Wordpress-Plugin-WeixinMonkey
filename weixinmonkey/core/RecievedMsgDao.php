<?php
class RecievedMsgDao {
	
	public static function save($val){
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_recieved_msgs';
		$rtn = $wpdb->insert($table_name,$val);
		return $rtn;
	}

	public static function update($val){
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_recieved_msgs';
		$rtn = $wpdb->update($table_name,$val,array('id'=>$val['id']) );
		return $rtn;
	}
	
	public static function queryall(){
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_recieved_msgs';
		$myrows = $wpdb->get_results("SELECT * FROM $table_name ",ARRAY_A);
		return $myrows;
	}
	public static function query($id){
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_recieved_msgs';
		$myrows = $wpdb->get_results("SELECT * FROM $table_name where id = $id",ARRAY_A);
		return $myrows;
	}
	
	public static function querybykeyword($keyword){
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_recieved_msgs';
		$myrows = $wpdb->get_results("SELECT * FROM $table_name  where msg like '%$keyword%' order by id desc",ARRAY_A);
		return $myrows;
	}
	
	public static function deleteSinceWhen($when){
		global $wpdb;
		$table_name = $wpdb->prefix . 'kwrobot_recieved_msgs';
		$myrows = $wpdb->query("DELETE  FROM $table_name  where create_date <= '$when'");
		return $myrows;
	}
}

?>