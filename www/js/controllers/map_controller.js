function mapController($scope, $cordovaGeolocation, $cordovaFile, $ionicLoading, $ionicPlatform, MapService) {
  var lat, long;
  var srs_code = 'EPSG:3006';
  var proj4def = '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
  var crs = new L.Proj.CRS(srs_code, proj4def, {
      resolutions: [
        4096, 2048, 1024, 512, 256, 128,64, 32, 16, 8
      ],
      origin: [-1200000.000000, 8500000.000000 ],
      bounds:  L.bounds( [-1200000.000000, 8500000.000000], [4305696.000000, 2994304.000000])
    });

  $scope.inProgress = false;
  $scope.currentRoute = [];
  $scope.hasRecording = false;

  $ionicPlatform.ready(function() {
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
    //document.getElementById("stop-tracking").addEventListener('click', MapService.stopTracking(map));

    $ionicLoading.show({
      template: 'Loading current location...'
    });

    geolocation.then(function (position) {
      lat = position.coords.latitude;
      long = position.coords.longitude;

      console.log(lat + ', ' + long);

      map.setView([lat, long], 13);
      MapService.addToMap(lat, long, map);
      $ionicLoading.hide();
      //document.getElementById("start-tracking").addEventListener('click', MapService.startTracking(lat, long, map));
    }, function (err) {
      console.log(err);
    });
  });

  $scope.startTracking = function(){
    $scope.inProgress = true;
    $scope.currentRoute = MapService.startTracking(lat, long, map);
  };

  $scope.stopTracking =  function(){
    $scope.inProgress = false;
    MapService.stopTracking(map, $scope.currentRoute[$scope.currentRoute.length - 1].lat, $scope.currentRoute[$scope.currentRoute.length - 1].long);
    $scope.hasRecording = true;
    console.log($scope.currentRoute);
    saveToFile($scope.currentRoute[0].timestamp, $scope.currentRoute)
  };

  $scope.clearRoute = function(){
    MapService.clearRoute(map);
  };

  function saveToFile(timestamp, route) {
    var fileName = (timestamp + ".txt");
    $cordovaFile.createFile(cordova.file.dataDirectory, fileName, true)
      .then(function (success) {
        console.log(success);
        console.log('created file: ' + fileName);
      }, function (error) {
        console.log(error);
      });

    $cordovaFile.writeFile(cordova.file.dataDirectory, fileName, route, true)
      .then(function (success) {
        console.log(success);
        console.log('wrote to file: ' + fileName);
      }, function (error) {
        console.log(error);
      });
  }
}
