<?php

if (! function_exists ( 'get_post_excerpt' )) {
	function get_post_excerpt($post) {
		$post_excerpt = strip_tags ( $post->post_excerpt );
		if (! $post_excerpt) {
			$post_excerpt = mb_substr ( trim ( strip_tags ( $post->post_content ) ), 0, 120 );
		}
		return $post_excerpt;
	}
}

if (! function_exists ( 'get_post_first_image' )) {
	function get_post_first_image($post_content) {
		preg_match_all ( '|<img.*?src=[\'"](.*?)[\'"].*?>|i', $post_content, $matches );
		if ($matches) {
			return $matches [1] [0];
		} else {
			return false;
		}
	}
}

if (! function_exists ( 'search_orderby' )) {
	add_filter ( 'posts_orderby_request', 'search_orderby' );
	function search_orderby($orderby = '') {
		global $wpdb, $wp_query;

		$keyword = stripslashes ( $wp_query->query_vars [s] );

		if ($keyword) {
				
			$n = ! empty ( $q ['exact'] ) ? '' : '%';
				
			preg_match_all ( '/".*?("|$)|((?<=[\r\n\t ",+])|^)[^\r\n\t ",+]+/', $keyword, $matches );
			$search_terms = array_map ( '_search_terms_tidy', $matches [0] );
				
			$case_when = "0";
				
			foreach ( ( array ) $search_terms as $term ) {
				$term = esc_sql ( like_escape ( $term ) );

				$case_when .= " + (CASE WHEN {$wpdb->posts}.post_title LIKE '{$term}' THEN 3 ELSE 0 END) + (CASE WHEN {$wpdb->posts}.post_title LIKE '{$n}{$term}{$n}' THEN 2 ELSE 0 END) + (CASE WHEN {$wpdb->posts}.post_content LIKE '{$n}{$term}{$n}' THEN 1 ELSE 0 END)";
			}
				
			return "({$case_when}) DESC, {$wpdb->posts}.post_modified DESC";
		} else {
			return $orderby;
		}
	}
}
?>