<?php
include "conexion.php";

// Detectar FK
$fk_col = 'id_pregunta';
$res = $conn->query("SHOW COLUMNS FROM respuestas LIKE 'id_pregunta'");
if(!$res->num_rows){
    $fk_col = 'pregunta_id';
}

// CREAR NUEVA PREGUNTA
if(isset($_POST['crear'])){
    $pregunta = $_POST['pregunta'];
    $correcta = intval($_POST['correcta']);

    $stmt = $conn->prepare("INSERT INTO preguntas (pregunta) VALUES (?)");
    $stmt->bind_param("s", $pregunta);
    $stmt->execute();
    $id_preg = $stmt->insert_id;
    $stmt->close();

    foreach($_POST['respuestas'] as $i=>$r){
        $c = ($i+1==$correcta)?1:0;
        $stmt2 = $conn->prepare("INSERT INTO respuestas ($fk_col, etiqueta, correcta) VALUES (?,?,?)");
        $stmt2->bind_param("isi", $id_preg, $r, $c);
        $stmt2->execute();
        $stmt2->close();
    }

    header("Location: admin.php"); exit;
}

// BORRAR PREGUNTA
if(isset($_GET['borrar'])){
    $id = intval($_GET['borrar']);
    $stmt = $conn->prepare("DELETE FROM respuestas WHERE $fk_col=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();

    $stmt2 = $conn->prepare("DELETE FROM preguntas WHERE id=?");
    $stmt2->bind_param("i", $id);
    $stmt2->execute();
    $stmt2->close();

    header("Location: admin.php"); exit;
}

// GUARDAR CAMBIOS
if(isset($_POST['guardar'])){
    $id = intval($_POST['id']);
    $pregunta = $_POST['pregunta'];

    $stmt = $conn->prepare("UPDATE preguntas SET pregunta=? WHERE id=?");
    $stmt->bind_param("si", $pregunta, $id);
    $stmt->execute();
    $stmt->close();

    foreach($_POST['id_resp'] as $i=>$idr){
        $r = $_POST['respuestas'][$i];
        $c = ($i+1==intval($_POST['correcta']))?1:0;

        $stmt2 = $conn->prepare("UPDATE respuestas SET etiqueta=?, correcta=? WHERE id=?");
        $stmt2->bind_param("sii", $r, $c, $idr);
        $stmt2->execute();
        $stmt2->close();
    }

    header("Location: admin.php"); exit;
}

// OBTENER PREGUNTAS
$preguntas = $conn->query("SELECT * FROM preguntas ORDER BY id ASC");
?>

<h1>Admin Quiz</h1>
<a href="index.html">Volver al inicio</a>
<hr>

<h3>Crear nueva pregunta</h3>
<form method="post">
    <input type="text" name="pregunta" placeholder="Texto de la pregunta" required><br>
    <?php for($i=1;$i<=4;$i++): ?>
        <input type="text" name="respuestas[]" placeholder="Respuesta <?=$i?>" required>
        <input type="radio" name="correcta" value="<?=$i?>" <?=($i==1?'checked':'')?> > Correcta<br>
    <?php endfor; ?>
    <button name="crear" type="submit">Crear</button>
</form>
<hr>

<h3>Preguntas existentes</h3>
<?php while($p = $preguntas->fetch_assoc()): ?>
    <?php $res = $conn->query("SELECT * FROM respuestas WHERE $fk_col=".$p['id']." ORDER BY id ASC"); ?>
    <form method="post">
        <h4>Pregunta</h4>
        <input type="hidden" name="id" value="<?=$p['id']?>">
        <input type="text" name="pregunta" value="<?=htmlspecialchars($p['pregunta'])?>"><br>
        
        <h5>Respuestas</h5>
        <?php $i=0; while($r=$res->fetch_assoc()): ?>
            <input type="hidden" name="id_resp[]" value="<?=$r['id']?>">
            <input type="text" name="respuestas[]" value="<?=htmlspecialchars($r['etiqueta'])?>">
            <input type="radio" name="correcta" value="<?=($i+1)?>" <?=($r['correcta']==1?'checked':'')?>> Correcta<br>
        <?php $i++; endwhile; ?>
        <button type="submit" name="guardar">Guardar</button>
        <a href="?borrar=<?=$p['id']?>" onclick="return confirm('Borrar?')">Borrar</a>
    </form>
    <hr>
<?php endwhile; ?>
