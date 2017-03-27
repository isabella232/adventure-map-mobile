angular.module('adventureMap.fileService', [])

  .service('FileService', function ($q, $cordovaFile, $filter) {
    var saveToFileFunction = function (timestamp, route, type) {
      var date = $filter('date')(new Date(timestamp), 'yyyy-MM-d(h-mm)');
      var fileName = (type + '-' + date + ".txt");
      var routeObject = {
        file: fileName,
        createdAt: timestamp,
        route: route
      };
      var data = angular.toJson(routeObject, true);
      console.log(data);
      $cordovaFile.writeFile(cordova.file.dataDirectory, fileName, data, true)
        .then(function (success) {
          console.log(success);
          console.log('wrote to file: ' + fileName);
        }, function (error) {
          console.log('error in write');
          console.error(error.messageData);
        });
    };

    var readFileFunction = function(object, $scope){
      $cordovaFile.readAsText(cordova.file.dataDirectory, object.fileName)
        .then(function (content) {
          $scope.object = content;
          $scope.fileName = angular.fromJson(content).file;
          $scope.openModal()
        }, function (error) {
          // error
        });
    };

    var readDirectoryFunction = function(window, $scope){
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
        var directoryReader = dirEntry.createReader();
        directoryReader.readEntries(function(entries) {
          entries.forEach(function(entry) {
            $cordovaFile.readAsText(cordova.file.dataDirectory, entry.name)
              .then(function (content) {
                var fileContent = angular.fromJson(content);
                console.log("Reading file " + entry.name + '' + fileContent.createdAt);
                $scope.files.push({
                  fileName: entry.name,
                  date: fileContent.createdAt
                });
              }, function (error) {
                // error
              });
          }, function(error){
            console.log("Failed to list directory contents: " + error.code);
          });
        });
      });
    };

    return {
      saveToFile: saveToFileFunction,
      readDirectory: readDirectoryFunction,
      readFile: readFileFunction
    }
  });

