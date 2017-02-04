angular
  .module('adventureMap.controllers', [])
  .controller('userSessionController', userSessionController)
  .controller('activitiesController', activitiesController)
  .controller('createActivitiesController', createActivitiesController);


function userSessionController($scope, $auth, $ionicLoading, $state) {
  $scope.loginData = {};
  $scope.userSignIn = function () {
    $ionicLoading.show({
      template: 'Logging in...'
    });
    $auth.submitLogin($scope.loginData)
      .then(function (response) {
        $scope.user = response;
        $state.go('activities');
        $ionicLoading.hide();
      })
      .catch(function (response) {
        $ionicLoading.hide();
        $scope.errorMessage = response.errors.toString();
      })
  };

  $scope.facebookSignIn = function() {
    $ionicLoading.show({
      template: 'Logging in with Facebook...'
    });
    $auth.authenticate('facebook')
      .then(function(response) {
        $state.go('activities');
        $ionicLoading.hide();
      })
      .catch(function(ev, response) {
        // handle errors
        $ionicLoading.hide();
      });
  }
}

function activitiesController($scope, $state) {
  $scope.message = 'This is the Activities View for ' + $scope.user.email;
  $scope.addActivity = function () {
    $state.go('create_activity');
  }
}

function createActivitiesController($scope, $ionicLoading, $state, Activity) {
  $scope.activityData = {};
  $scope.categories = ['Hiking', 'Cross country skiing', 'Back country skiing', 'Paddling', 'Mountain biking', 'Horse riding', 'Climbing', 'Snow mobiling', 'Cross country ice skating', 'Foraging'];

  $scope.createActivity = function () {
    $ionicLoading.show({
      template: 'Saving...'
    });
    Activity.save($scope.activityData, function(){
      $state.go('activities');
      $ionicLoading.hide();
    });
  }
}
