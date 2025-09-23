<?php
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$json = file_get_contents("data.json");
$data = json_decode($json, true);

$n = isset($_GET['n']) ? intval($_GET['n']) : 10;

$preguntas = $data["preguntes"];
shuffle($preguntas);
$preguntas = array_slice($preguntas, 0, $n);

foreach ($preguntas as &$p) {
    unset($p["resposta_correcta"]);
}

echo json_encode([
    "preguntes" => $preguntas
]);
