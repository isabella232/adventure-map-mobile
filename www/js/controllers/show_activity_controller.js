function showActivityController($scope,
                                $state,
                                $stateParams,
                                $ionicModal,
                                $ionicLoading,
                                $ionicSlideBoxDelegate,
                                $ionicPopup,
                                Activity,
                                Comment,
                                Follow,
                                LikeActivity,
                                UnlikeActivity,
                                SaveActivity,
                                UnsaveActivity,
                                Utilities) {

  var activityId;

  $scope.$on("$ionicView.enter", function () {
    if ($stateParams.id) {
      activityId = $stateParams.id;
      getActivity(activityId);
    }
  });

  $scope.navigateToActivity = function (activity) {
    switch ($state.current.name) {
      case 'app.activities':
        $state.go('app.activity', {id: activity.id});
        break;
      case 'app.my-activities':
        $state.go('app.my-activity', {id: activity.id});
        break;
    }
  };

  $scope.closeCommentModal = function () {
    $scope.comment_modal.hide();
    $scope.comment_modal.remove();
    getActivity(activityId);
  };

  $scope.openCommentBox = function () {
    $scope.commentData = {};
    $ionicModal.fromTemplateUrl('templates/comment.html', {
      scope: $scope,
      animation: 'zoom-from-center'
    }).then(function (modal) {
      $scope.comment_modal = modal;
      $scope.comment_modal.show();
    });
  };

  $scope.makeComment = function (activityId) {
    $ionicLoading.show({
      template: 'Saving comment...'
    });
    Comment.save({body: $scope.commentData.body, id: activityId}, function (resp) {
      $ionicLoading.hide();
      if (resp.status === 'success') {
        $scope.closeCommentModal();
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

  $scope.followUser = function (userId) {
    $ionicLoading.show({
      template: 'Following user...'
    });
    Follow.save({user_id: userId}, function (response) {
      $ionicLoading.hide();
      if (response.status === 'success') {
        console.log('user followed');
        getActivity(activityId);
      } else {
        console.log(response);
        $ionicPopup.alert({
          title: 'User could not be followed.'
        })
      }
    })
  };

  $scope.nextSlide = function (index) {
    $ionicSlideBoxDelegate.slide(index);
  };

  function prepareComments() {
    $scope.activity.comments = $scope.activity.comments.sort(function (a, b) {
      return Date.parse(b.created_at) - Date.parse(a.created_at);
    });
    if ($scope.activity.comments !== []) {
      $scope.activity.comments = $scope.activity.comments.map(function (comment) {
        date = new Date(Date.parse(comment.created_at));
        comment.created_at = date.toDateString();
        return comment;
      })
    }
  }

  function getActivity(id) {
    Activity.get({id: id}, function (response) {
      $scope.activity = response.data;
      $scope.activity.images = Utilities.sanitizeArrayFromNullObjects($scope.activity.images);
      $scope.activity.routes = Utilities.sanitizeArrayFromNullObjects($scope.activity.routes);
      $scope.activity.waypoints = Utilities.sanitizeArrayFromNullObjects($scope.activity.waypoints);
      prepareComments();

    });
  }

  $scope.likeActivity = function (activity_id) {
    LikeActivity.likeActivity(activity_id);
  };

  $scope.unlikeActivity = function (activity_id) {
    UnlikeActivity.unlikeActivity(activity_id);
  }

  $scope.saveActivity = function (activity_id) {
    SaveActivity.saveActivity(activity_id);
  };

  $scope.unsaveActivity = function (activity_id) {
    UnsaveActivity.unsaveActivity(activity_id);
  }

}
