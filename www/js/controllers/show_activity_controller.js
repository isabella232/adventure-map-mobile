function showActivityController($scope, $ionicModal, Activity, $ionicSlideBoxDelegate){
  $scope.openModal = function (activity) {
    $ionicModal.fromTemplateUrl('templates/activity.html', {
      scope: $scope,
      animation: 'zoom-from-center'
    }).then(function (modal) {
      $scope.modal = modal;
      Activity.get({id: activity.id}, function (response) {
        $scope.activity = response.data;
        console.log(activity);
        $scope.modal.show();
      });
    });
  };

  $scope.closeModal = function () {
    $scope.modal.hide();
    $scope.modal.remove();
  };

  $scope.nextSlide = function(index) {
    $ionicSlideBoxDelegate.slide(index);
  }
}
