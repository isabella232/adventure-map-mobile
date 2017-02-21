angular
  .module('adventureMap.controllers', [])
  .controller('authController', authController)
  .controller('activitiesController', activitiesController)
  .controller('createActivityController', createActivityController)
  .controller('showActivityController', showActivityController)
  .controller('mapController', mapController)
  .controller('userController', userController);

function userController($scope, $ionicPlatform) {
  $scope.files = [];

  $ionicPlatform.ready(function () {
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
      var directoryReader = dirEntry.createReader();
      directoryReader.readEntries(dirSuccess, dirFail);
    });

    function dirSuccess(entries) {
      console.log("INFO: Listing entries");
      var i;
      for (i = 0; i < entries.length; i++) {
        var timeStampFromFileName = new Date(parseFloat(entries[i].name.replace(/\.[^/.]+$/, "")));
        $scope.files.push(
          {
            fileName: entries[i].name,
            date: timeStampFromFileName
          })
      }
    }

    function dirFail(error) {
      console.log("Failed to list directory contents: " + error.code);
    }

  });


}
