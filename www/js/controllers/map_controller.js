function mapController($scope, $cordovaGeolocation, $cordovaFile, $ionicLoading, $ionicPlatform, MapService) {
  var lat, long, map;

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

    map = L.map('map-container', {
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
      // error
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
