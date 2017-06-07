function mapController($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, MapService, FileService) {
  var lat, long;
  var srs_code = 'EPSG:3006';
  var proj4def = '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
  var crs = new L.Proj.CRS(srs_code, proj4def, {
    resolutions: [
      4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8
    ],
    origin: [-1200000.000000, 8500000.000000],
    bounds: L.bounds([-1200000.000000, 8500000.000000], [4305696.000000, 2994304.000000])
  });

  $scope.inProgress = false;
  $scope.currentRoute = [];
  $scope.hasRecording = false;

  $ionicPlatform.ready(function () {
    // called when ready
    var posOptions = {
      maximumAge: 30000,
      timeout: 5000,
      enableHighAccuracy: false
    };

    map = new L.Map('map-container', {
      crs: crs,
      continuousWorld: true,
      zoomControl: false
    });

    const geolocation = $cordovaGeolocation.getCurrentPosition(posOptions);

    $ionicLoading.show({
      template: 'Loading current location...'
    });

    geolocation.then(function (position) {
      $scope.currentLocation = setCurrentLocation(position);
      var lat = $scope.currentLocation.coords.lat;
      var long = $scope.currentLocation.coords.long;
      console.log(lat + ', ' + long);
      map.setView([lat, long], 16);
      MapService.addToMap(lat, long, map);
      $ionicLoading.hide();
    }, function (err) {
      console.log(err);
    });
  });


  //Menu navigation
  var element = angular.element(document.querySelector('.filter-btn'));

  $scope.toggleMenu = function () {

    if (element.hasClass('open')) {
      element.removeClass('open')
    } else {
      element.addClass('open');
    }
  };

  $scope.clearRoute = function () {
    MapService.clearRoute(map);
    element.removeClass('open');
    $scope.inProgress = false;
    $scope.hasRecording = false;
    $scope.currentRoute = [];
  };

  $scope.startTracking = function () {
    $scope.inProgress = true;
    $scope.currentRoute = MapService.startTracking(lat, long, map);
    element.removeClass('open');
  };

  $scope.stopTracking = function () {
    $scope.inProgress = false;
    MapService.stopTracking(map, $scope.currentRoute[$scope.currentRoute.length - 1].lat, $scope.currentRoute[$scope.currentRoute.length - 1].long);
    $scope.hasRecording = true;
    console.log($scope.currentRoute);
    element.removeClass('open');
    if (window.cordova) {
      FileService.saveToFile($scope.currentRoute[0].timestamp, $scope.currentRoute, 'Route');
    }
  };

  $scope.addWaypoint = function () {
    if (window.cordova) {
      FileService.saveToFile($scope.currentLocation.timestamp, $scope.currentLocation.coords, 'Waypoint');
    }
  };

  function setCurrentLocation(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    return {
      timestamp: position.timestamp,
      coords: {
        lat: lat,
        long: long
      }
    };
  }
}
