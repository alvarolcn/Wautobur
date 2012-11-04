// Mittelpunkt der Karte
var linzCenter = new OpenLayers.LonLat(14.3, 48.2985).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));

var initBoundingBox;
var map;
var stopsLayer;
var positionsLayer;

var lineNumbers = ["1","2","3","11","12","17","18","19","25","26","27","33","38","41","43","45","46","50","N1","N2","N3","N4","101","102","103","104","105","192"];
var lineFiles = ["geojson\/Strassenbahn_1.g","geojson\/Strassenbahn_2.g","geojson\/Strassenbahn_3.g","geojson\/Bus_Linie_11.g","geojson\/Bus_Linie_12.g","geojson\/Bus_Linie_17.g","geojson\/Bus_Linie_18.g","geojson\/Bus_Linie_19.g","geojson\/Bus_Linie_25.g","geojson\/Bus_Linie_26.g","geojson\/Bus_Linie_27.g","geojson\/Bus_Linie_33.g","geojson\/Bus_Linie_38.g","geojson\/Bus_Linie_41.g","geojson\/Bus_Linie_43.g","geojson\/Bus_Linie_45.g","geojson\/Bus_Linie_46.g","geojson\/Strassenbahn_50.g","geojson\/Strassenbahn_N1.g","geojson\/Bus_Linie_N2.g","geojson\/Bus_Linie_N3.g","geojson\/Bus_Linie_N4.g","geojson\/Bus_Linie_101.g","geojson\/Bus_Linie_102.g","geojson\/Bus_Linie_103.g","geojson\/Bus_Linie_104.g","geojson\/Bus_Linie_105.g","geojson\/Bus_Linie_192.g"];
var lineStyles = [{"strokeWidth":3,"strokeColor":"#e41d25"},{"strokeWidth":3,"strokeColor":"#e41d25"},{"strokeWidth":3,"strokeColor":"#e41d25"},{"strokeWidth":2,"strokeColor":"#ee7f01"},{"strokeWidth":2,"strokeColor":"#008035"},{"strokeWidth":2,"strokeColor":"#ee7f01"},{"strokeWidth":2,"strokeColor":"#006ab3"},{"strokeWidth":2,"strokeColor":"#eb6ea3"},{"strokeWidth":2,"strokeColor":"#d49d04"},{"strokeWidth":2,"strokeColor":"#0072b7"},{"strokeWidth":2,"strokeColor":"#96bf0d"},{"strokeWidth":2,"strokeColor":"#742c86"},{"strokeWidth":2,"strokeColor":"#ee7f01"},{"strokeWidth":2,"strokeColor":"#db021b"},{"strokeWidth":2,"strokeColor":"#00ace2"},{"strokeWidth":2,"strokeColor":"#d6a31b"},{"strokeWidth":2,"strokeColor":"#00ace2"},{"strokeWidth":3,"strokeColor":"#55ab26"},{"strokeWidth":3,"strokeColor":"#e41d25"},{"strokeWidth":2,"strokeColor":"#1b62b7"},{"strokeWidth":2,"strokeColor":"#8fd34e"},{"strokeWidth":2,"strokeColor":"#b90d8e"},{"strokeWidth":2,"strokeColor":"#fbba00"},{"strokeWidth":2,"strokeColor":"#9e711b"},{"strokeWidth":2,"strokeColor":"#9e711b"},{"strokeWidth":2,"strokeColor":"#679b1c"},{"strokeWidth":2,"strokeColor":"#a5b2d7"},{"strokeWidth":2,"strokeColor":"#907cb4"}];
var lfids = {"1":[1,2],"2":[3,4],"3":[5,6],"11":[9,10],"12":[11,12],"17":[13,14],"18":[15,16],"19":[17,18],"25":[19,20],"26":[21,22],"27":[23,24],"33":[25,26],"38":[35,36],"41":[27,28],"43":[29,30],"45":[31,32],"46":[33,34],"50":[49,50],"N1":[7,8],"N2":[59,60],"N3":[61,62],"N4":[63,64],"101":[37,38],"102":[39,40],"103":[41],"104":[43,44],"105":[45,46],"192":[47,48]};
var shownLfids = [1,2,3,4,5,6,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,35,36,27,28,29,30,31,32,33,34,49,50,7,8,59,60,61,62,63,64,37,38,39,40,41,43,44,45,46,47,48];
var markers = {"1":"markers\/Stra\u00dfenbahn_1.gif","2":"markers\/Stra\u00dfenbahn_1.gif","3":"markers\/Stra\u00dfenbahn_2.gif","4":"markers\/Stra\u00dfenbahn_2.gif","5":"markers\/Stra\u00dfenbahn_3.gif","6":"markers\/Stra\u00dfenbahn_3.gif","7":"markers\/Stra\u00dfenbahn_N1.gif","8":"markers\/Stra\u00dfenbahn_N1.gif","9":"markers\/Bus_Linie_11.gif","10":"markers\/Bus_Linie_11.gif","11":"markers\/Bus_Linie_12.gif","12":"markers\/Bus_Linie_12.gif","13":"markers\/Bus_Linie_17.gif","14":"markers\/Bus_Linie_17.gif","15":"markers\/Bus_Linie_18.gif","16":"markers\/Bus_Linie_18.gif","17":"markers\/Bus_Linie_19.gif","18":"markers\/Bus_Linie_19.gif","19":"markers\/Bus_Linie_25.gif","20":"markers\/Bus_Linie_25.gif","21":"markers\/Bus_Linie_26.gif","22":"markers\/Bus_Linie_26.gif","23":"markers\/Bus_Linie_27.gif","24":"markers\/Bus_Linie_27.gif","25":"markers\/Bus_Linie_33.gif","26":"markers\/Bus_Linie_33.gif","35":"markers\/Bus_Linie_38.gif","36":"markers\/Bus_Linie_38.gif","27":"markers\/Bus_Linie_41.gif","28":"markers\/Bus_Linie_41.gif","29":"markers\/Bus_Linie_43.gif","30":"markers\/Bus_Linie_43.gif","31":"markers\/Bus_Linie_45.gif","32":"markers\/Bus_Linie_45.gif","33":"markers\/Bus_Linie_46.gif","34":"markers\/Bus_Linie_46.gif","37":"markers\/Bus_Linie_101.gif","38":"markers\/Bus_Linie_101.gif","39":"markers\/Bus_Linie_102.gif","40":"markers\/Bus_Linie_102.gif","41":"markers\/Bus_Linie_103.gif","43":"markers\/Bus_Linie_104.gif","44":"markers\/Bus_Linie_104.gif","45":"markers\/Bus_Linie_105.gif","46":"markers\/Bus_Linie_105.gif","47":"markers\/Bus_Linie_192.gif","48":"markers\/Bus_Linie_192.gif","49":"markers\/Stra\u00dfenbahn_50.gif","50":"markers\/Stra\u00dfenbahn_50.gif","59":"markers\/Bus_Linie_N2.gif","60":"markers\/Bus_Linie_N2.gif","61":"markers\/Bus_Linie_N3.gif","62":"markers\/Bus_Linie_N3.gif","63":"markers\/Bus_Linie_N4.gif","64":"markers\/Bus_Linie_N4.gif"};

