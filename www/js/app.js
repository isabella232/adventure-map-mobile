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
    'adventureMap.fileService',
    'adventureMap.utilities',
    'ngCordova', 'ng-token-auth',
    'ngResource',
    'ngStorage'
  ])
  //.constant('API_URL', 'https://adventuremap-dev.herokuapp.com/api/v1')
  .constant('API_URL', 'http://adventuremap-dev.craftacademylabs.com/api/v1')
  //.constant('API_URL', 'http://localhost:3000/api/v1')//

  .constant('DIFFICULTY_WORDS', ['Easy', 'Moderate', 'Hard'])
  .constant('CATEGORY_ICONS', [
    'img/icons/hiking.svg', 'img/icons/cc_skiing.svg', 'img/icons/bc_skiing.svg',
    'img/icons/paddling.svg', 'img/icons/mountain_biking.svg', 'img/icons/horse-riding.svg',
    'img/icons/climbing.svg', 'img/icons/snow_mobiling.svg', 'img/icons/cc_ice_skating.svg',
    'img/icons/foraging.svg'
  ])
  .constant('CATEGORY_WORDS', [
    'Hiking', 'Cross country skiing', 'Back country skiing', 'Paddling',
    'Mountain biking', 'Horse riding', 'Climbing', 'Snow mobiling',
    'Cross country ice skating', 'Foraging'
  ])

  .filter('difficultyWord', function (DIFFICULTY_WORDS) {
    return function (difficulty) {
      if (difficulty <= 0 || difficulty > DIFFICULTY_WORDS.length)
        return '';
      else
        return DIFFICULTY_WORDS[difficulty - 1];
    };
  })

  .config(function ($httpProvider) {
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
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back').previousTitleText(true);
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
        templateUrl: 'templates/common/intro.html',
        data: {
          requireLogin: false
        }
      })
      .state('intro.walkthrough', {
        url: '/walkthrough',
        views: {
          'intro-view@intro': {
            templateUrl: 'templates/auth/walkthrough.html',
            controller: 'authController'
          }
        }
      })
      .state('intro.login', {
        url: '/login',
        views: {
          'intro-view@intro': {
            templateUrl: 'templates/auth/login.html',
            controller: 'authController'
          }
        }
      })
      .state('intro.signup', {
        url: '/signup',
        views: {
          'intro-view@intro': {
            templateUrl: 'templates/auth/signup.html',
            controller: 'authController'
          }
        }
      })
      .state('intro.password_reset', {
        url: '/password_reset',
        views: {
          'intro-view@intro': {
            templateUrl: 'templates/auth/password_reset.html',
            controller: 'authController'
          }
        }
      })
      .state('intro.terms', {
        url: '/terms-and-conditions',
        views: {
          'intro-view@intro': {
            templateUrl: 'templates/policies/terms-and-conditions.html',
            controller: 'authController'
          }
        }
      })
      .state('intro.disclaimer', {
        url: '/content-policies',
        views: {
          'intro-view@intro': {
            templateUrl: 'templates/policies/disclaimer.html',
            controller: 'authController'
          }
        }
      })
      .state('intro.privacy', {
        url: '/privacy-policies',
        views: {
          'intro-view@intro': {
            templateUrl: 'templates/policies/privacy.html',
            controller: 'authController'
          }
        }
      })
      .state('intro.cookie', {
        url: '/cookies-policies',
        views: {
          'intro-view@intro': {
            templateUrl: 'templates/policies/cookies.html',
            controller: 'authController'
          }
        }
      })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: "templates/common/main-tabs.html",
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
          'tab-activities-view': {
            templateUrl: 'templates/activities.html',
            controller: 'activitiesController'
          }
        }
      })
      .state('app.activity', {
        url: '/activities/:id',
        cache: false,
        views: {
          'tab-activities-view': {
            templateUrl: 'templates/activities/show.html',
            controller: 'showActivityController'
          }
        }
      })
      .state('app.profile', {
        url: '/profile',
        views: {
          'tab-profile-view': {
            templateUrl: 'templates/profile.html',
            controller: 'userController'
          }
        }
      })
      .state('app.profile-activity', {
        url: '/profile/activities/:id',
        cache: false,
        views: {
          'tab-profile-view': {
            templateUrl: 'templates/activities/show.html',
            controller: 'showActivityController'
          }
        }
      })
      .state('app.edit-profile', {
        url: '/edit-profile',
        views: {
          'tab-profile-view': {
            templateUrl: 'templates/profile/edit.html',
            controller: 'profileController'
          }
        }
      })
      .state('app.my-activities', {
        url: '/my-activities',
        views: {
          'tab-profile-view': {
            templateUrl: 'templates/profile/my-activities.html',
            controller: 'profileController'
          }
        }
      })
      .state('app.my-saved-activities', {
        url: '/my-saved-activities',
        views: {
          'tab-profile-view': {
            templateUrl: 'templates/profile/my-saved-activities.html',
            controller: 'profileController'
          }
        }
      })
      .state('app.followers', {
        url: '/followers',
        views: {
          'tab-profile-view': {
            templateUrl: 'templates/profile/followers.html',
            controller: 'profileController'
          }
        }
      })
      .state('app.followings', {
        url: '/followings',
        views: {
          'tab-profile-view': {
            templateUrl: 'templates/profile/followings.html',
            controller: 'profileController'
          }
        }
      })
      .state('app.my-recordings', {
        url: '/my-recordings',
        views: {
          'tab-profile-view': {
            templateUrl: 'templates/profile/my-recordings.html',
            controller: 'userController'
          }
        }
      })
      .state('app.my-activity', {
        url: '/me/activities/:id',
        cache: false,
        views: {
          'tab-profile-view': {
            templateUrl: 'templates/activities/show.html',
            controller: 'showActivityController'
          }
        }
      })
      .state('app.map', {
        url: '/map',
        views: {
          'tab-map-view': {
            templateUrl: 'templates/map.html',
            controller: 'mapController'
          }
        }
      });

    $urlRouterProvider.otherwise('/intro/walkthrough');
  });
