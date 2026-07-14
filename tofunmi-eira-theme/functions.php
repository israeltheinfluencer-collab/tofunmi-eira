<?php
function tofunmi_eira_enqueue() {
    wp_enqueue_style('tofunmi-eira-style', get_stylesheet_uri(), array(), time());
    wp_enqueue_script('face-api', 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js', array(), null, true);
    wp_enqueue_script('tofunmi-eira-app', get_template_directory_uri() . '/app.js', array(), time(), true);
    wp_localize_script('tofunmi-eira-app', 'themeData', array(
        'modelUrl' => get_template_directory_uri() . '/models'
    ));
    wp_enqueue_style('outfit-font', 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap', array(), null);
}
add_action('wp_enqueue_scripts', 'tofunmi_eira_enqueue');
?>
