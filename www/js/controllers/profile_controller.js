function profileController($scope, $ionicLoading,$ionicPlatform, $localStorage, MyActivities, DIFFICULTY_WORDS) {
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
        setDifficultyWords();
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
    showMyActivities();
  });

  // This is almost a duplicate of code in activities_controller. Should be refactored.
  function setDifficultyWords() {
    $scope.myActivities = $scope.myActivities.map(function (activity) {
      switch (activity.difficulty) {
        case 1:
          activity.difficulty_word = DIFFICULTY_WORDS[0];
          break;
        case 2:
          activity.difficulty_word = DIFFICULTY_WORDS[1];
          break;
        case 3:
          activity.difficulty_word = DIFFICULTY_WORDS[2];
          break;
        default:
          activity.difficulty_word = '';
      }
      return activity;
    })
  }

}
