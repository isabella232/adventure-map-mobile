function activitiesController($scope, $state, $ionicLoading, Activity) {
  $scope.activityData = $scope.activityData || {activityData: {}};
  $scope.activityData.filters = {};
  $scope.stars = [true, false, false, false, false];

  $scope.$on("$ionicView.enter", function (scopes, states) {
    if (states.stateName == "app.activities") {
      $ionicLoading.show({
        template: 'Getting activities...'
      });
      Activity.query(function (response) {
        console.log(response);
        $scope.activityData.activityList = response.data.reverse();
        $scope.activityData.cachedActivities = $scope.activityData.activityList; // This keeps the entire activity list so users can un-filter.
        $ionicLoading.hide();
      });
    }
  });

  $scope.addActivity = function () {
    $state.go('app.create_activity');
  };

  $scope.viewProfile = function () {
    $state.go('app.profile');
  };

  $scope.setFilters = function () {
    var rating = 1;
    if ($scope.stars[4]) {
      rating = 5
    } else if ($scope.stars[3]) {
      rating = 4
    } else if ($scope.stars[2]) {
      rating = 3
    } else if ($scope.stars[1]) {
      rating = 2
    } else {
      rating = 1
    }
    $scope.activityData.filters.rating = rating;

    console.log($scope.activityData.filters);

    applyFilters()
  };

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

  function applyFilters() {
    $scope.activityData.activityList = $scope.activityData.cachedActivities.filter(function (activity) {
      if ($scope.activityData.filters.difficulty1) {
        if (activity.difficulty == 1) {
          return activity;
        }
      }
      if ($scope.activityData.filters.difficulty2) {
        if (activity.difficulty == 2) {
          return activity;

        }
      }
      if ($scope.activityData.filters.difficulty3) {
        if (activity.difficulty == 3) {
          return activity;
        }
      }
    });

    console.log('activities: ' + $scope.activityData.activityList.length);

  }
}
