function activitiesController($scope,
                              $state,
                              $ionicLoading,
                              $localStorage,
                              $auth,
                              Activity,
                              Filters,
                              DIFFICULTY_WORDS,
                              CATEGORY_ICONS,
                              CATEGORY_WORDS) {

  setState();

  $scope.$on("$ionicView.enter", function (scopes, states) {
    console.dir($localStorage.defaultFilter || 'no default filter');
    console.log('in activities controller');
    console.log($scope.activityData);

    if (states.stateName === "app.activities") {
      $auth.validateUser().then(function (resp) {
        console.log('validated');
        console.log(resp);
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

          // Apply filters on page load if there is a default filter
          if ($localStorage.defaultFilter) {
            Filters.applyFilters($scope);
          }
          $ionicLoading.hide();
        }, function (response) {
          $ionicLoading.hide();
          $scope.errors = response.data.errors;
        });
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
    Filters.applyFilters($scope);
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
}
