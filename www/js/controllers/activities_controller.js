function activitiesController($scope,
                              $q,
                              $ionicLoading,
                              $localStorage,
                              $auth,
                              $ionicModal,
                              $ionicPopup,
                              $cordovaGeolocation,
                              Activity,
                              ActivityDetail,
                              Filters,
                              S3FileUpload,
                              FileService,
                              Utilities,
                              DIFFICULTY_WORDS,
                              CATEGORY_ICONS,
                              CATEGORY_WORDS) {

  setState();
  $scope.activity = {};
  $scope.uploadedImages = [];
  $scope.uploadedFiles = [];

  $ionicModal.fromTemplateUrl('templates/activities/filter_modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.filterModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/activities/create.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.createModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/activities/pick_files.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.filesModal = modal;
  });

  $scope.$on("$ionicView.enter", function (scopes, states) {
    if (states.stateName === "app.activities") {
      $auth.validateUser().then(function (resp) {
        console.log('validated');
        console.log(resp);
        $ionicLoading.show({
          template: 'Getting activities...'
        });

        getActivities();
      });
    }
  });

  $scope.createActivity = function () {
    $ionicLoading.show({
      template: 'Saving...'
    });

    $auth.validateUser().then(function (resp) {
      Activity.save($scope.activity, function (resp) {
        // Loop through uploadedImages and send them to the server
        addImages(resp.data.id);
        addFiles(resp.data.id);

        $ionicLoading.hide();
        $scope.createModal.hide();
        getActivities();
      }, function (resp) {
        $scope.errors = resp.data.message;
        $ionicLoading.hide();
      });
    });
  };

  $scope.setFilters = function () {
    // reset no-results-found message
    $scope.activityData.message = undefined;
    Filters.applyFilters($scope);
    $scope.filterModal.hide();
  };

  function getActivities() {
    Activity.query(function (response) {
      console.log(response);
      // Sort by date
      $scope.activityData.activityList = response.data;

      $scope.activityData.activityList.forEach(function(activity){
        var index = $scope.activityData.activityList.indexOf(activity);
        $scope.activityData.activityList[index].images = Utilities.sanitizeArrayFromNullObjects(activity.images);
      });
      $scope.activityData.activityList.sort(function (a, b) {
        return Date.parse(b.created_at) - Date.parse(a.created_at);
      });

      $scope.activityData.cachedActivities = $scope.activityData.activityList; // This keeps the entire activity list so users can un-filter.

      // Apply filters on page load if there is a default filter
      if ($localStorage.defaultFilter) {
        Filters.applyFilters($scope);
      }
      $ionicLoading.hide();
    }, function (response) {
      $ionicLoading.hide();
      $scope.errors = response.data.errors;
    });
  }

  function setState() {
    $scope.activityData = $scope.activityData || {activityData: {}};
    $scope.activityData.filters = $localStorage.defaultFilter || {};
    $scope.activityData.filters.default = false;
    $scope.activityData.message = undefined;
    $scope.category_icons = CATEGORY_ICONS;
    $scope.categories = CATEGORY_WORDS;
    $scope.difficulty_words = DIFFICULTY_WORDS;

    // Set default filters - these should change based on the user's default filter.
    if (!$localStorage.defaultFilter) {
      $scope.activityData.filters.category = [];
      for (var i = 1; i < 11; i++) {
        $scope.activityData.filters.category[i] = true;
      }
      $scope.activityData.filters.difficulty1 = true;
      $scope.activityData.filters.difficulty2 = true;
      $scope.activityData.filters.difficulty3 = true;
      $scope.activityData.filters.follow = true;
    }
  }

  $scope.openPicker = function (type) {
    $scope.files = [];
    $q.when(FileService.readDirectory(window, type)).then(function (response) {
      $scope.files = response;
      console.log($scope.files);
      $scope.filesModal.show();
    });
  };

  $scope.chooseFile = function (obj) {
    $scope.filesModal.hide();
    $ionicPopup.alert({
      title: 'You chose<br>' + obj.fileName,
      template: 'Do you want to attach this file to this activity?',
      buttons: [
        {
          text: 'Cancel',
          onTap: function (e) {
            return true;
          }
        },
        {
          text: 'Save',
          type: 'button-positive',
          onTap: function (e) {
            console.log(e);
            uploadFile(obj);
            return true;
          }
        }
      ]
    });
  };

  function uploadFile(obj) {
    var path = cordova.file.dataDirectory + obj.fileName;
    window.resolveLocalFileSystemURL(path, function success(fileEntry) {
      // Create file object using fileEntry
      fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function () {
          console.log("Successful file read: " + this.result);
          var textFile = new Blob([new Uint8Array(this.result)], {type: "text/plain"});
          textFile.name = file.name;

          S3FileUpload.upload(obj.type.toLowerCase(), textFile).then(
            function (file) {
              $scope.uploadedFiles.push(
                {
                  url: file.public_url,
                  type: obj.type
                }
              );
              $ionicLoading.hide();
            },
            function (response) {
              console.log(response);
              $ionicLoading.hide();
            }
          );
        };
        $ionicLoading.show({
          template: 'Uploading ' + obj.type + '...'
        });
        reader.readAsArrayBuffer(file);
      }, function () {
        console.log("Sorry, something went wrong and we couldn't read your file");
      });
      console.log("got file: " + fileEntry.fullPath);
    }, function () {
      // Perhaps we want to create the file?
      console.log("Sorry, something went wrong while creating file object");
    });
  }

  $scope.selectPhoto = function () {
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);
    navigator.camera.getPicture(function cameraSuccess(imageUri) {
      getFileEntry(imageUri);
    }, function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    }, options);
  };

  $scope.setLocation = function(){
    var posOptions = {
      maximumAge: 30000,
      timeout: 5000,
      enableHighAccuracy: true // may cause errors if true
    };

    var geolocation = $cordovaGeolocation.getCurrentPosition(posOptions);


    $ionicLoading.show({
      template: 'Loading current location...'
    });

    geolocation.then(function (position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      console.log(lat + ', ' + long);
      angular.extend($scope.activity, {lat: lat, lng: long});
      console.log($scope.activity);

      $ionicLoading.hide();
    }, function (err) {
      $ionicLoading.hide();
      console.log(err);
    });
    $ionicLoading.hide();

  };

  function addImages(activityId) {
    // If there are uploaded images, register them as activity details with the server.
    if ($scope.uploadedImages !== []) {
      $scope.uploadedImages.forEach(function (url) {
        ActivityDetail.save({id: activityId, file_attachment: url, attachment_type: 'Image'}, function (resp) {
          console.log(resp);
        });
      });
    }
  }

  function addFiles(activityId) {
    if ($scope.uploadedFiles !== []) {
      $scope.uploadedFiles.forEach(function (obj) {
        var type = obj.type;
        ActivityDetail.save({id: activityId, file_attachment: obj.url, attachment_type: type}, function (resp) {
          console.log(resp);
        });
      });
    }
  }

  function setOptions(srcType) {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: srcType,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true  //Corrects Android orientation quirks
    };
    return options;
  }

  function getFileEntry(imgUri) {
    window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {
      fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function () {
          console.log("Successful file read: " + this.result);
          var imageFile = new Blob([new Uint8Array(this.result)], {type: "image/jpeg"});
          imageFile.name = file.name;
          S3FileUpload.upload('images', imageFile).then(
            function (imageResp) {
              $scope.uploadedImages.push(imageResp.public_url);
              $ionicLoading.hide();
            },
            function (response) {
              console.log(response);
              $ionicLoading.hide();
            }
          );
        };
        $ionicLoading.show({
          template: 'Uploading image...'
        });
        reader.readAsArrayBuffer(file);
      }, function () {
        console.log("Sorry, something went wrong and we couldn't read your file");
      });
    }, function () {
      // Perhaps we want to create the file?
      console.log("Sorry, something went wrong while creating file object");
    });
  }

}
