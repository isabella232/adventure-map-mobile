function showActivityController($scope,
                                $state,
                                $stateParams,
                                $ionicModal,
                                $ionicLoading,
                                $ionicSlideBoxDelegate,
                                $ionicPopup,
                                $http,
                                $localStorage,
                                $cordovaSocialSharing,
                                Activity,
                                Comment,
                                Follow,
                                LikeActivity,
                                UnlikeActivity,
                                SaveActivity,
                                UnsaveActivity,
                                Utilities,
                                MapService,
                                $ionicHistory) {

  var activityId;
  $scope.$on('$ionicView.loaded', function () {
    if ($stateParams.id) {
      activityId = $stateParams.id;
      getActivity(activityId);

    }
  });

  $scope.navigateToActivity = function (activity) {
    switch ($state.current.name) {
      case 'app.my-saved-activities':
        $state.go('app.profile-activity', {id: activity.id});
        break;
      case 'app.activities':
        $state.go('app.activity', {id: activity.id});
        break;
      case 'app.my-activities':
        $state.go('app.my-activity', {id: activity.id});
        break;
    }
  };

  $scope.navigateToUser = function (user) {
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    $state.go('app.users-profile', {id: user.id});
  };

  $scope.shareUsingFacebook = function (activity) {
    var user = $scope.user || $localStorage.user;
    $cordovaSocialSharing
      .shareVia('com.apple.social.facebook', composeShareContent(), 'AdventureMap', getImage(activity), null, function () {
        console.log('share ok')
      }, function (msg) {
        console.log('error: ' + msg)
      });

    function composeShareContent() {
      var content;
      content = activity.title + ' - ' + activity.body;
      if ( user.id == activity.user.id ) {
        return content;
      } else {
        return content.replace (/^/, 'By ' + activity.user.name + ': ');
      }
    }

    function getImage() {
      if (activity.images.length != 0) {
        return activity.images[0].file_attachment;
      } else {
        return null;
      }
    }
  };



  $scope.carouselOptions = {
    carouselId: 'image-carousel',
    align: 'right',
    selectFirst: true,
    centerOnSelect: true,
    template: 'templates/partials/image-carousel.html'
  };

  $scope.closeCommentModal = function () {
    $scope.comment_modal.hide();
    $scope.comment_modal.remove();
    getActivity(activityId);
  };

  $scope.openCommentBox = function () {
    $scope.commentData = {};
    $ionicModal.fromTemplateUrl('templates/comment.html', {
      scope: $scope,
      animation: 'zoom-from-center'
    }).then(function (modal) {
      $scope.comment_modal = modal;
      $scope.comment_modal.show();
    });
  };

  $scope.makeComment = function (activityId) {
    $ionicLoading.show({
      template: 'Saving comment...'
    });
    Comment.save({body: $scope.commentData.body, id: activityId}, function (resp) {
      $ionicLoading.hide();
      if (resp.status === 'success') {
        $scope.closeCommentModal();
      } else {
        console.log('error ' + resp.message[0]);
        $ionicPopup.alert({
          title: resp.message[0]
        });
      }
    }, function (resp) {
      $ionicLoading.hide();
    });
  };

  $scope.followUser = function (userId) {
    Follow.save({user_id: userId}, function (response) {
      $ionicLoading.hide();
      if (response.status === 'success') {
      } else {
        console.log(response);
        $ionicPopup.alert({
          title: 'User could not be followed.'
        })
      }
    })
  };

  $scope.unfollowUser = function (userId) {
    Follow.delete({id: userId}, function (response) {
      if (response.status === 'success') {
        console.log('user deleted, hopefully');
      } else {
        console.log(response);
        $ionicPopup.alert({
          title: 'User could not be unfollowed.'
        })
      }
    })
  };

  $scope.nextSlide = function (index) {
    $ionicSlideBoxDelegate.slide(index);
  };

  function prepareComments() {
    $scope.activity.comments = $scope.activity.comments.sort(function (a, b) {
      return Date.parse(b.created_at) - Date.parse(a.created_at);
    });
    if ($scope.activity.comments !== []) {
      $scope.activity.comments = $scope.activity.comments.map(function (comment) {
        date = new Date(Date.parse(comment.created_at));
        comment.created_at = date.toDateString();
        return comment;
      })
    }
  }

  function showSmallMap(lat, lng) {
    MapService.initiateMap('small-map');

    MapService.addToMap(lat, lng, map);
    map.setView([lat, lng], 12);
    console.log($scope.activity);
    if ($scope.activity.routes.length !== 0) {
      showRoute($scope.activity, map);
    }
    if ($scope.activity.waypoints.length !== 0) {
      showWaypoint($scope.activity, map);
    }
  }

  function showRoute(activity, map) {
    $http.get(activity.routes[0].file_attachment).success(function (response) {
        var routeInfo = response;

        console.log(routeInfo);
        map.setView([routeInfo.route[0].lat, routeInfo.route[0].long], 32);
        var polOptions = {
          color: 'blue',
          weight: 3,
          opacity: 0.5,
          smoothFactor: 1
        };
        var old_lat, old_long;
        routeInfo.route.forEach(function (result, index, arr) {
          if (arr.indexOf(result) == arr.indexOf(arr[0])) {
            old_lat = result.lat;
            old_long = result.long;
          }
          else {
            old_lat = arr[index - 1].lat;
            old_long = arr[index - 1].long;
          }
          var pointA = new L.LatLng(old_lat, old_long);
          var pointB = new L.LatLng(result.lat, result.long);
          var pointList = [pointA, pointB];

          var polyline = new L.polyline(pointList, polOptions);
          polyline.addTo(map);

        });
        MapService.addToMap(routeInfo.route[0].lat, routeInfo.route[0].long, map);
      }
    );
  }


  function showWaypoint(activity, map) {
    $http.get(activity.waypoints[0].file_attachment).success(function (response) {
        var waypointInfo = response;
        map.setView([waypointInfo.route[0].lat, waypointInfo.route[0].long], 16);

        MapService.addToMap(waypointInfo.route[0].lat, waypointInfo.route[0].long, map);
      }
    );
  }

  function getActivity(id) {
    Activity.get({id: id}, function (response) {
      $scope.activity = response.data;
      $scope.activity.images = Utilities.sanitizeArrayFromNullObjects($scope.activity.images);
      $scope.activity.routes = Utilities.sanitizeArrayFromNullObjects($scope.activity.routes);
      $scope.activity.waypoints = Utilities.sanitizeArrayFromNullObjects($scope.activity.waypoints);
      prepareComments();
      showSmallMap($scope.activity.coords.lat, $scope.activity.coords.lng);
    });
  }

  $scope.likeActivity = function (activity_id) {
    LikeActivity.likeActivity(activity_id);
  };

  $scope.unlikeActivity = function (activity_id) {
    UnlikeActivity.unlikeActivity(activity_id);
  }

  $scope.saveActivity = function (activity_id) {
    SaveActivity.saveActivity(activity_id);
  };

  $scope.unsaveActivity = function (activity_id) {
    UnsaveActivity.unsaveActivity(activity_id);
  }

}
