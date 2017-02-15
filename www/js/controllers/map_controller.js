
function mapController($cordovaGeolocation) {

  let posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      let lat  = position.coords.latitude;
      let long = position.coords.longitude;
      console.log(lat + ', ' + long);
      mymap.setView([lat, long], 10); // Center the map on user's geolocation after it loads.
    }, function(err) {
      // error
    });


  // Create a map, center it on Gothenburg.
  const mymap = L.map('mapContainer', {
    zoomControl: false
  })
    .setView([57.7, 11.97], 10);

  // Add zoom controls
  L.control.zoom({
    position: 'bottomleft'
  }).addTo(mymap);

  // A marker example
  L.marker([57.6, 11.97]).addTo(mymap);


  // The map "tile layer"
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.outdoors',
    accessToken: 'pk.eyJ1IjoiYXF1YWFtYmVyIiwiYSI6ImNpejVreGVxNzAwNTEyeXBnbWc5eXNlcTYifQ.ah37yE5P2LH9LVzNelgymQ'
  }).addTo(mymap);
}
