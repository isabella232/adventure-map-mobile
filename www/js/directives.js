angular
  .module('adventureMap.directives', [])
  .directive("displayFirstImage", displayFirstImage)
  .directive('showActivityFeed', showActivityFeed)

  .directive('preImg', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        ratio: '@',
        helperClass: '@'
      },
      controller: function ($scope) {
        $scope.loaded = false;

        this.hideSpinner = function () {
          // Think i have to use apply because this function is not called from this controller ($scope)
          $scope.$apply(function () {
            $scope.loaded = true;
          });
        };
      },
      templateUrl: 'templates/common/pre-img.html'
    };
  })

  .directive('spinnerOnLoad', function () {
    return {
      restrict: 'A',
      require: '^preImg',
      scope: {
        ngSrc: '@'
      },
      link: function (scope, element, attr, preImgController) {
        element.on('load', function () {
          preImgController.hideSpinner();
        });
      }
    };
  })

  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'A',
      link: function($scope, $el) {
        $scope.$on("$ionicView.enter", function () {
          $rootScope.hideTabs = true;
        });
        $scope.$on("$ionicView.leave", function () {
          $rootScope.hideTabs = false;
        });
      }
    };
  });

function displayFirstImage() {
  var directive = {
    restrict: 'E',
    scope: {imagesFor: '@'},
    template: '<img class="full-image" ng-src="{{getImage(imagesFor)}}"> ',
    link: function (scope, element, attrs) {
      scope.getImage = function (resource) {
        var resource = JSON.parse(resource);
        if (resource.images.length) {
          return resource.images[0].file_attachment;
        } else {
          return "img/dummy_images/snow.jpg";
        }
      };
    }
  };
  return directive;
}

function showActivityFeed() {
  const directive = {
    restrict: 'E',
    scope: {activities: '='},
    templateUrl: 'templates/directives/activity-feed.html'
  };
  return directive;
}
