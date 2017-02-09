function userSessionController($scope, $auth, $ionicLoading, $state, API_URL) {
  console.log($scope.user);
  $scope.loginData = {};
  $scope.userSignIn = function () {
    $auth.getConfig().apiUrl = API_URL;
    $ionicLoading.show({
      template: 'Logging in...'
    });
    $auth.submitLogin($scope.loginData)
      .then(function (response) {
        $scope.user = response;
        $state.go('app.activities');
        $ionicLoading.hide();
      })
      .catch(function (response) {
        $ionicLoading.hide();
        $scope.errorMessage = response.errors.toString();
      })
  };

  $scope.facebookSignIn = function () {
    $auth.getConfig().apiUrl = API_URL.replace(/^https:\/\//i, 'http://');
    $ionicLoading.show({
      template: 'Logging in with Facebook...'
    });
    $auth.authenticate('facebook')
      .then(function (response) {
        console.log(response);
        $state.go('app.activities');
        $ionicLoading.hide();
      })
      .catch(function (ev, response) {
        // handle errors
        $ionicLoading.hide();
      });
  }

  $scope.performSignOut = function () {
    debugger;
    $ionicLoading.show({
      template: 'Signing out...'
    });
    $auth.signOut()
      .then(function (response) {
        $state.go('app.activities');
        $ionicLoading.hide();
      })
  };
}
