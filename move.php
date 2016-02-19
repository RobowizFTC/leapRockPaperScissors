

<?php
$move = $_REQUEST["move"];
$myfile = fopen("jarvisMove.txt", "w");
fwrite($myfile, $move);
fclose($myfile);
?>

