// Latitud y longitud inicializadora del mapa.
var centro = new OpenLayers.LonLat(-3.70252, 42.34063).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));

var initBoundingBox;
var map;
var stopsLayer;
var positionsLayer;

//Numeros de lineas activas a mostrar.
var lineNumbers = ["1","2","3B"];

//Archivos GEOJson para las lineas.
var lineFiles = ["lineas/l1.g","lineas/l2.g","lineas/l3.g"];
//Colores para las lineas.
var lineStyles = [{"strokeWidth":4,"strokeColor":"#FF0000"},{"strokeWidth":4,"strokeColor":"#8800AA"},{"strokeWidth":4,"strokeColor":"#2CA02C"}];
//Relaciona las lineas entre si.
var lfids = {"1":[1],"2":[2],"3B":[3],};
//Numeros de lineas para relacionar.
var shownLfids = [1,2,3];
//Iconos de las lineas.
var markers = {"1":"lineas/l1.gif","2":"lineas/l2.gif","3B":"lineas/l3.gif"};

//Se asegura que la propiedad lfid de los GEOJson este en el shownLfids
//Devuelve el indice shownLfids de la linea del GEOJson.
var lfidFilter = new OpenLayers.Filter.Function({
  evaluate: function(feature) {
    return shownLfids.indexOf(feature.attributes.lfid) != -1;
  }
});

var timeout;

/**
 * Funcion que inicializa todo el mapa.
 * */
function initMap() {
  initOSMMap();
  addLineLayers();
  addStopsLayer();
  addPositionsLayer();
  initStopPopups();
}


function initOSMMap() {
  //Inicializacion
  map = new OpenLayers.Map("map", {
    controls: [new OpenLayers.Control.Navigation()],
    //restrictedExtent: new OpenLayers.Bounds(14.15, 48.18, 14.45, 48.4).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")),
    //maxExtent: new OpenLayers.Bounds(-200000, -200000, 200000, 200000),
    //maxResolution: 156543,
    //numZoomLevels: null,
    minZoomLevel: 5,
    maxZoomLevels: 19,
    units: 'm',
    eventListeners: {
      'moveend': function() {
        if(positionsLayer) {
          positionsLayer.protocol.params.bbox = map.getExtent().transform(map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326')).toBBOX();
        }
      }
    }
  });

  //Margen superior para los controles de zoom.
  //map.controls[1].div.style.marginTop = "60px";

  //array mapas mapquest open.
  arrayOSM = ["http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg",
	      "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg",
	      "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg",
	      "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.jpg"];
  //Capa Openstreetmap.
  //map.addLayer(new OpenLayers.Layer.OSM());
  map.addLayer(new OpenLayers.Layer.OSM("MapQuest-OSM Tiles", arrayOSM, {transitionEffect: 'resize'}));

  //Nivel de zoom del mapa.
  map.setCenter(centro, 14);

  // initiales Bounding-Box-Objekt erzeugen
  initBoundingBox = new OpenLayers.Bounds(centro.lon - 10000, centro.lat - 10000, centro.lon + 10000, centro.lat + 10000).transform(map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326'));
}

//Anade las lineas GEOJson al mapa.
function addLineLayers() {
  var layer;
  for(var i = 0; i < lineNumbers.length; i++) {
    layer = new OpenLayers.Layer.Vector("Linea " + lineNumbers[i], {
      strategies: [new OpenLayers.Strategy.Fixed()],
      protocol: new OpenLayers.Protocol.HTTP({
        url: lineFiles[i],
        format: new OpenLayers.Format.GeoJSON()
      })
    });
    layer.style = lineStyles[i];
    layer.style.strokeOpacity = 0.8;
    map.addLayer(layer);
  }
}

//Anade las paradas del GEOJson al mapa. 
function addStopsLayer() {
  stopsLayer = new OpenLayers.Layer.Vector("Parada", {
    strategies: [new OpenLayers.Strategy.Fixed(), new OpenLayers.Strategy.Filter({ filter: lfidFilter })],
    protocol: new OpenLayers.Protocol.HTTP({
      url: "paradas.php",
      format: new OpenLayers.Format.GeoJSON()
    })
  });
  var defaultStyle = new OpenLayers.Style({
    pointRadius: 3,
    strokeColor: "#ff0000",
    fillColor: "#ff0000"
  });
  var selectStyle = defaultStyle.clone();
  selectStyle.defaultStyle.cursor = "pointer";
  stopsLayer.styleMap = new OpenLayers.StyleMap({
    "default": defaultStyle, // "default" ist ein Schlüsselwort in Opera
    select: selectStyle
  });
  map.addLayer(stopsLayer);
}

function addPositionsLayer() {
  positionsLayer = new OpenLayers.Layer.Vector("Verkehrsmittel-Positionen", {
    strategies: [new OpenLayers.Strategy.Fixed(), new OpenLayers.Strategy.Filter({ filter: lfidFilter })],
	protocol: new OpenLayers.Protocol.HTTP({
      url: "posiciones.php",
      format: new OpenLayers.Format.GeoJSON()
    })
  });
  var defaultStyle = new OpenLayers.Style({
    pointRadius: 2,
    externalGraphic: "${getMarker}",
    graphicWidth: 20,
    graphicHeight: 40
  }, {
    context: {
      getMarker : function(feature) {
        return markers[feature.attributes.lfid];
      }
    }
  });
  var selectStyle = defaultStyle.clone();
  selectStyle.defaultStyle.cursor = "pointer";
  positionsLayer.styleMap = new OpenLayers.StyleMap({
    "default": defaultStyle, // "default" ist ein Schlüsselwort in Opera
    select: selectStyle
  });
  map.addLayer(positionsLayer);
  positionsLayer.events.register('loadend', positionsLayer, function(e) {
    var interval = 500 * (14 - map.getZoom()) + 2000; // 11
    if(interval < 1000) { // 2000
      interval = 1000; // 2000
    }
    if(interval > 5000) {
      interval = 5000;
    }
    if(timeout) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout('positionsLayer.refresh()', interval);
  });
}

//Recupera el tiempo restante para que llegue el bus en un Popup.
function initStopPopups() {
  var hoverControl = new OpenLayers.Control.SelectFeature([stopsLayer, positionsLayer], {
    hover: true,
    onSelect: function(feature) {
      if(feature.layer == stopsLayer) {
        if(!feature.popup) {
          var html;
          if(location.href.indexOf("?") == -1) {
            html = feature.attributes.name;
          } else {
            html = feature.attributes.name + "<br />Linea&nbsp;" + feature.attributes.number + "&nbsp;" + feature.attributes.direction;
          }
          feature.popup = new OpenLayers.Popup.Anchored("popup",
            feature.geometry.getBounds().getCenterLonLat(),
            null,
            html,
            null,
            false
          );
        }
        feature.popup.autoSize = true;
        feature.popup.calculateRelativePosition = function() { return "tl" };
        map.addPopup(feature.popup);
      }
    },
    onUnselect: function(feature) {
      if(feature.popup) {
        map.removePopup(feature.popup);
      }
    }
  });
  map.addControl(hoverControl);
  hoverControl.activate();
}

// Array.indexOf für IE
if (!Array.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = (start || 0); i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  }
}
