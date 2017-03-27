function activitiesController($scope,
                              $state,
                              $ionicLoading,
                              $localStorage,
                              $auth,
                              $ionicModal,
                              Activity,
                              ActivityDetail,
                              Filters,
                              S3FileUpload,
                              DIFFICULTY_WORDS,
                              CATEGORY_ICONS,
                              CATEGORY_WORDS) {

  setState();
  $scope.activity = {};
  $scope.uploadedImages = [];

  $ionicModal.fromTemplateUrl('templates/activities/filter_modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.filterModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/activities/create.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.createModal = modal;
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

    $auth.validateUser().then(function(resp){
      Activity.save($scope.activity, function (resp) {
        // Loop through uploadedImages and send them to the server
        addImages(resp.data.id);

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

  // We should probably extract all this logic to a ratings directive
  $scope.toggleStars = function (star_id) {
    switch (star_id) {
      case 1:
        $scope.stars = [true, false, false, false, false];
        break;
      case 2:
        $scope.stars = [true, true, false, false, false];
        break;
      case 3:
        $scope.stars = [true, true, true, false, false];
        break;
      case 4:
        $scope.stars = [true, true, true, true, false];
        break;
      case 5:
        $scope.stars = [true, true, true, true, true];
        break;
      default:
        $scope.stars = [false, false, false, false, false];
    }
  };

  function getActivities() {
    Activity.query(function (response) {
      console.log(response);
      // Sort by date
      $scope.activityData.activityList = response.data.sort(function (a, b) {
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

    if ($localStorage.defaultFilter !== undefined)
      $scope.stars = $localStorage.defaultFilter.stars;
    else
      $scope.stars = [true, false, false, false, false];

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
      $scope.stars = [true, false, false, false, false];
    }
  }

  $scope.selectPhoto = function() {
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);

    navigator.camera.getPicture(function cameraSuccess(imageUri) {
      getFileEntry(imageUri);
    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");
    }, options);
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
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: srcType,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
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
