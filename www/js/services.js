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
      get: {method: 'GET'}
    })
  })

  .factory('Comment', function ($resource, API_URL) {
    return $resource(API_URL + '/activities/:id/comments', {id: '@id'}, {
      save: {method: 'POST'}
    });
  })

  .factory('Follow', function ($resource, API_URL) {
    return $resource(API_URL + '/follows/:id', {id: '@id'}, {
      save: {method: 'POST'},
      delete: { method: 'DELETE' }
    });
  })

  .factory('ActivityDetail', function($resource, API_URL) {
    return $resource(API_URL + '/activities/:id/activity_details', {id: '@id'}, {
      save: {method: 'POST'}
    })
  })

  .factory('Like', function ($resource, API_URL) {
    return $resource(API_URL + '/likes/:id', {id: '@id', activity_id: '@activity_id'}, {
      save: {method: 'POST'}
    })
  })

  .factory('Save', function ($resource, API_URL) {
    return $resource(API_URL + '/saved_activities/:id', {id: '@id', activity_id: '@activity_id'}, {
      saveActivity: {method: 'POST'}
    })
  })

  .factory('MyFollowers', function($resource, API_URL) {
    return $resource(API_URL + '/follows', {request: '@request'}, {
      get: { method: 'GET' }
    });
  })

  .factory('LikeActivity', function(Like) {
    return {
      likeActivity: function (activity_id) {
        Like.save({activity_id: activity_id}, function (response) {
          if (response.status === 'success') {
            console.log('activity liked');
          } else {
            console.log(response);
            $ionicPopup.alert({
              title: 'Like was not saved.'
            })
          }
        })
      }
    }
  })

  .factory('UnlikeActivity', function(Like) {
    return {
      unlikeActivity: function(activity_id) {
        Like.delete({id: activity_id}, function (response) {
          if (response.status === 'success') {
            console.log('activity unliked');
          } else {
            console.log(response);
            $ionicPopup.alert({
              title: 'Could not unlike.'
            })
          }
        })
      }
    }
  })

  .factory('SaveActivity', function(Save, $ionicPopup) {
    return {
      saveActivity: function (activity_id) {
        Save.save({activity_id: activity_id}, function (response) {
          if (response.status === 'success') {
            console.log('activity saved');
          } else {
            console.log(response);
            $ionicPopup.alert({
              title: 'Save was not recorded.'
            })
          }
        })
      }
    }
  })

  .factory('UnsaveActivity', function(Save, $ionicPopup) {
    return {
      unsaveActivity: function(activity_id) {
        Save.delete({id: activity_id}, function (response) {
          if (response.status === 'success') {
            console.log('activity unsaved');
          } else {
            console.log(response);
            $ionicPopup.alert({
              title: 'Could not unsave.'
            })
          }
        })
      }
    }
  })

  .factory('User', function($resource, API_URL) {
    return $resource(API_URL + '/auth', {user: '@user'}, {
      update: {method: 'PUT'}
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
          $scope.activityData.message = 'Your search returned no results. Try adding some categories';
        }

        //console.log('activities: ' + $scope.activityData.activityList.length);

      }
    };
  })

  .factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork, ionicToast){

    return {
      isOnline: function(){
        if(ionic.Platform.isWebView()){
          return $cordovaNetwork.isOnline();
        } else {
          return navigator.onLine;
        }
      },
      isOffline: function(){
        if(ionic.Platform.isWebView()){
          return !$cordovaNetwork.isOnline();
        } else {
          return !navigator.onLine;
        }
      },
      startWatching: function(){
        if(ionic.Platform.isWebView()){

          $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            console.log("went online cordova");
            ionicToast.show('Back online', 'middle', false, 2500);
          });

          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            console.log("went offline cordova");
            ionicToast.show('No internet connection', 'middle', false, 5000);
          });
        }
        else {

          window.addEventListener("online", function(e) {
            console.log("went online");
            /*ionicToast.show('Went online', 'bottom', false, 2500);*/
          }, false);

          window.addEventListener("offline", function(e) {
            console.log("went offline");
            /*ionicToast.show('went offline', 'bottom', false, 2500);*/
          }, false);
        }
      }
    };
  });
