function createActivityController($scope,  $auth, $ionicLoading, $state, $cordovaImagePicker, Activity, ActivityDetail, S3FileUpload) {

  $scope.activityData = {};
  $scope.categories = ['Hiking', 'Cross country skiing', 'Back country skiing', 'Paddling', 'Mountain biking', 'Horse riding', 'Climbing', 'Snow mobiling', 'Cross country ice skating', 'Foraging'];
  $scope.uploadedImages = [];

  $scope.createActivity = function () {
    $ionicLoading.show({
      template: 'Saving...'
    });

    $auth.validateUser().then(function(resp){
      Activity.save($scope.activityData, function (resp) {
        // Loop through uploadedImages and send them to the server
        addImages(resp.data.id);
        // This takes you to the activities page, even if you created
        // an activity from the my-activities page.
        $state.go('app.activities');
        $ionicLoading.hide();
        console.log(resp);
      }, function (resp) {
        console.log(resp);
        $scope.errors = resp.data.message;
        $ionicLoading.hide();
      });
    });
  };

  $scope.selectPhotos = function() {
    openFilePicker();
  };

  function addImages(activityId) {
    // If there are uploaded images, register them as activity details with the server.
    if ($scope.uploadedImages !== []) {
      $scope.uploadedImages.forEach(function(url) {
        ActivityDetail.save({ id: activityId, file_attachment: url, attachment_type: 'Image' }, function (resp) {
          console.log(resp);
        });
      });
    }
  }

  function setOptions(srcType) {
    var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: srcType,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
  }

  function openFilePicker() {
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);

    navigator.camera.getPicture(function cameraSuccess(imageUri) {
      getFileEntry(imageUri);
    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");
    }, options);
  }

  function getFileEntry(imgUri) {
    window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {
      // Create file object using fileEntry
      fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {
          console.log("Successful file read: " + this.result);
          var imageFile = new Blob([new Uint8Array(this.result)], { type: "image/jpeg" });
          imageFile.name = file.name;

          S3FileUpload.upload('images', imageFile).then(
            function(imageResp) {
              $scope.uploadedImages.push(imageResp.public_url);
              $ionicLoading.hide();
            },
            // Image upload failed - Handle error
            function(response) {
              console.log(response);
              $ionicLoading.hide();
            }
          );
        };

        $ionicLoading.show({
          template: 'Uploading image...'
        });
        reader.readAsArrayBuffer(file);

      }, function() {
        console.log("Sorry, something went wrong and we couldn't read your file");
      });

      console.log("got file: " + fileEntry.fullPath);
    }, function () {
      // Perhaps we want to create the file?
      console.log("Sorry, something went wrong while creating file object");
    });
  }
}
