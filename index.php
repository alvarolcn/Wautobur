<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="de-AT" lang="de-AT" dir="ltr" >
  <head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <meta name="robots" content="index, follow" />
  <meta name="keywords" content="" />
  <meta name="description" content="" />
  <title>autobur</title>

    <script type="text/javascript" src="js/OpenLayers/OpenLayers.js"></script>
    <script type="text/javascript" src="js/map.js"></script>
    <script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.8.17.custom.min.js"></script>
    <script type="text/javascript" src="js/menu.js"></script>
    <script type="text/javascript" src="js/monitor.js"></script>
    <script type="text/javascript">
      //window.onload=hora;
      fecha = new Date("<?php echo date('d M Y G:i:s'); ?>");
      function hora(){
	var hora=fecha.getHours();
	var minutos=fecha.getMinutes();
	var segundos=fecha.getSeconds();
	if(hora<10){ hora='0'+hora;}
	if(minutos<10){minutos='0'+minutos; }
	if(segundos<10){ segundos='0'+segundos; }
	var fech=hora+":"+minutos+":"+segundos;
	document.getElementById('hora').innerHTML=fech;
	fecha.setSeconds(fecha.getSeconds()+1);
	setTimeout("hora()",1000);
      }
    </script>

    <link rel="stylesheet" href="css/styles.css" type="text/css" />
    <link rel="stylesheet" href="css/custom-theme/jquery-ui-1.8.17.custom.css" type="text/css" />
  </head>
  <body onload="initMap();initMenu();initMonitor();hora()">
    <div id="menu">
     <img src="imagenes/logotipo.png" width="70" height="70">
      <!--<h1>AutoBur 1.0</h1>-->
      <a onclick="$('#lines_dialog').dialog({ width: 600 })">líneas de autobuses</a>

      <a onclick="$('#infos_dialog').dialog({ width: 600 })">informaci&oacute;n</a>
      <a onclick="$('#about_dialog').dialog({ width: 400 })">acerca de</a>
      <div id="hora">
      
      </div>
    </div>
    <div id="map"></div>

    <div id="lines_dialog" title="líneas de autobuses" class="dialog">
      <a onclick="selectAllLines()">todas</a>
      <a onclick="selectNoLine()">ninguna</a>

    </div>

    <div id="infos_dialog" title="informaci&oacute;n" class="dialog">
      <p style="text-align: justify;"><strong>¿Que es autobur?</strong></p>
      <p style="text-align: justify;">Una aplicación web que calcula las posiciones estimadas de transporte público de Burgos visualizando las líneas en un mapa. Muestra los perfiles de línea, paradas de autobús y las posiciones actuales de transporte en la ciudad.</p>
      <p style="text-align: justify;"><strong>¿Qué características tiene la aplicación?</strong></p>
      <ul style="text-align: justify;">
        <li>Al hacer clic en las paradas aparecen los tiempos reales de salida y las líneas.</li>
        <li>Al hacer clic en el transporte se obtiene información sobre la próxima parada y los tiempos de llegada respectivos.</li>
        <li>En "lineas de autobuses" se puede mostrar u ocultar las líneas individualmente.</li>
      </ul>
      <p style="text-align: justify;"><strong>¿Se usan datos en tiempo real para el cálculo de la posición?</strong></p>

      <p style="text-align: justify;">Las posiciones han sido obtenidas de modo aproximado a partir de datos GPS de las lineas.</p>
    </div>

    <div id="about_dialog" title="acerca de" class="dialog">
      <p style="text-align: justify;">Este proyecto ha sido desarrollado usando datos libres del proyecto Openstreetmap e información geografica GPS.</p>
      <ul style="text-align: justify;">

        <li style="text-align: justify;">Alvaro Lara Cano</li>
        <li style="text-align: justify;">contacto@alvarolara.com</li>
        <li style="text-align: justify;">CC 2011-2012</li>
      </ul>
      <p style="text-align: right;"><span style="font-size: xx-small; color: #333333;">2012-2013</span></p>
    </div>

    <div id="monitor_dialog" class="dialog">
      
    </div>
  </body>
</html>
