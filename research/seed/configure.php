<?php
// Operator-only local reference setup. Never run against the merchant.
$_SERVER['HTTP_HOST'] = '127.0.0.1:8088';
require '/var/www/html/wp-load.php';
if (get_option('originator_lab') !== 'phase-b-v1' || WC_VERSION !== '10.1.2') {
    throw new Exception('Expected the marked local WooCommerce 10.1.2 laboratory');
}
$mode = $argv[1] ?? 'mirror';
if (!in_array($mode, ['mirror', 'interaction'], true)) {
    throw new Exception('Usage: configure.php mirror|interaction');
}
WC_Install::install();
$options = [
    'woocommerce_currency' => 'EUR',
    'woocommerce_price_num_decimals' => '2',
    'woocommerce_default_country' => 'FR',
    'woocommerce_default_customer_address' => 'base',
    'woocommerce_tax_based_on' => 'shipping',
    'woocommerce_calc_taxes' => 'yes',
    'woocommerce_prices_include_tax' => 'yes',
    'woocommerce_tax_round_at_subtotal' => 'no',
    'woocommerce_tax_display_shop' => 'incl',
    'woocommerce_tax_display_cart' => 'incl',
    'woocommerce_calc_discounts_sequentially' => 'no',
    'woocommerce_enable_coupons' => 'yes',
];
foreach ($options as $key => $value) update_option($key, $value);
if (!in_array('coffee-reduced', WC_Tax::get_tax_class_slugs(), true)) {
    $created = WC_Tax::create_tax_class('Coffee reduced', 'coffee-reduced');
    if (is_wp_error($created)) throw new Exception($created->get_error_message());
}
foreach (['' => '20.0000', 'coffee-reduced' => '5.5000'] as $class => $rate) {
    if (!WC_Tax::get_rates_for_tax_class($class)) {
        WC_Tax::_insert_tax_rate([
            'tax_rate_country' => 'FR', 'tax_rate_state' => '',
            'tax_rate' => $rate, 'tax_rate_name' => 'VAT ' . $rate,
            'tax_rate_priority' => 1, 'tax_rate_compound' => 0,
            'tax_rate_shipping' => 0, 'tax_rate_order' => 0,
            'tax_rate_class' => $class,
        ]);
    }
}
$ids = [];
foreach ([
    ['coffee-250g-grains', 'Café Découverte — 250g / Café en grains (non moulu)', '9.98', 'coffee-reduced', true],
    ['spatules', 'Paquet de 50 spatules', '1.50', '', false],
] as [$sku, $name, $price, $class, $individual]) {
    $id = wc_get_product_id_by_sku($sku);
    $product = $id ? wc_get_product($id) : new WC_Product_Simple();
    $product->set_name($name);
    $product->set_sku($sku);
    $product->set_status('publish');
    $product->set_regular_price($price);
    $product->set_tax_status('taxable');
    $product->set_tax_class($class);
    $product->set_sold_individually($individual);
    $product->set_manage_stock(false);
    $product->set_stock_status('instock');
    $ids[$sku] = $product->save();
}
$coupons = ['decouverte10' => '10'];
if ($mode === 'interaction') $coupons['lab20'] = '20';
foreach ($coupons as $code => $amount) {
    $coupon = new WC_Coupon($code);
    $coupon->set_code($code);
    $coupon->set_discount_type('percent');
    $coupon->set_amount($amount);
    $coupon->set_individual_use(false);
    $coupon->set_product_ids([$ids['coffee-250g-grains']]);
    $coupon->set_free_shipping(false);
    $coupon->save();
}
echo json_encode([
    'date' => gmdate('c'), 'mode' => $mode,
    'wordpress' => $wp_version, 'woocommerce' => WC_VERSION, 'php' => PHP_VERSION,
    'products' => $ids, 'options' => $options,
    'coupons' => $coupons,
    'model_assumptions' => [
        'Inclusive entered prices; this is a candidate explanation of the target.',
        'Product eligibility models the observed two-reference domain; merchant category/product restriction remains unidentified.',
        'The single target variation is flattened into a local simple product with an explicit identity mapping.',
        'No shipping methods, fees, gifts, compound taxes or third product are configured.',
    ],
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
