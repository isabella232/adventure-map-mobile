function profileController($scope, $ionicLoading, $ionicPlatform, $localStorage, MyActivities, DIFFICULTY_WORDS) {
  const user = $localStorage.user;

  showMyActivities = function () {
    console.log(user);
    $ionicLoading.show({
      template: 'Getting activities'
    });
    // Scope empties out at some point! That's why we need the user in $localStorage
    MyActivities.get({id: user.id}, function (resp) {
      console.log(resp);
      $ionicLoading.hide();
      if (resp.status == 'success') {
        // Sort by date
        $scope.myActivities = resp.data.sort(function (a, b) {
          return Date.parse(b.created_at) - Date.parse(a.created_at);
        });

        console.log(resp);
      } else {
        console.log('error ' + resp.message[0]);
        $ionicPopup.alert({
          title: resp.message[0]
        });
      }
    }, function (resp) {
      $ionicLoading.hide();
    });
  };

  $ionicPlatform.ready(function () {
    $window.location.reload(true);
    showMyActivities();
  });
}
