angular
  .module('adventureMap.controllers', [])
  .controller('authController', authController)
  .controller('activitiesController', activitiesController)
  .controller('showActivityController', showActivityController)
  .controller('mapController', mapController)
  .controller('userController', userController)
  .controller('profileController', profileController)
  .controller('TabCtrl', ['$state', '$translate', function ($state, $translate) {
    //console.log('HomeTabCtrl');
    this.onTabSelected = function (_scope) {
      switch (_scope.title) {
        case 'Explore':
          setTimeout(function () {
            $state.go('app.activities', {});
          }, 0);
          break;
        case 'Map':
          setTimeout(function () {
            $state.go('app.map', {});
          }, 0);
          break;
        case 'Profile':
          setTimeout(function () {
            $state.go('app.profile', {});
          }, 1);
          break;
        default:

      }
    };
  }]);
