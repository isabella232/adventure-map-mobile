// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('adventureMap', ['ionic', 'ui.router', 'adventureMap.controllers', 'adventureMap.services', 'adventureMap.directives', 'ngCordova', 'ng-token-auth', 'ngResource'])
  .constant('API_URL', 'https://adventuremap-dev.herokuapp.com/api/v1')
  //.constant('API_URL', 'http://localhost:3000/api/v1')

  .config(function ($authProvider, API_URL) {
    $authProvider.configure({
      apiUrl: API_URL,
      omniauthWindowType: widowType(),
      storage: 'localStorage',
      forceHardRedirect: true
    });

    function widowType() {
      var IONIC_APP_ID = '7e351a02';
      if (window.location.href.indexOf('com.ionic.viewapp') > -1 || window.location.href.indexOf(IONIC_APP_ID) > -1) {
        return 'newWindow'
      }
      if (window.cordova == undefined) {
        return 'newWindow'
      } else {
        return 'inAppBrowser'
      }
    }
  })

  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-back').previousTitleText(false);
  })

  .run(function ($ionicPlatform, $rootScope, $state) {
    $rootScope.$state = $state;
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      var requireLogin = toState.data.requireLogin;
      //debugger;
      if (requireLogin && isLoggedIn()) {
        event.preventDefault();
        $state.go('home');
      }
    });

    function isLoggedIn() {
      if (typeof $rootScope.user === 'undefined' || Object.getOwnPropertyNames($rootScope.user).length == 0) {
        return true;
      }
    }
  })


  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'templates/login.html',
        controller: 'userSessionController',
        data: {
          requireLogin: false
        },
        cache: false
      })

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'activitiesController',
        data: {
          // requireLogin: true // this property will apply to all children of 'app'
        }
      })
      .state('app.activities', {
        url: '/activities',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/activities.html',
            controller: 'activitiesController'
          }
        }
      })
      .state('app.map', {
        url: '/map',
        views: {
          'menuContent' :{
            templateUrl: 'templates/map.html',
            controller: 'mapController'
          }
        }
      })
      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'userController'
          }
        }

      })
      .state('app.create_activity', {
        url: '/create_activity',
        views: {
          'menuContent': {
            templateUrl: 'templates/create_activity.html',
            controller: 'createActivityController'
          }
        }
      });

    $urlRouterProvider.otherwise('/home');
  });