var lfidFilter = new OpenLayers.Filter.Function({
  evaluate: function(feature) {
    return shownLfids.indexOf(feature.attributes.lfid) != -1;
  }
});

var timeout;

function initMap() {
  initOSMMap();
  addLineLayers();
  addStopsLayer();
  addPositionsLayer();
  initStopPopups();
}

function initOSMMap() {
  // Karten-Objekt erzeugen
  map = new OpenLayers.Map("map", {
    controls: [new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoomBar()],
    //restrictedExtent: new OpenLayers.Bounds(14.15, 48.18, 14.45, 48.4).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")),
    //maxExtent: new OpenLayers.Bounds(-200000, -200000, 200000, 200000),
    //maxResolution: 156543,
    //numZoomLevels: null,
    //minZoomLevel: 5,
    //maxZoomLevels: 19,
    units: 'm',
    eventListeners: {
      'moveend': function() {
        if(positionsLayer) {
          positionsLayer.protocol.params.bbox = map.getExtent().transform(map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326')).toBBOX();
        }
      }
    }
  });

  // "PanZoomBar" etwas nach unten verschieben
  map.controls[1].div.style.marginTop = "60px";

  // OpenStreetMap-Layer hinzufügen
  map.addLayer(new OpenLayers.Layer.OSM());

  // Karte auf Linz zentrieren
  map.setCenter(linzCenter, 14);

  // initiales Bounding-Box-Objekt erzeugen
  initBoundingBox = new OpenLayers.Bounds(linzCenter.lon - 10000, linzCenter.lat - 10000, linzCenter.lon + 10000, linzCenter.lat + 10000).transform(map.getProjectionObject(), new OpenLayers.Projection('EPSG:4326'));
}

function addLineLayers() {
  var layer;
  for(var i = 0; i < lineNumbers.length; i++) {
    layer = new OpenLayers.Layer.Vector("Linie " + lineNumbers[i], {
      strategies: [new OpenLayers.Strategy.Fixed()],
      protocol: new OpenLayers.Protocol.HTTP({
        url: lineFiles[i],
        format: new OpenLayers.Format.GeoJSON()
      })
    });
    layer.style = lineStyles[i];
    layer.style.strokeOpacity = 0.8;
    //layer.style.strokeColor = "#666666";
    map.addLayer(layer);
  }
}

function addStopsLayer() {
  stopsLayer = new OpenLayers.Layer.Vector("Haltestellen", {
    strategies: [new OpenLayers.Strategy.Fixed(), new OpenLayers.Strategy.Filter({ filter: lfidFilter })],
    protocol: new OpenLayers.Protocol.HTTP({
      url: "get_stops.php",
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
      url: "get_positions.php",
      params: { bbox: initBoundingBox.toBBOX() },
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
            html = feature.attributes.name + "<br />Linie&nbsp;" + feature.attributes.number + "&nbsp;" + feature.attributes.direction;
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
