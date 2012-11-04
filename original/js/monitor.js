function initMonitor() {
  // Haltestellen und Verkehrsmittel-Positionen "klickbar" machen
  var clickControl = new OpenLayers.Control.SelectFeature([stopsLayer, positionsLayer], {
    clickFeature: function(feature) { // onSelect kann nicht verwendet werden (Features werden bereits bei "hover" selektiert)
      var title;
      if(feature.layer == stopsLayer) { // es wurde eine Haltestelle ausgewählt
        title = "Haltestelle " + feature.attributes.name;
        $('#monitor_dialog').html("<strong>Nächste Abfahrten:</strong><br />");
        OpenLayers.Request.GET({
          url: "get_next_departures.php?id=" + feature.attributes.id,
          success: function(response) {
            $('#loading_img').replaceWith(response.responseText);
          }
        });
      } else if(feature.layer == positionsLayer) { // es wurde ein Verkehrsmittel ausgewählt
        title = "Linie " + getLineNumberForLfid(feature.attributes.lfid); // + " / Kurs " + feature.attributes.course;
        $('#monitor_dialog').html("<strong>Nächste Haltestellen:</strong><br />");
        OpenLayers.Request.GET({
          url: "get_next_stops.php?lfid=" + feature.attributes.lfid + "&course=" + feature.attributes.course,
          success: function(response) {
            $('#loading_img').replaceWith(response.responseText);
          }
        });
      }
      $('#monitor_dialog').append('<img id="loading_img" src="pics/loading.gif" width="100" height="100" border="0" alt="Laden ..."/>');
      $('#monitor_dialog').dialog({ width: 360, title: title });
      this.unselect(feature);
    }
  });
  map.addControl(clickControl);
  clickControl.activate();
}

function getLineNumberForLfid(lfid) {
  for(var i in lfids) {
    if(lfids[i].indexOf(lfid) != -1) {
      return i;
    }
  }
  return -1;
}
