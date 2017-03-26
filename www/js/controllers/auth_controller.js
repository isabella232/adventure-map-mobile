function authController($scope, $auth, $ionicLoading, $state, $rootScope, $localStorage, API_URL, $ionicHistory) {
  $scope.credentials = {};
  $scope.signupForm = {};
  $scope.errorMessage = null;

  $scope.skipIntro = function(){
    $state.go('intro.login');
  };

  $scope.login = function () {
    $auth.getConfig().apiUrl = API_URL;
    $ionicLoading.show({
      template: 'Logging in...'
    });
    $auth.submitLogin($scope.credentials)
      .then(function (response) {
        $state.go('app.activities');
        storeUser();
        $ionicLoading.hide();
      })
      .catch(function (response) {
        $ionicLoading.hide();
        $scope.errorMessage = response.errors.toString();
      });
  };

  $scope.signup = function() {
    $auth.getConfig().apiUrl = API_URL;
    $ionicLoading.show({
      template: 'Signing up...'
    });

    $auth.submitRegistration($scope.signupForm)
      .then(function (response) {
        $state.go('app.activities');
        $ionicLoading.hide();
      })
      .catch(function(response) {
        $ionicLoading.hide();
        $scope.errorMessage = response.data.errors.full_messages.toString();
      })
  };

  $scope.facebookSignIn = function () {
    $auth.signOut();
    $auth.getConfig().apiUrl = API_URL.replace(/^https:\/\//i, 'http://');
    $ionicLoading.show({
      template: 'Logging in with Facebook...'
    });

    $auth.authenticate('facebook')
      .then(function (response) {
        $auth.validateUser().then(function(resp){
          console.log('validateUser');
          storeUser();
          console.log(resp)
        });
        $state.go('app.activities');
        $ionicLoading.hide();
      })
      .catch(function (ev, response) {
        // handle errors
        console.log(ev);
        console.log(response);
        $ionicLoading.hide();
      });
  };

  $scope.signOut = function () {
    $ionicLoading.show({
      template: 'Signing out...'
    });
    $auth.signOut()
      .then(function (response) {
        $auth.invalidateTokens();
        $state.go('intro.walkthrough');
        $ionicLoading.hide();
      })
  };

  $scope.cancelAuth = function(){
    $state.go('intro.walkthrough');
  };

  $scope.back = function(){
    $ionicHistory.goBack();
  };

  storeUser = function() {
    $localStorage.user = $scope.user;
    console.log('storing user');
    console.log($localStorage.user);
  }
}
