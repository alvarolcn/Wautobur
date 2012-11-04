function initMenu() {
  // HTML für die Linienauswahl aufbauen
  var html = '<div>';
  for(var i = 0; i < lineNumbers.length; i++) {
    if(i % 10 == 0) {
      html += '</div><div>'
    }
    html += '<input type="checkbox" id="lines_checkbox_' + lineNumbers[i] + '" class="lines_checkbox" onclick="onLinesCheckboxClick(this)" checked="checked"/> ';
    html += '<label for="lines_checkbox_' + lineNumbers[i] + '">Linie ' + lineNumbers[i] + '</label>';
    html += '<br />';
  }
  html += '</div>';
  $("#lines_dialog").prepend(html);

  // Infodialog mit Tabs darstellen
  //$("#infos_tabs").tabs();
}

function onLinesCheckboxClick(checkbox) {
  // Liniennummer holen
  var number = checkbox.id.substring(15);

  // Linienverlauf ein-/ausblenden
  map.getLayersByName("Linie " + number)[0].setVisibility(checkbox.checked);

  // Filter-Array für Haltestellen und Verkehrsmittel-Positionen aktualisieren
  for(var i = 0; i < lfids[number].length; i++) { // durchläuft die linienFahtrichtungsIds der Liniennummer
    if(checkbox.checked) {
      if(shownLfids.indexOf(lfids[number][i]) == -1) {
        shownLfids.push(lfids[number][i]);
      }
    } else {
      if(shownLfids.indexOf(lfids[number][i]) != -1) {
        shownLfids.splice(shownLfids.indexOf(lfids[number][i]), 1);
      }
    }
  }

  // Filter neu setzen
  // => Haltestellen- und Verkehrsmittel-Positionen werden ohne Server-Request aktualisiert
  stopsLayer.strategies[1].setFilter(lfidFilter);
  //positionsLayer.removeAllFeatures(); // "Spur" vermeiden
  positionsLayer.strategies[1].setFilter(lfidFilter);
}

function selectAllLines() {
  $(".lines_checkbox").each(
    function(key, checkbox) {
      if(checkbox.checked != (checkbox.checked = true)) { // alter Wert != neuer Wert
        onLinesCheckboxClick(checkbox);
      }
    }
  )
}

function selectNoLine() {
  $(".lines_checkbox").each(
    function(key, checkbox) {
      if(checkbox.checked != (checkbox.checked = false)) { // alter Wert != neuer Wert
        onLinesCheckboxClick(checkbox);
      }
    }
  )
}
