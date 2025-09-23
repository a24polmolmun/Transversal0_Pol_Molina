<?php
require 'conexion.php'; 
header("Content-Type: application/json");

$input = json_decode(file_get_contents("php://input"), true);
$respuestasUsuario = $input["respostesUsuari"] ?? [];

$total = count($respuestasUsuario);
$correctas = 0;

foreach ($respuestasUsuario as $idRespuesta) {
    $idRespuesta = intval($idRespuesta);

    $sql = "SELECT correcta FROM respuestas WHERE id = $idRespuesta LIMIT 1";
    $result = $conn->query($sql);

    if ($result && $row = $result->fetch_assoc()) {
        if ($row['correcta'] == 1) {
            $correctas++;
        }
    }
}

echo json_encode([
    "total" => $total,
    "correctes" => $correctas
]);
?>
