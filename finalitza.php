<?php
header("Content-Type: application/json");

$json = file_get_contents("data.json"); 
$data = json_decode($json, true);
$preguntas = array_slice($data["preguntes"], 0, 10);

$input = json_decode(file_get_contents("php://input"), true);
$respuestasUsuario = $input["respuestas"] ?? [];

$total = count($respuestasUsuario);
$correctas = 0;

for ($i = 0; $i < $total; $i++) {
    if (isset($preguntas[$i]) && $respuestasUsuario[$i] == $preguntas[$i]["resposta_correcta"]) {
        $correctas++;
    }
}

echo json_encode([
    "total" => $total,
    "correctes" => $correctas
]);
