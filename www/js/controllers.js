angular
  .module('adventureMap.controllers', [])
  .controller('userSessionController', userSessionController)
  .controller('activitiesController', activitiesController)
  .controller('createActivitiesController', createActivitiesController);


function userSessionController($scope, $auth, $ionicLoading, $state) {
  $scope.loginData = {};
  $scope.userSignIn = function () {
    $auth.getConfig().apiUrl = 'https://adventuremap-dev.herokuapp.com/api/v1';
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

  $scope.facebookSignIn = function () {
    $auth.getConfig().apiUrl = 'http://adventuremap-dev.herokuapp.com/api/v1';
    $ionicLoading.show({
      template: 'Logging in with Facebook...'
    });
    $auth.authenticate('facebook')
      .then(function (response) {
        $state.go('activities');
        $ionicLoading.hide();
      })
      .catch(function (ev, response) {
        // handle errors
        $ionicLoading.hide();
      });
  }
}

function activitiesController($scope, $state, $ionicLoading, Activity) {
  $scope.message = 'This is the Activities View for ' + $scope.user.email;

  $scope.$on("$ionicView.enter", function () {
    $ionicLoading.show({
      template: 'Getting activities...'
    });
    Activity.query(function (response) {
      $scope.activities = response.activities.reverse();
      $ionicLoading.hide();
    });
  });

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
    Activity.save($scope.activityData, function (resp) {
      $state.go('activities');
      $ionicLoading.hide();
      console.log(resp);
    }, function(resp){
      console.log(resp);
    });
  }
}
