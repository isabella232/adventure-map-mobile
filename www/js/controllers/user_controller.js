function userController($scope, $ionicPlatform, md5) {
  console.log('user controller');
  $scope.files = [];
  $scope.profileImage = function () {
    if ($scope.user.id !== undefined) {
      if ($scope.user.image) {
        return $scope.user.image;
      } else {
        var options = {size: 128, format: 'svg'};

        var hashedEmail = md5.createHash($scope.user.email);
        return 'data:image/svg+xml;base64,' + new Identicon(hashedEmail, options).toString();
      }
    }
  };

  $ionicPlatform.ready(function () {
    try {
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
        var directoryReader = dirEntry.createReader();
        directoryReader.readEntries(dirSuccess, dirFail);
      });
    } catch (e) {
      console.log("Corvova plugins aren't available in browsers.");
      console.log(e);
    }

    function dirSuccess(entries) {
      console.log("INFO: Listing entries");
      var i;
      for (i = 0; i < entries.length; i++) {
        var timeStampFromFileName = new Date(parseFloat(entries[i].name.replace(/\.[^/.]+$/, "")));
        $scope.files.push({
          fileName: entries[i].name,
          date: timeStampFromFileName
        });
      }
    }

    function dirFail(error) {
      console.log("Failed to list directory contents: " + error.code);
    }
  });
}
