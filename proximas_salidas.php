<?php

/**
 *Debug para mostrar o no mostrar echos. 
 */
$debug = false;

/**
*Dias para la consulta Laborables y Festivos.
**/
date("l") == "Sunday" ? $dia='F': $dia='L';


/**
*
**/
function conectar(){
  $conexion = mysql_connect("188.40.15.22","root","root");
  if (!$conexion) {
    die('No se pudo conectar: ' . mysql_error());
  }

  mysql_select_db("osmautobur", $conexion);
  
  return $conexion;
}


/**
*Funcion haversine para hallar la distancia entre dos puntos dadas latitud y longitud.
**/
function haversine($lat1, $long1, $lat2, $long2){
  //Radio de la Tierra.
  $Radtierra=6371;

  //Convertir a radianes.
  $Rlat1 = deg2rad($lat1);
  $Rlat2 = deg2rad($lat2);
  $Rlong1 = deg2rad($long1);
  $Rlong2 = deg2rad($long2);

  //Formula Haversine.
  $d=acos(sin($Rlat1)*sin($Rlat2)+cos($Rlat1)*cos($Rlat2)*cos($Rlong2-$Rlong1))*$Radtierra;//km

  return $d*1000;
}


/**
*Funcion que devuelve la posicion de la parada de nodos_linea en buscando en el array latitud y longitud.
**/
function posicionParada($debug, $latitud_nodos_linea, $longitud_nodos_linea, $id){
    //Sacar la posicion del Array correspondiente a la posicion en la que esta la parada.
    $consulta_posicion_parada = mysql_query("SELECT latitud, longitud FROM parada_linea WHERE id_parada = '".$id."';");
    $array_posicion_parada = mysql_fetch_array($consulta_posicion_parada);
    
    //Todos los nodos de la linea.
    $k = count($latitud_nodos_linea)-1;
    
    while(count($latitud_nodos_linea)){
      if($array_posicion_parada["latitud"] == $latitud_nodos_linea[$k] && $array_posicion_parada["longitud"] == $longitud_nodos_linea[$k]){
	echo ($debug == true)? "posicion de la PARADA: ".$k." <b>LATITUD: ".$array_posicion_parada["latitud"]." LONGITUD: ".$array_posicion_parada["longitud"]."</b><br><br>" : "";
	return $k;
      }
      $k--;
    }
}
  

/**
*Numero de lineas que pertenecen a la parada.
**/
function numeroLineasParada($id){
  $consulta_lineas = mysql_query("SELECT DISTINCT(id_linea) FROM parada_linea WHERE id_parada = '".$id."';");
  return mysql_num_rows($consulta_lineas);
}
  
  
  /**
  *Devuelve Array numeroLineasParada.
  **/
  function arrayNumeroLineasParada($id){
    $consulta_lineas = mysql_query("SELECT DISTINCT(id_linea) FROM parada_linea WHERE id_parada = '".$id."';");
    return mysql_fetch_array($consulta_lineas);
  }
  
  
  /**
  *Devuelve posicion latitud y longitud de la parada.
  **/
  function latLonParada($id, $linea){
    $consulta_parada = mysql_query("SELECT latitud, longitud FROM parada_linea WHERE id_parada = '".$id."' AND id_linea = '".$linea."';");
    return mysql_fetch_array($consulta_parada);
  }
  
  
  /**
   *Funcion que calcula el tiempo dada una distancia y velocidad en metros.
   * @param type $distancia
   * @param type $velocidad
   * @return type 
   */
  function calculaTiempo($distancia, $velocidad){
    $tiempo = $distancia/$velocidad;
    if($tiempo/60 >= 1){
	//minutos.
        return (round(($tiempo/60) * 100) / 100)." min.";
    }else{
	//segundos.
	if((round(($tiempo) * 100) / 100) == 1){
	  return " >>saliendo>>";
	}else{
	  return (round(($tiempo) * 100) / 100)." seg.";
        }
    }
  }
  
  
  

$id = $_GET['id'];
  



