<?php
 // echo '***hora del servidor***:'.date("r").'\n';
  
  //Saber si es domingo o no para ser dia L=lectivo o F=festivo.
  date("l") == "Sunday" ? $dia='F': $dia='L';
  
  //$conexion = mysql_connect("188.40.15.22:3306","root","root");
  $conexion = mysql_connect("127.0.0.1","root","root");
  if (!$conexion) {
    die('No se pudo conectar: ' . mysql_error());
  }

  mysql_select_db("osmautobur", $conexion);

  $consulta_ruta_linea = mysql_query("SELECT * FROM ruta_linea WHERE hora ='".date("G:i:s")."' AND dia = '".$dia."';");
  //$consulta_linea = 
  //imprimir el resultado.
  echo '{"type":"FeatureCollection","features":[';

  $numero = mysql_num_rows($consulta_ruta_linea);
  $i=1;
  if($numero==1){
    while($array_ruta_linea = mysql_fetch_array($consulta_ruta_linea)){
      //imprimir el geojson para su representacion
      echo '{"type":"Feature","properties":{"lfid":'.$array_ruta_linea['id_linea'].',"course":1822},"geometry":{"type":"Point","coordinates":['.$array_ruta_linea['longitud'].','.$array_ruta_linea['latitud'].']}}';
    }
  }if($numero>=2){
    while($array_ruta_linea = mysql_fetch_array($consulta_ruta_linea)){
      //imprimir el geojson para su representacion
      if($numero!=$i){
	echo '{"type":"Feature","properties":{"lfid":'.$array_ruta_linea['id_linea'].',"course":1822},"geometry":{"type":"Point","coordinates":['.$array_ruta_linea['longitud'].','.$array_ruta_linea['latitud'].']}},';
      }else if($numero == $i){
	echo '{"type":"Feature","properties":{"lfid":'.$array_ruta_linea['id_linea'].',"course":1822},"geometry":{"type":"Point","coordinates":['.$array_ruta_linea['longitud'].','.$array_ruta_linea['latitud'].']}}';
      }
      $i++;
    }
  }
   echo ']}';

  //cerrar la conexion.
  mysql_close($conexion);
 ?> 