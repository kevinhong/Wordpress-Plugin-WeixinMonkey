<?php
class WPQueryService {
	public $items = '';
	public $articleCount = 0;
	public $articleCountLimit = 0;
	
	public $keyword = '';
	public $arg = '';
	public $sargs = array();
	
	public static function getWPQuery($args) {
		$wp_query = new WP_Query ( $args );
		return 	$wp_query;

	}
	public function query($queryArg = NULL) {
		global $wp_query ;	
		$queryKeyword = $this->keyword;
		$weixin_count = get_option ( KWR_DEFAULT_ARTICLE_ACCOUNT );
		
		if (! empty ( $this->arg )) {
			if (preg_match ( "/^\d*$/", $this->arg )) { // if the arg is a number or not, is_numeric($fgid)
				$weixin_count = $this->arg;
			} else { // if the arg is not a number, so we consier XXX@YYY the whole as one keyword, and we use "XXX YYY" instead of "XXX@YYY" to query information.
				$queryKeyword = $this->keyword . ' ' . $this->arg;
				$this->keyword = $this->keyword . '@' . $this->arg;
			}
		}
		
		$weixin_count = apply_filters ( 'weixin_count', $weixin_count );
		
		
		if(NULL== $this->sargs || count( $this->sargs)==0 ){
			switch ($queryArg) {
				case 'new' :
					$weixin_query_array = array (
					'showposts' => $weixin_count,
					'post_status' => 'publish'
							);
							break;
				case 'rand' :
					$weixin_query_array = array (
					'orderby' => 'rand',
					'posts_per_page' => $weixin_count,
					'post_status' => 'publish'
							);
							break;
				case 'hot' :
					$weixin_query_array = array (
					'orderby' => 'meta_value_num',
					'meta_key' => 'views',
					'order' => 'DESC',
					'posts_per_page' => $weixin_count,
					'post_status' => 'publish'
							);
							break;
				default :
					$weixin_query_array = array (
					's' => $queryKeyword,
					'posts_per_page' => $weixin_count,
					'post_status' => 'publish'
							);
							break;
			}
			
		}else{
			if($this->sargs['posts_per_page'] == NULL){
				$this->sargs['posts_per_page'] = $weixin_count;
			}
				
			$this->sargs['post_status'] = 'publish';
				
			
			$weixin_query_array = $this->sargs;
		}
		
		$weixin_query_array = apply_filters ( 'weixin_query', $weixin_query_array );
		
		$wp_query->query ( $weixin_query_array );
		
		if (have_posts ()) {
			$count = 0;
			while ( have_posts () ) {
				the_post ();
				
				global $post;
				
				$title = get_the_title ();
				$excerpt = get_post_excerpt ( $post );
				
				$thumbnail_id = get_post_thumbnail_id ( $post->ID );
				if ($thumbnail_id) {
					$thumb = wp_get_attachment_image_src ( $thumbnail_id, 'thumbnail' );
					$thumb = $thumb [0];
				} else {
					$thumb = get_post_first_image ( $post->post_content );
				}
				
				if (! $thumb && WEIXIN_DEFAULT) {
					$thumb = WEIXIN_DEFAULT;
				}
				
				$link = get_permalink ();
				
				$items = $items . $this->get_item ( $title, $excerpt, $thumb, $link );
				$count++;
				
				if(($this->articleCountLimit>0 && $count>=$this->articleCountLimit) || $count > $weixin_count){
					break;
				}
			}
		}
		
		$this->articleCount = $count;	
		$this->items = $items;
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
}

?>