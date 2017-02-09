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
    $state.go('app.create_activity');
  };

  $scope.viewProfile = function () {
    $state.go('app.profile');
  }
}
