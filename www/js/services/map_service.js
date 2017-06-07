angular.module('adventureMap.mapService', [])
  .service('MapService', function () {
    var watchOptions = {
      maximumAge: 30000,
      timeout: 5000,
      enableHighAccuracy: true // may cause errors if true
    };

    var watch = null;
    var markers = [];

    var wmtsUrl = 'https://lacunaserver.se/mapproxy/wmts/combined_sweden/grid_sweden/{z}/{x}/{y}.png';

    // Service methods
    var startTrackingFunction = function (lat, long, map) {
      clearLines(map);
      var route = [];
      watch = window.navigator.geolocation.watchPosition(onSuccess, onError, watchOptions);
      console.log('Initial position: ' + lat + ', ' + long);
      //$scope.watching = true;
      function onSuccess(position) {
        var old_lat = lat;
        var old_long = long;
        lat = position.coords.latitude;
        long = position.coords.longitude;
        route.push({
          lat: lat,
          long: long,
          timestamp: position.timestamp,
          speed: position.coords.speed,
          heading: position.coords.heading,
          altitude: position.coords.altitude
        });
        drawLine(lat, long, old_lat, old_long, map);
        console.log(route);
      }

      function onError(err) {
        console.log(err);
      }
      return route;
    };

    var stopTrackingFunction = function (map, lat, long) {
      //clearLines(map);
      markers.push(L.marker([lat, long]).addTo(map));
      window.navigator.geolocation.clearWatch(watch);
    };

    var addToMapFunction = function (lat, long, map) {
      markers.push(L.marker([lat, long]).addTo(map));

      new L.TileLayer(wmtsUrl, {
        maxZoom: 9,
        minZoom: 0,
        continuousWorld: true,
        attribution: "<a href='http://adventuremap.se'>AdventureMap</a>"
      }).addTo(map);

      L.control.scale({
        imperial: false
      }).addTo(map);
    };

    var clearRouteFunction = function (map){
      clearLines(map);
      map.removeLayer(markers[0]);
      markers.splice(0, 1);
    };

    // Support methods
    function drawLine(lat, long, old_lat, old_long, map) {
      var polOptions = {
        color: 'blue',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
      };
      var pointA = new L.LatLng(old_lat, old_long);
      var pointB = new L.LatLng(lat, long);
      var pointList = [pointA, pointB];

      var polyline = new L.polyline(pointList, polOptions);
      polyline.addTo(map);
      map.setView([lat, long], 13);

    }

    function clearLines(map) {
      for (i in map._layers) {
        if (map._layers[i]._path != undefined) {
          try {
            map.removeLayer(map._layers[i]);
          }
          catch (e) {
            console.log("problem with " + e + map._layers[i]);
          }
        }
      }
    }

    return {
      startTracking: startTrackingFunction,
      stopTracking: stopTrackingFunction,
      addToMap: addToMapFunction,
      clearRoute: clearRouteFunction
    };
  });
