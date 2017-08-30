angular.module('adventureMap.mapService', [])
  .service('MapService', function ($http) {
    var watchOptions = {
      maximumAge: 30000,
      timeout: 5000,
      enableHighAccuracy: true // may cause errors if true
    };

    var watch = null;
    var markers = [];

    // Service methods
    var initiateMapFunction = function(element) {
      var openStreetMap =  L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        maxZoom: 16
      });

      var combinedSweden = L.tileLayer.wms('https://lacunaserver.se/mapproxy/service?',
        {
          layers: 'combined_sweden',
          transparent: true,
          format: 'image/png',
          attribution: "<a href='http://adventuremap.se'>AdventureMap</a>"
        });

      map = new L.Map(element, {
        layers: [openStreetMap, combinedSweden],
        attribution: false,
        tileSize: 512,
        continuousWorld: true,
        zoomControl: false
      });

    };
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
        //console.log(route);
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
    };

    var clearRouteFunction = function (map){
      clearLines(map);
      map.removeLayer(markers[0]);
      markers.splice(0, 1);
    };

    var addClustersFunction = function (map) {

      var clusterOptions = {
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: true,
        maxClusterRadius: 100, // could preferably be set by screen dpi or current zoomlevel
        animate: true
      };

      // add layers and layer control

      var overlayMaps = {
        badplatserWfs: L.markerClusterGroup(clusterOptions).addTo(map),
        vindskyddWfs: L.markerClusterGroup(clusterOptions).addTo(map)
      };

      // define marker options
      var badplatsIcon = L.icon({
        iconUrl: 'img/marker-flag-green.png',
        iconAnchor: [16, 16]
      });
      var vindskyddIcon = L.icon({
        iconUrl: 'img/marker-flag-blue.png',
        iconAnchor: [16, 16]
      })
      var badplatsMarker = {
        icon: badplatsIcon
      };
      var vindskyddMarker = {
        icon: vindskyddIcon
      };

      loadWfsPoints('adventuremap:badplatser', overlayMaps.badplatserWfs, badplatsMarker);
      loadWfsPoints('adventuremap:vindskydd', overlayMaps.vindskyddWfs, vindskyddMarker);
    };

    // Support methods

    // Draw reoute
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

    // Clear route
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

    // Load geoJson from WFS and add the points to the provided cluster
    function loadWfsPoints(layerName, clusterLayer, markerOptions) {
      var owsrootUrl = 'https://lacunaserver.se/geoserver/ows';

      var defaultParameters = {
        service: 'WFS',
        version: '2.0',
        request: 'GetFeature',
        typeName: layerName,
        outputFormat: 'text/javascript',
        format_options: 'callback:JSON_CALLBACK',
        SrsName: 'EPSG:4326'
      };

      var parameters = L.Util.extend(defaultParameters);
      var URL = owsrootUrl + L.Util.getParamString(parameters);
      console.log(URL);

      $http.jsonp(URL, {jsonpCallbackParam: 'parseResponse'}).success(function (response) {
        var point = L.geoJson(response, {
          pointToLayer: function (feature, latlng) {
            return L.marker(latlng, markerOptions);
          }
        });
        clusterLayer.addLayer(point);
      });
    }


    return {
      initiateMap: initiateMapFunction,
      startTracking: startTrackingFunction,
      stopTracking: stopTrackingFunction,
      addToMap: addToMapFunction,
      clearRoute: clearRouteFunction,
      addClusters: addClustersFunction

    };
  });
