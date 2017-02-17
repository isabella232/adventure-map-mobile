function activitiesController($scope, $state, $ionicLoading, Activity, Filters) {
  $scope.activityData = $scope.activityData || {activityData: {}};
  $scope.activityData.filters = {};
  $scope.activityData.filters.category = [];
  $scope.activityData.message = undefined;
  $scope.stars = [true, false, false, false, false];
  const categories = ['Hiking', 'Cross-country skiing', 'Back country skiing', 'Paddling', 'Mountain biking', 'Horse riding', 'Climbing', 'Snow mobiling', 'Cross country ice skating', 'foraging'];

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
    // reset no-results-found message
    $scope.activityData.message = undefined;

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

    Filters.applyFilters($scope, categories)
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

}
