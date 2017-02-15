angular
  .module('adventureMap.directives', [])
  .directive("displayFirstImage", displayFirstImage);

function displayFirstImage() {
  var directive = {
    restrict: 'E',
    scope: { imagesFor: '@' },
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

