<?php
$dirname = "equip/";
$images = glob($dirname."*.png");

foreach($images as $image) {
    echo '<div style=\'display:inline-block;height:48px;width:48px;background-image:url("'.$image.'")\'></div>';
}
$dirname = "usable/";
$images = glob($dirname."*.png");

foreach($images as $image) {
    echo '<div style=\'display:inline-block;height:48px;width:48px;background-image:url("'.$image.'")\'></div>';
}
$dirname = "misc/";
$images = glob($dirname."*.png");

foreach($images as $image) {
    echo '<div style=\'display:inline-block;height:48px;width:48px;background-image:url("'.$image.'")\'></div>';
}
?>
