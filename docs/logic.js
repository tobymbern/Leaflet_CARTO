// Function to determine marker size based on 

fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(response => {
  return response.json();
}).then(quake_data => {
  // Work with JSON data here


    function markerSize(magnitude) {
      return magnitude*15000;
    }

    function getColor(d) {
      return d < 1  ? '#458b00':
             d < 2  ? '#7fff00':
             d < 3  ? '#ffd700':
             d < 4  ? '#ffa500':
             d < 5  ? '#ff4500':
                      '#b22222';
  }



    // // An array containing all of the information needed to create city and state markers
    var locations = [];
    for (var i = 0; i < quake_data.features.length; i++){
      temp_dict = {}
      temp_dict.coordinates = [quake_data.features[i].geometry.coordinates[1], quake_data.features[i].geometry.coordinates[0]]
      temp_dict.info = {name: quake_data.features[i].properties.place, magnitude: quake_data.features[i].properties.mag}

      locations.push(temp_dict)
      }


    // Define arrays to hold created markers

    var Markers = [];

    // Loop through locations and create city and state markers
    for (var i = 0; i < locations.length; i++) {
      // Setting the marker radius for the state by passing population into the markerSize function
      Markers.push(
        L.circle(locations[i].coordinates, {
          stroke: false,
          fillOpacity: 0.75,
          color: getColor(locations[i].info.magnitude),
          fillColor: getColor(locations[i].info.magnitude),
          radius: markerSize(locations[i].info.magnitude)
        })
      );
      }

    // Define variables for our base layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

    var piratemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.pirates",
      accessToken: API_KEY
    });


    // Create two separate layer groups: one for cities and one for states
    var quakes = L.layerGroup(Markers);

    // Create a baseMaps object
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap,
      "Pirate Map": piratemap
    };

    // Create an overlay object
    var overlayMaps = {
      "Earthquakes": quakes,
    };

    // Define a map object
    var myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, quakes]
    });


    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
      }).addTo(myMap);


    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend');
      var labels = ['<strong>Strength of Earthquake</strong>'],
      categories = ['0-1','1-2','2-3','3-4','4-5','5+'];

      for (var i = 0; i < categories.length; i++) {

              div.HTML += 
              labels.push(
                  '<div id="circle" "style=background:' + getColor(i) + '"></div> ' +
                  (categories[i] ? categories[i] : '+'));

          }
          div.innerHTML = labels.join('<br>');
      return div;
    };


    legend.addTo(myMap);
    
  

});