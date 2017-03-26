angular.module('adventureMap.services', [])

  .factory('Activity', function ($resource, $auth, API_URL) {
    var headers = $auth.retrieveData('auth_headers');
    return $resource(API_URL + '/activities/:id', {}, {
      save: {method: 'POST', headers: headers},
      query: {method: 'GET', headers: headers},
      get: {method: 'GET', headers: headers}
    });
  })

  .factory('MyActivities', function ($resource, $auth, API_URL) {
    return $resource(API_URL + '/users/:id/activities', {id: '@id'}, {
      get: { method: 'GET' }
    })
  })

  .factory('Comment', function ($resource, API_URL) {
    return $resource(API_URL + '/activities/:id/comments', {id: '@id'}, {
      save: {method: 'POST'}
    });
  })

  .factory('Follow', function ($resource, API_URL) {
    return $resource(API_URL + '/follows', {}, {
      save: {method: 'POST'}
    });
  })

  .factory('ActivityDetail', function($resource, API_URL) {
    return $resource(API_URL + '/activities/:id/activity_details', {id: '@id'}, {
      save: {method: 'POST'}
    })
  })

  .factory('Filters', function ($localStorage) {
    return {
      applyFilters: function ($scope) {
        console.log($scope.activityData.filters);

        var tempArray = [];

        var tempList = $scope.activityData.cachedActivities;

        // Set default filter
        if ($scope.activityData.filters.default) {
          $scope.activityData.filters.default = false;
          $scope.activityData.filters.stars = $scope.stars;
          $localStorage.defaultFilter = $scope.activityData.filters;
          $localStorage.defaultFilter.category = $scope.activityData.filters.category;
        }

        // Difficulty filters
        tempList = tempList.filter(function (activity) {
          if ($scope.activityData.filters.difficulty1 && activity.difficulty == 1) {
            return activity;
          }
          if ($scope.activityData.filters.difficulty2 && activity.difficulty == 2) {
            return activity;
          }
          if ($scope.activityData.filters.difficulty3 && activity.difficulty == 3) {
            return activity;
          }
        });

        // Category filters
        tempList.filter(function (activity) {
          var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

          array.forEach(function (num) {
            if ($scope.activityData.filters.category[num] && activity.category == $scope.categories[num - 1]) {
              tempArray.push(activity);
            }
          });

          tempArray.forEach(function (activity) {
            return activity;
          });
        });


        // Add all activities for users I follow if follow filter set to true
        if ($scope.activityData.filters.follow) {
          $scope.activityData.cachedActivities.filter(function (activity) {
            if (activity.user.following) {
              tempArray.push(activity);
            }
          });
        }

        // Filter out duplicates.
        var endArray = [];
        for (var i = 0; i < tempArray.length; i++) {
          if (endArray.indexOf(tempArray[i]) == -1) endArray.push(tempArray[i]);
        }

        $scope.activityData.activityList = endArray;

        // Show users a message instead of a blank screen if there are no activities that match their search.
        if ($scope.activityData.activityList.length === 0) {
          $scope.activityData.message = 'Your search returned no results. Try adding some categories, difficulties or looking for activities from strangers.';
        }

        console.log('activities: ' + $scope.activityData.activityList.length);

      }
    };
  });