//Sacar de la BBDD, 
if(isset($id)){
  echo ($debug == true)? "id de la parada en la BBDD: ".$id."<br>" : "";

  
  $conexion = conectar();
  
  
  if(numeroLineasParada($id)==1){
    //Pertenece solo a una linea.
    
    //Array de numeroLineasParada.
    $linea = arrayNumeroLineasParada($id);
    echo ($debug == true)? "pertenece a la linea: ".$linea[0]."<br>" : "";
    
    
    /*********************************************/
    /**Sacar la posicion actual de los autobuses**/
    /*********************************************/
    
    //Inicializacion de Arrays.
    $latitud_ruta_linea = array();
    $longitud_ruta_linea = array();
    

    /*$consulta_prueba_posicion = mysql_query("SELECT latitud, longitud FROM prueba_posicion;");
    
    while($array_ruta_linea = mysql_fetch_array($consulta_prueba_posicion)){
      $latitud_ruta_linea[] = $array_ruta_linea["latitud"];
      $longitud_ruta_linea[] = $array_ruta_linea["longitud"];
     echo ($debug == true)? "<b>POSICION DEL AUTOBUS: lat: ".$array_ruta_linea["latitud"]." lon: ".$array_ruta_linea["longitud"]."</b><br>" : "";
    }
    */
    
    //Sacar la posicion actual de los autobuses para esta linea.
    $consulta_ruta_linea = mysql_query("SELECT latitud, longitud FROM ruta_linea WHERE hora ='".date("G:i:s")."' AND id_linea = '".$linea[0]."' AND dia = '".$dia."';");

    //Volcarlo en un array.
    while($array_ruta_linea = mysql_fetch_array($consulta_ruta_linea)){
      $latitud_ruta_linea[] = $array_ruta_linea["latitud"];
      $longitud_ruta_linea[] = $array_ruta_linea["longitud"];
      //echo "<b>POSICION DEL AUTOBUS: lat: ".$array_ruta_linea["latitud"]." lon: ".$array_ruta_linea["longitud"]."</b><br>";
    }
    
    
    
    //contamos el numero de latitud o longitud.
    $hasta = count($latitud_ruta_linea);
    
    echo ($debug == true)? "AUTOBUSES EN CIRCULACION: ".$hasta."<br>" : "";
    
    
    //Solo buscamos si el numero de autobuses circulando es mayor de 0.
    if($hasta > 0){
      
      
      /*******************************************************************/
      /********************TODA LA LINEA NODOS_LINEA**********************/
      /*******************************************************************/
      
      //Sacar todo el nodo_linea correspondiente a esta parada.
      $consulta_nodo_linea = mysql_query("SELECT id_nodo, latitud, longitud FROM nodos_linea WHERE id_linea = '".$linea[0]."' ORDER BY id_nodo ASC;");
      
      
      //Inicializacion de Arrays.
      $id_nodos_linea = array();
      $latitud_nodos_linea = array();
      $longitud_nodos_linea = array();
      
      //Volcarlo en un array.
      while($array_nodo_linea = mysql_fetch_array($consulta_nodo_linea)){
	//lo cargamos en el array.
        $id_nodos_linea[] = $array_nodo_linea["id_nodo"];
	$latitud_nodos_linea[] = $array_nodo_linea["latitud"];
	$longitud_nodos_linea[] = $array_nodo_linea["longitud"];
      }
      
      /*******************************************************************/
      /******************FIN TODA LA LINEA NODOS_LINEA********************/
      /*******************************************************************/
      
      
      
      /*******************************************************************/
      /***************NOMBRE Y VELOCIDAD MEDIA DE LA LINEA****************/
      /*******************************************************************/
      $consulta_linea = mysql_query("SELECT id_linea, nombre, velocidadmedia FROM linea WHERE id_linea = '".$linea[0]."';");
      $informacion = mysql_fetch_array($consulta_linea);
      
      $linea = $informacion["id_linea"];
      
      $nombre = $informacion["nombre"];

      //Velocidad a metros por segundo.
      $velocidad = ($informacion["velocidadmedia"]/3.6);
      
      /*******************************************************************/
      /*************FIN NOMBRE Y VELOCIDAD MEDIA DE LA LINEA**************/
      /*******************************************************************/
      
      
      
      /*******************************************************************/
      /*********************CALCULO TIEMPO RESTANTE***********************/
      /*******************************************************************/
      
      $cadena = '<table>
      <thead>
        <tr>
          <th>Linea</th>
          <th style="width: 200px;">nombre</th>
          <th>tiempo</th>
        </tr>
      </thead>
      <tbody>';
      $distanciaAcumulada = 0;
      //$i = count($latitud_nodos_linea)-1;
      $i = posicionParada($debug, $latitud_nodos_linea, $longitud_nodos_linea, $id);
      $contanodos = 0;
      
      $salir = true;
      //Recorrer los arrays inversamente hasta encontrar las latitudes y longitudes. 
      //Entonces aplicar haversine. y despues funcion de espacio/tiempo.
      while($salir){
	//hasta que llegue al tamaño de latitud o longitud -1.
        echo ($debug == true)? "i: ".$i."<br>" : "";
        echo ($debug == true)? "<b>(i-1)=".($i-1)." latitud anterior: ".$latitud_nodos_linea[$i-1]." longitud anterior: ".$longitud_nodos_linea[$i-1]." (i)=".$i." latitud actual: ".$latitud_nodos_linea[$i]." longitud actual: ".$longitud_nodos_linea[$i]."</b><br>" : "";
        $distancia = haversine($latitud_nodos_linea[$i-1], $longitud_nodos_linea[$i-1], $latitud_nodos_linea[$i], $longitud_nodos_linea[$i]);
        $distanciaAcumulada += $distancia;
	echo ($debug == true)? "Distancia entre los anteriores: ".$distancia."<br>" : "";
        echo ($debug == true)? "Distancia acumulada: ".$distanciaAcumulada."<br><br>" : "";
        
	//Comparar latitud nodos linea con todos lo elementos de latitud ruta linea.
	for($j = count($latitud_ruta_linea)-1; $j>=0 ;$j--){
	
	  if($latitud_nodos_linea[$i-1] == $latitud_ruta_linea[$j] && $longitud_nodos_linea[$i-1] == $longitud_ruta_linea[$j]){
	    //Hemos encontrado la latitud y longitud.
	    echo ($debug == true)? "coinciden unos nodos" : "";
	    
	    $cadena = $cadena."<tr>
                  <td>".$linea."</td>
                  <td>".$nombre."</td>
                  <td>".calculaTiempo($distanciaAcumulada,$velocidad)."</td>
                                      </tr>";
	    //echo "<b> tiempo: ".calculaTiempo($distanciaAcumulada,$velocidad)."</b><br>";
            //echo "<br><b>Distancia: ".$distanciaAcumulada." --> tiempo: ".calculaTiempo($distanciaAcumulada,$velocidad)."</b><br>";
            
	    $contanodos++;
	    //echo "contanodos: ".$contanodos." hasta: ".$hasta."<br>";
	    if($contanodos == $hasta){
	      //Salimos.
	      $salir=false;
	      break;
	    }
	  }
	  //echo "dentro for <br>";
	}
	$i--;
	if($i==0){
	  $i = count($latitud_nodos_linea)-1;
	}
      }
      
      echo $cadena."</tbody>
   </table>";
      //echo "SALE DEL BUCLE";
      
      /*******************************************************************/
      /*******************FIN CALCULO TIEMPO RESTANTE*********************/
      /*******************************************************************/
      
      
      
      /*******************************************************************/
      /*************************IMPRIMIR EL ARRAY*************************/
      /*******************************************************************/
      
      if($debug == true){
        echo "<br><br>";
        echo "<br><b>CONTENIDO ARRAY</b><br>";
        $i=0;
        while(count($latitud_nodos_linea) != $i){
            echo "i: ".$i." id_nodo= ".$id_nodos_linea[$i]." latitud: ".$latitud_nodos_linea[$i]." longitud: ".$longitud_nodos_linea[$i]."<br>";
            $i++;
        }
      }
      
      /*******************************************************************/
      /***********************FIN IMPRIMIR EL ARRAY***********************/
      /*******************************************************************/
      
      
      
      
    }else{
      echo "No hay autobuses en circulaci&oacute;n.";
    }
    
    
  }else{
    //pertenece a varias lineas.
    echo "pertenece a varias lineas.";
  }
  
}else{
  echo "<b>Error</b>";
}

?>
<!--<br><br><br>
   <table>
      <thead>
        <tr>
          <th>Linea</th>
          <th style="width: 200px;">nombre</th>
          <th>tiempo</th>
        </tr>
      </thead>
      <tbody>
                          <tr>
                  <td>27</td>
                  <td>Chemiepark</td>
                  <td>15:06</td>
                                      </tr>
                              <tr>
                  <td>27</td>
                  <td>Fernheizkra</td>
                  <td>15:12</td>
                                      </tr>
                    </tbody>
   </table>-->
