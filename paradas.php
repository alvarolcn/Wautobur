<?php
 // echo '***hora del servidor***:'.date("r").'\n';
  
  
  //$conexion = mysql_connect("188.40.15.22:3306","root","root");
  $conexion = mysql_connect("127.0.0.1","root","root");
  if (!$conexion) {
    die('No se pudo conectar: ' . mysql_error());
  }

  mysql_select_db("osmautobur", $conexion);

  $consulta_parada = mysql_query("SELECT p.id_parada 'id_parada', p.nombre 'nombre', p.latitudfuera 'latitudfuera', p.longitudfuera 'longitudfuera', l.id_linea 'id_linea'  FROM parada p, parada_linea l WHERE p.id_parada = l.id_parada;");
  //$consulta_linea = 
  //imprimir el resultado.
  echo '{"type":"FeatureCollection","features":[';

  $numero = mysql_num_rows($consulta_parada);
  $i=1;
  if($numero==1){
    while($array_parada = mysql_fetch_array($consulta_parada)){
      //imprimir el geojson para su representacion

      echo '{"type":"Feature","properties":{"id":"'.$array_parada['id_parada'].'","lfid":'.$array_parada['id_linea'].',"name":"'.$array_parada['nombre'].'","number":"'.$array_parada['id_linea'].'","direction":"H"},"geometry":{"type":"Point","coordinates":['.$array_parada['longitudfuera'].','.$array_parada['latitudfuera'].']}}';
    }
  }if($numero>=2){
    while($array_parada = mysql_fetch_array($consulta_parada)){
      //imprimir el geojson para su representacion
      if($numero!=$i){
	echo '{"type":"Feature","properties":{"id":"'.$array_parada['id_parada'].'","lfid":'.$array_parada['id_linea'].',"name":"'.$array_parada['nombre'].'","number":"'.$array_parada['id_linea'].'","direction":"H"},"geometry":{"type":"Point","coordinates":['.$array_parada['longitudfuera'].','.$array_parada['latitudfuera'].']}},';
      }else if($numero == $i){
        echo '{"type":"Feature","properties":{"id":"'.$array_parada['id_parada'].'","lfid":'.$array_parada['id_linea'].',"name":"'.$array_parada['nombre'].'","number":"'.$array_parada['id_linea'].'","direction":"H"},"geometry":{"type":"Point","coordinates":['.$array_parada['longitudfuera'].','.$array_parada['latitudfuera'].']}}';
      }
      $i++;
    }
  }
   echo ']}';

  //cerrar la conexion.
  mysql_close($conexion);
 ?> 