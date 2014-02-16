<?php
class Utils {
	public static function  isWordInSentence($sentence,$word){
		return Utils::isWordInSeperatorSentence(" ",$sentence,$word);
	}
	public static function  isWordInSeperatorSentence($seprater,$sentence,$word){
		$arraysep = explode ($seprater, $sentence);
		if(in_array($word, $arraysep)){
			return true;
		}else{
			return false;
		}
	}
}

?>