const map = L.map("map", {
  center: [41.8781, -87.6298],
  zoom: 11.5
  // layers: [
  //   layers.JAN, 
  //   layers.FEB,
  //   layers.MAR,
  //   layers.APR,
  //   layers.MAY,
  //   layers.JUN, 
  //   layers.JUL,
  //   layers.AUG,
  //   layers.SEP,
  //   layers.NOV, 
  //   layers.DEC
  // ]
});

var layers = {
    JAN: new L.LayerGroup(), 
    FEB: new L.LayerGroup(), 
    MAR: new L.LayerGroup(), 
    APR: new L.LayerGroup(), 
    MAY: new L.LayerGroup(), 
    Jun: new L.LayerGroup(), 
    Jul: new L.LayerGroup(), 
    AUG: new L.LayerGroup(), 
    SEP: new L.LayerGroup(), 
    NOV: new L.LayerGroup(), 
    DEC: new L.LayerGroup()
}

// 5 or more overlays makes controls.layers disappear
var overlays = {
  "January": layers.JAN, 
  "February": layers.FEB,
  "March": layers.MAR,
  "April": layers.APR,
  "May": layers.MAY,
  "June": layers.JUN, 
  "July": layers.JUL,
  "August": layers.AUG,
  "September": layers.SEP,
  "November": layers.NOV, 
  "December": layers.DEC
};




L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

const link = "static/data/chicago.geojson";

function scaleGreenRed(avgPrice) {
  r = avgPrice < 50 ? 255 : Math.floor(255-(avgPrice * 2-100)*255/100);
  g = avgPrice > 50 ? 255 : Math.floor((avgPrice * 2) * 255/100);
  return 'rgb(' + r +',' + g + ',0)';
}
// this will change with average price of the area (above), tempory test colors now
function chooseColor(neighbourhood) {
  switch (neighbourhood) {
  case "Near West Side":
    return "yellow";
  case "Lincoln Square":
    return "red";
  case "New City":
    return "orange";
  case "South Deering":
    return "dark green";
  case "Ashburn":
    return "purple";
  case "Ohare":
    return "pink";
  default:
    return "blue";
  }
}

d3.json(link).then(function(data) {
  L.geoJson(data, {
    style: function(feature) {
      return {
        color: "white",
        fillColor: chooseColor(feature.properties.neighbourhood),
        fillOpacity: 0.25,
        opacity: .5,
        dashArray: '3',
        weight: 1.5
      };
    },
    onEachFeature: function(feature, layer) {
      layer.on({
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.66
          });
        },
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.25
          });
        },
        click: function(event) {
          map.fitBounds(event.target.getBounds(), {padding: [100, 100]})
          .panTo(event.target.getCenter());
        }
      });
      layer.bindPopup("<h1>" + feature.properties.neighbourhood + "</h1> <hr> <h2>" + 'average cost' + "</h2>");
    }
  }).addTo(map);
}).catch(function(error) {
  console.log(error);
});


function optionChanged(newHood) {
  chooseColor(newHood);
  buildMetadata(newHood);
}

L.control.layers(null, overlays).addTo(map);






// init();



