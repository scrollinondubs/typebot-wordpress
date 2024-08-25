function add_post_id_to_js() {
    if (is_single()) { // Only add the script on single posts/pages
        ?>
        <script type="text/javascript">
            window.wp = window.wp || {};
            wp.post = wp.post || {};
            wp.post.id = <?php echo get_the_ID(); ?>;
        </script>
        <?php
    }
}
add_action('wp_head', 'add_post_id_to_js');

add_action('wp_head', 'add_post_id_to_js');
