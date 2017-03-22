// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('adventureMap', [
    'ionic',
    'ui.router',
    'angular-md5',
    'adventureMap.controllers',
    'adventureMap.directives',
    'adventureMap.services',
    'adventureMap.s3FileUpload',
    'adventureMap.mapService',
    'ngCordova', 'ng-token-auth',
    'ngResource',
    'ngStorage'
  ])
  .constant('API_URL', 'http://adventuremap-dev.craftacademylabs.com/api/v1')
  // .constant('API_URL', 'http://localhost:3000/api/v1')

  .constant('DIFFICULTY_WORDS', ['Easy', 'Moderate', 'Hard'])
  .constant('CATEGORY_ICONS', [
  '../../img/icons/hiking.svg', '../../img/icons/cc_skiing.svg', '../../img/icons/bc_skiing.svg',
  '../../img/icons/paddling.svg', '../../img/icons/mountain_biking.svg', '../../img/icons/horse-riding.svg',
  '../../img/icons/climbing.svg', '../../img/icons/snow_mobiling.svg', '../../img/icons/cc_ice_skating.svg',
  '../../img/icons/foraging.svg'
  ])
  .constant('CATEGORY_WORDS', [
    'Hiking', 'Cross-country skiing', 'Back country skiing', 'Paddling',
    'Mountain biking', 'Horse riding', 'Climbing', 'Snow mobiling',
    'Cross country ice skating', 'Foraging'
  ])

  .config(function($httpProvider){
    // Remove cache headers from put requests - AWS S3 doesn't like them
    delete $httpProvider.defaults.headers.put['If-Modified-Since']
  })

  .config(function ($authProvider, API_URL) {
    $authProvider.configure({
      apiUrl: API_URL,
      tokenValidationPath: '/auth/validate_token',
      omniauthWindowType: windowType(),
      storage: 'localStorage',
      forceHardRedirect: true,
      tokenFormat: {
        "access-token": "{{ token }}",
        "token-type": "Bearer",
        "client": "{{ clientId }}",
        "expiry": "{{ expiry }}",
        "uid": "{{ uid }}"
      }
    });

    function windowType() {
      var IONIC_APP_ID = '7e351a02';
      if (window.location.href.indexOf('com.ionic.viewapp') > -1 || window.location.href.indexOf(IONIC_APP_ID) > -1) {
        return 'newWindow';
      }
      if (window.cordova == undefined) {
        return 'newWindow';
      } else {
        return 'inAppBrowser';
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
      if (requireLogin && isLoggedIn()) {
        event.preventDefault();
        $state.go('app.activities');
      }
    });

    function isLoggedIn() {
      if (typeof $rootScope.user === 'undefined' || Object.getOwnPropertyNames($rootScope.user).length === 0) {
        return true;
      }
    }
  })


  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('intro', {
        url: '/intro',
        abstract: true,
        templateUrl: 'templates/menu.html',
        data: {
          requireLogin: false
        }
      })
        .state('intro.walkthrough', {
          url: '/walkthrough',
          views: {
            'menuContent': {
              templateUrl: 'templates/auth/walkthrough.html',
              controller: 'authController'
            }
          }
        })
        .state('intro.login', {
          url: '/login',
          views: {
            'menuContent': {
              templateUrl: 'templates/auth/login.html',
              controller: 'authController'
            }
          }
        })
        .state('intro.signup', {
          url: '/signup',
          views: {
            'menuContent': {
              templateUrl: 'templates/auth/signup.html',
              controller: 'authController'
            }
          }
        })
        .state('intro.terms', {
          url: '/terms-and-conditions',
          views: {
            'menuContent': {
              templateUrl: 'templates/policies/terms-and-conditions.html',
              controller: 'authController'
            }
          }
        })
        .state('intro.disclaimer', {
          url: '/content-policies',
          views: {
            'menuContent': {
              templateUrl: 'templates/policies/disclaimer.html',
              controller: 'authController'
            }
          }
        })
        .state('intro.privacy', {
          url: '/privacy-policies',
          views: {
            'menuContent': {
              templateUrl: 'templates/policies/privacy.html',
              controller: 'authController'
            }
          }
        })
        .state('intro.cookie', {
          url: '/cookies-policies',
          views: {
            'menuContent': {
              templateUrl: 'templates/policies/cookies.html',
              controller: 'authController'
            }
          }
        })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'activitiesController',
        data: {
          // Should be true for production
          requireLogin: false // this property will apply to all children of 'app'
        }
      })
        .state('app.activities', {
          url: '/activities',
          cache: false,
          views: {
            'menuContent' :{
              templateUrl: 'templates/activities.html',
              controller: 'activitiesController'
            }
          }
        })
        .state('app.profile', {
          url: '/profile',
          views: {
            'menuContent' :{
              templateUrl: 'templates/profile.html',
              controller: 'userController'
            }
          }
        })
        .state('app.create_activity', {
          url: '/create_activity',
          views: {
            'menuContent' :{
              templateUrl: 'templates/create_activity.html',
              controller: 'createActivityController'
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
        });

    $urlRouterProvider.otherwise('/intro/walkthrough');
  });
