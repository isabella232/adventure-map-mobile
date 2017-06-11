function profileController($scope,
                           $state,
                           $ionicLoading,
                           $ionicPlatform,
                           $localStorage,
                           $ionicModal,
                           MyActivities,
                           MyFollowers,
                           S3FileUpload,
                           Save,
                           User,
                           CATEGORY_WORDS,
                           md5) {


  var user = $scope.user;
  console.log(user);
  if (typeof(user.interest_list) === 'object') {
    user.interest_list = user.interest_list.join(', ')
  }


  $scope.selectAvatar = function () {
    console.log('getting avatar picker');
    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);
    navigator.camera.getPicture(function cameraSuccess(imageUri) {
      getAvatarAndUpdateUser(imageUri);
    }, function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    }, options);
  };

  showMyActivities = function () {
    console.log(user)
    $ionicLoading.show({
      template: 'Getting activities'
    })
    // Scope empties out at some point! That's why we need the user in $localStorage
    MyActivities.get({id: user.id}, function (resp) {
      console.log(resp)
      $ionicLoading.hide()
      if (resp.status === 'success') {
        // Sort by date
        $scope.myActivities = resp.data.sort(function (a, b) {
          return Date.parse(b.created_at) - Date.parse(a.created_at)
        })

        console.log(resp)
      } else {
        console.log('error ' + resp.message[0])
        $ionicPopup.alert({
          title: resp.message[0]
        })
      }
    }, function (resp) {
      $ionicLoading.hide()
    })
  }

  $scope.showMyActivities = function () {
    $ionicPlatform.ready(function () {
      showMyActivities()
    })
  }

  showFollows = function (request) {
    console.log(user);
    console.log(request);
    $ionicLoading.show({
      template: 'Getting users I follow...'
    })
    MyFollowers.get({request: request}, function (resp) {
      // console.log(resp);
      $ionicLoading.hide()
      if (resp.status == 'success') {
        // Sort by name
        $scope.myFollow = resp.users.sort(function (a, b) {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })

        console.log($scope.myFollow)
      } else {
        console.log('error ' + resp.message[0])
        $ionicPopup.alert({
          title: resp.message[0]
        })
      }
    }, function (resp) {
      $ionicLoading.hide()
    })
  }

  $scope.showFollows = function (request) {
    $ionicPlatform.ready(function () {
      // $window.location.reload(true);
      showFollows(request)
    })
  }

  showSavedActivities = function () {
    $ionicLoading.show({
      template: 'Getting my saved activities...'
    })
    Save.get(function (resp) {
      $ionicLoading.hide()
      if (resp.status === 'success') {
        $scope.mySaves = resp.data.sort(function (a, b) {
          if (a.created_at < b.created_at) return -1
          if (a.created_at > b.created_at) return 1
          return 0
        })
        console.log($scope.mySaves)
      } else {
        $ionicPopup.alert({
          title: resp.message[0]
        })
      }
    }, function (resp) {
      $ionicLoading.hide()
    })
  }

  $scope.showSavedActivities = function () {
    $ionicPlatform.ready(function () {
      showSavedActivities()
    })
  }

  $scope.othersProfileImage = function (index) {
    if ($scope.myFollow[index] !== undefined) {
      if ($scope.myFollow[index].image) {
        return $scope.myFollow[index].image
      } else {
        var options = {size: 50, format: 'svg'}

        var hashedName = md5.createHash($scope.myFollow[index].name)
        return 'data:image/svg+xml;base64,' + new Identicon(hashedName, options).toString()
      }
    }
  }

  $ionicModal.fromTemplateUrl('templates/profile/edit.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.editProfileModal = modal
  })

  $scope.openProfileEditor = function () {
    $scope.user.interest_list_booleans = []
    console.log('openProfileEditor $scope.user:');
    console.log($scope.user)
    if ($scope.user.interest_list) {
      translateUserInterestList()
    }
    $scope.editProfileModal.show()
  }

  $scope.updateProfile = function () {
    console.log($scope.user);

    $scope.user.interest_list = setInterestList().join(', ');
    User.update($scope.user, function (resp) {
      if (resp.status === 'success') {
        console.log(resp)
        $scope.editProfileModal.hide()
      }
    })
  }

  setInterestList = function () {
    var list = [];
    for (var i = 0; i <= 10; i++) {
      if ($scope.user.interest_list_booleans[i] === true) {
        list.push(CATEGORY_WORDS[i])
      }
    }
    console.log(list);
    return list
  }

  translateUserInterestList = function () {
    if (Array.isArray($scope.user.interest_list)) {
      translateInterestListForArray()
    } else {
      translateInterestListForString()
    }
    console.log($scope.user.interest_list_booleans)
  }

  translateInterestListForArray = function () {
    CATEGORY_WORDS.forEach(function (category, index) {
      $scope.user.interest_list.forEach(function (interest) {
        if (interest === category) {
          $scope.user.interest_list_booleans[index] = true
        }
      })

    })
  }

  translateInterestListForString = function () {
    CATEGORY_WORDS.forEach(function (category, index) {
      $scope.user.interest_list.split(', ').forEach(function (interest) {
        if (interest === category) {
          $scope.user.interest_list_booleans[index] = true
        }
      })
    })
  }

  // This is repetitive code. Extract to a service

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

  function getAvatarAndUpdateUser(imgUri) {
    window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {
      fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function () {
          console.log("Successful file read: " + this.result);
          var imageFile = new Blob([new Uint8Array(this.result)], {type: "image/jpeg"});
          imageFile.name = file.name;
          S3FileUpload.upload('images', imageFile).then(
            function (imageResp) {
              //Set the image attribute
              user.image = imageResp.public_url;
              User.update(user, function (resp) {
                if (resp.status === 'success') {
                  console.log(resp);
                  $state.reload();
                  //$scope.editProfileModal.hide()
                }
              })
              //$scope.uploadedImages.push(imageResp.public_url);
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
