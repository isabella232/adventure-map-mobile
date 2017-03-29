angular.module('adventureMap.utilities', [])

  .service('Utilities', function () {
    return {
      sanitizeArrayFromNullObjects: function (arr) {
        var array = arr.filter(function (n) {
          return n != undefined
        });
        return array
      }
    }
  });
