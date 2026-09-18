<?php
// Local installation only; suppress installation mail and never print credentials.
$_SERVER['HTTP_HOST'] = '127.0.0.1:8088';
define('WP_INSTALLING', true);
require '/var/www/html/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/upgrade.php';
add_filter('pre_wp_mail', '__return_true');
if (!is_blog_installed()) {
    wp_install('Originator local laboratory', 'originator_lab', 'lab@localhost.invalid', false, '', bin2hex(random_bytes(24)));
    update_option('originator_lab', 'phase-b-v1');
}
if (get_option('originator_lab') !== 'phase-b-v1') {
    throw new Exception('Refusing an unrecognized existing site');
}
require_once ABSPATH . 'wp-admin/includes/plugin.php';
$result = activate_plugin('woocommerce/woocommerce.php');
if (is_wp_error($result)) throw new Exception($result->get_error_message());
update_option('home', 'http://127.0.0.1:8088');
update_option('siteurl', 'http://127.0.0.1:8088');
echo "Marked local laboratory initialized; credentials retained locally only.\n";
