function activitiesController($scope, $state, $ionicLoading, Activity, Filters, DIFFICULTY_WORDS) {
  $scope.activityData = $scope.activityData || {activityData: {}};
  $scope.activityData.filters = {};
  $scope.activityData.filters.category = [];
  $scope.activityData.message = undefined;
  const categories = ['Hiking', 'Cross-country skiing', 'Back country skiing', 'Paddling', 'Mountain biking', 'Horse riding', 'Climbing', 'Snow mobiling', 'Cross country ice skating', 'Foraging'];
  $scope.categories = categories;
  $scope.difficulty_words = DIFFICULTY_WORDS;

  // Set default filters - these should change based on the user's default filter.
  for (var i = 1; i < 11; i++) {
    $scope.activityData.filters.category[i] = true;
  }
  $scope.activityData.filters.difficulty1 = true;
  $scope.activityData.filters.difficulty2 = true;
  $scope.activityData.filters.difficulty3 = true;
  $scope.activityData.filters.follow = true;
  $scope.stars = [true, false, false, false, false];

  $scope.$on("$ionicView.enter", function (scopes, states) {
    console.log($scope.activityData);
    if (states.stateName == "app.activities") {
      $ionicLoading.show({
        template: 'Getting activities...'
      });
      Activity.query(function (response) {
        console.log(response);
        // Sort by date
        $scope.activityData.activityList = response.data.sort(function (a, b) {
          return Date.parse(b.created_at) - Date.parse(a.created_at);
        });
        setDifficultyWords();
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

    Filters.applyFilters($scope, categories);
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

  function setDifficultyWords() {
    $scope.activityData.activityList = $scope.activityData.activityList.map(function (activity) {
      switch (activity.difficulty) {
        case 1:
          activity.difficulty_word = DIFFICULTY_WORDS[0];
          break;
        case 2:
          activity.difficulty_word = DIFFICULTY_WORDS[1];
          break;
        case 3:
          activity.difficulty_word = DIFFICULTY_WORDS[2];
          break;
        default:
          activity.difficulty_word = '';
      }
      return activity;
    })
  }

}
