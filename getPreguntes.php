<?php
require 'conexion.php';
header("Content-Type: application/json");

$n = isset($_GET['n']) ? intval($_GET['n']) : 10;

$sqlPreguntas = "SELECT id, pregunta FROM preguntas ORDER BY RAND() LIMIT $n";
$resultPreguntas = $conn->query($sqlPreguntas);

$preguntas = [];

if ($resultPreguntas && $resultPreguntas->num_rows > 0) {
    while ($row = $resultPreguntas->fetch_assoc()) {
        $idPregunta = $row['id'];
        $pregunta = $row['pregunta'];

        $sqlRespuestas = "SELECT id, etiqueta FROM respuestas WHERE pregunta_id = $idPregunta ORDER BY id";
        $resultRespuestas = $conn->query($sqlRespuestas);

        $respuestas = [];
        if ($resultRespuestas && $resultRespuestas->num_rows > 0) {
            while ($res = $resultRespuestas->fetch_assoc()) {
                $respuestas[] = [
                    'id' => $res['id'],
                    'etiqueta' => $res['etiqueta']
                ];
            }
        }

        $preguntas[] = [
            'id' => $idPregunta,
            'pregunta' => $pregunta,
            'respostes' => $respuestas
        ];
    }
}

echo json_encode(['preguntes' => $preguntas]);
?>
