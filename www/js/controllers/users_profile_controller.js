function usersProfileController($scope,
                                $ionicLoading,
                                $ionicPlatform,
                                $stateParams,
                                $state,
                                $ionicHistory,
                                MyActivities,
                                MyFollowers,
                                Save,
                                Users,
                                md5) {

  $scope.user = {};
  Users.get({id: $stateParams.id}, function (response) {
    $scope.user = response.user;
    console.log($scope.user);
  });

  $scope.profileImage = function () {
    if ($scope.user.id !== undefined) {
      if ($scope.user.image) {
        return $scope.user.image;
      } else {
        var options = {size: 128, format: 'svg'};

        var hashedEmail = md5.createHash($scope.user.email);
        return 'data:image/svg+xml;base64,' + new Identicon(hashedEmail, options).toString();
      }
    }
  };


  $scope.navigateToActivity = function (activity) {
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    $state.go('app.activity', {id: activity.id});
  };

}

