function createActivityController($scope, $auth, $ionicLoading, $state, Activity) {
  $scope.activityData = {};
  $scope.categories = ['Hiking', 'Cross country skiing', 'Back country skiing', 'Paddling', 'Mountain biking', 'Horse riding', 'Climbing', 'Snow mobiling', 'Cross country ice skating', 'Foraging'];

  $scope.createActivity = function () {
    $ionicLoading.show({
      template: 'Saving...'
    });

    $auth.validateUser().then(function(resp){
      Activity.save($scope.activityData, function (resp) {
        // This takes you to the activities page, even if you created
        // an activity from the my-activities page.
        $state.go('app.activities');
        $ionicLoading.hide();
        console.log(resp);
      }, function (resp) {
        console.log(resp);
        $scope.errors = resp.data.message;
        $ionicLoading.hide();
      });
    });
  }
}
