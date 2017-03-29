angular.module('adventureMap.fileService', [])

  .service('FileService', function ($q, $cordovaFile, $filter, $ionicPopup) {
    var saveToFileFunction = function (timestamp, route, type) {
      var date = $filter('date')(new Date(timestamp), 'yyyy-MM-d(h-mm)');
      var fileName = (type + '-' + date + ".txt");
      var routeObject = {
        file: fileName,
        createdAt: timestamp,
        type: type,
        route: route
      };
      var data = angular.toJson(routeObject, true);
      console.log(data);
      $cordovaFile.writeFile(cordova.file.dataDirectory, fileName, data, true)
        .then(function (success) {
          console.log(success);
          console.log('wrote to file: ' + fileName);
          var lat = routeObject.route.lat || routeObject.route[0].lat;
          var long = routeObject.route.long || routeObject.route[0].long;
          $ionicPopup.alert({
            title: 'Saved ' + type,
            template: 'Lat: ' + lat + '<br>Long: ' + long
          });
        }, function (error) {
          console.log('error in write');
          console.error(error.messageData);
        });
    };

    var readFileFunction = function (object, $scope) {
      $cordovaFile.readAsText(cordova.file.dataDirectory, object.fileName)
        .then(function (content) {
          $scope.object = content;
          $scope.fileName = angular.fromJson(content).file;
          $scope.openModal()
        }, function (error) {
          // error
        });
    };

    var readDirectoryFunction = function (window, type) {
      var deferred = $q.defer();
      var files = [];
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
        var directoryReader = dirEntry.createReader();
        directoryReader.readEntries(function (entries) {
          entries.forEach(function (entry) {
            if ("undefined" === typeof type) {
              $cordovaFile.readAsText(cordova.file.dataDirectory, entry.name)
                .then(function (content) {
                  var fileContent = angular.fromJson(content);
                  console.log("Reading file " + entry.name + ' ' + fileContent.createdAt);
                  files.push({
                    fileName: entry.name,
                    date: fileContent.createdAt
                  });
                  deferred.resolve(files);
                }, function (error) {
                  // error
                  deferred.reject(error);
                });
            } else {
              $cordovaFile.readAsText(cordova.file.dataDirectory, entry.name)
                .then(function (content) {
                  var fileContent = angular.fromJson(content);
                  console.log("Reading file " + entry.name + ' ' + fileContent.createdAt);
                  if (fileContent.type === type){
                    files.push({
                      fileName: entry.name,
                      type: type,
                      date: fileContent.createdAt
                    });
                  }
                  deferred.resolve(files);
                }, function (error) {
                  // error
                  deferred.reject(error);
                });
            }
          }, function (error) {
            console.log("Failed to list directory contents: " + error.code);
          });
        });
      });
      return deferred.promise
    };

    var chooseFileFunction = function (window, $scope) {
      $scope.files = [];

      $q.when(readDirectoryFunction(window, $scope)).then(function(result) {
        console.log('promise: ' + result);
      });
    };

    return {
      saveToFile: saveToFileFunction,
      readDirectory: readDirectoryFunction,
      readFile: readFileFunction,
      chooseFile: chooseFileFunction
    }
  });

