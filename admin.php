<?php
include "conexion.php";

// Detectar FK
$fk_col = 'id_pregunta';
$res = $conn->query("SHOW COLUMNS FROM respuestas LIKE 'id_pregunta'");
if(!$res->num_rows){
    $fk_col = 'pregunta_id';
}

// Crear nueva pregunta
if(isset($_POST['crear'])){
    $pregunta = $_POST['pregunta'];
    $correcta = intval($_POST['correcta']);
    $conn->query("INSERT INTO preguntas (pregunta) VALUES ('$pregunta')");
    $id_preg = $conn->insert_id;
    foreach($_POST['respuestas'] as $i=>$r){
        $c = ($i+1==$correcta)?1:0;
        $conn->query("INSERT INTO respuestas ($fk_col, etiqueta, correcta) VALUES ($id_preg,'$r',$c)");
    }
    header("Location: admin.php"); exit;
}

// Borrar
if(isset($_GET['borrar'])){
    $id = intval($_GET['borrar']);
    $conn->query("DELETE FROM respuestas WHERE $fk_col=$id");
    $conn->query("DELETE FROM preguntas WHERE id=$id");
    header("Location: admin.php"); exit;
}

// Guardar cambios
if(isset($_POST['guardar'])){
    $id = intval($_POST['id']);
    $pregunta = $_POST['pregunta'];
    $conn->query("UPDATE preguntas SET pregunta='$pregunta' WHERE id=$id");
    foreach($_POST['id_resp'] as $i=>$idr){
        $r = $_POST['respuestas'][$i];
        $c = ($i+1==intval($_POST['correcta']))?1:0;
        $conn->query("UPDATE respuestas SET etiqueta='$r', correcta=$c WHERE id=$idr");
    }
    header("Location: admin.php"); exit;
}

// Obtener preguntas
$preguntas = $conn->query("SELECT * FROM preguntas ORDER BY id ASC");
?>

<h1>Admin Quiz</h1>
<a href="index.html">Volver al inicio</a>
<hr>

<h3>Crear nueva pregunta</h3>
<form method="post">
    <input type="text" name="pregunta" placeholder="Texto de la pregunta" required><br>
    <?php for($i=1;$i<=4;$i++): ?>
        <input type="text" name="respuestas[]" placeholder="Respuesta <?=$i?>" required><br>
    <?php endfor; ?>
    <input type="number" name="correcta" min="1" max="4" value="1"><br>
    <button name="crear" type="submit">Crear</button>
</form>
<hr>

<h3>Preguntas existentes</h3>
<?php while($p = $preguntas->fetch_assoc()): ?>
    <?php $res = $conn->query("SELECT * FROM respuestas WHERE $fk_col=".$p['id']." ORDER BY id ASC"); ?>
    <form method="post">
        <input type="hidden" name="id" value="<?=$p['id']?>">
        <input type="text" name="pregunta" value="<?=htmlspecialchars($p['pregunta'])?>"><br>
        <?php $i=0; while($r=$res->fetch_assoc()): ?>
            <input type="hidden" name="id_resp[]" value="<?=$r['id']?>">
            <input type="text" name="respuestas[]" value="<?=htmlspecialchars($r['etiqueta'])?>"><br>
        <?php $i++; endwhile; ?>
        <input type="number" name="correcta" min="1" max="4" value="1"><br>
        <button type="submit" name="guardar">Guardar</button>
        <a href="?borrar=<?=$p['id']?>" onclick="return confirm('Borrar?')">Borrar</a>
    </form>
    <hr>
<?php endwhile; ?>
