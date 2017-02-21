angular.module('adventureMap.services', [])

  .factory('Activity', function ($resource, API_URL) {
    return $resource(API_URL + '/activities/:id', {}, {
      save: {method: 'POST'},
      query: {method: 'GET'},
      get: {method: 'GET'}
    });
  })

  .factory('Filters', function () {
    return {
      applyFilters: function ($scope, categories) {
        var categoryArray = [];

        var tempList = $scope.activityData.cachedActivities;

        // Difficulty filters
        // We could get rid of this outer 'if' if we figure out how to auto-check the difficulty boxes.
        if ($scope.activityData.filters.difficulty1 || $scope.activityData.filters.difficulty2 || $scope.activityData.filters.difficulty3) {
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
        }

        // Category filters
        tempList.filter(function (activity) {
          const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

          array.forEach(function(num){
            if ($scope.activityData.filters.category[num] && activity.category == categories[num - 1]) {
              categoryArray.push(activity);
            }
          });
          categoryArray.forEach(function(activity){
            return activity;
          });
        });

        $scope.activityData.activityList = categoryArray;

        // Show users a message instead of a blank screen if there are no activities that match their search.
        if ($scope.activityData.activityList.length == 0) {
          $scope.activityData.message = 'Your search returned no results. Try adding some categories, difficulties or looking for activities from strangers.'
        }

        console.log('activities: ' + $scope.activityData.activityList.length);


      }
    }
  })

