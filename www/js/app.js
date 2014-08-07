angular.module('landmarkConnect', ['ionic', 'ngAnimate', 'ngStorage', 'ngCordova', 'pasvaz.bindonce', 'landmarkConnect.controllers', 'landmarkConnect.directives', 'landmarkConnect.filters', 'landmarkConnect.services'])

.run(function($ionicPlatform, $localStorage) {

  delete $localStorage.currentLocation;

  if($ionicPlatform.is('android')) {
    alert('This app is meant for iOS and Android 4.4, it will not work on older Androids!');
  }
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleBlackOpaque();
    }
    if(navigator.splashscreen) {
      setTimeout(function() {
          navigator.splashscreen.hide();
      }, 100);
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html",
          controller: "LocationsCtrl"
        }
      }
    })

    .state('m', {
      url: "/m",
      abstract: true,
      views: {
        'menuContent' :{
          templateUrl: "menu-wrap.html"
        }
      }
    })

    .state('m.menu', {
      url: "/menu",
      views: {
        'menuContent2' :{
          templateUrl: "templates/menu.html",
          controller: function($scope){
            $scope.aboutBroughtBy = "The City of Riverside's Historic Preservation, Neighborhoods and Urban Design Division, and Economic Development Department";
          }
        }
      }
    })


    .state('m.favorites', {
      url: "/favorites",
      views: {
        'menuContent2' :{
          templateUrl: "templates/favorites.html",
          controller: "SettingsCtrl"
        }
      }
    })

    .state('m.visited', {
      url: "/visited",
      views: {
        'menuContent2' :{
          templateUrl: "templates/visited.html",
          controller: "SettingsCtrl"
        }
      }
    })

    .state('m.settings', {
      url: "/settings",
      views: {
        'menuContent2' :{
          templateUrl: "templates/settings.html",
          controller: "SettingsCtrl"
        }
      }
    })

    // Each tab has its own nav history stack:

    .state('loc', {
      url: "/loc",
      abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'locations-wrap.html'
        }
      }
    })
    .state('loc.all', {
      url: '/all',
      views: {
        'locContent': {
          templateUrl: 'templates/locations-list.html',
          controller: 'LocationsCtrl'
        }
      }
    })

    .state('loc.map', {
      url: '/map',
      views: {
        'locContent': {
          templateUrl: 'templates/locations-map.html',
          controller: 'LocationsMapCtrl'
        }
      }
    })




    .state('loc.detail', {
      url: "/:locationId",
      abstract: true,
      controller: 'LocationDetailCtrl',
      views: {
        'locContent': {
          templateUrl: 'templates/detail/loc.detail.view.html',
          controller: 'LocationDetailCtrl'
        }
      }
    })
    .state('loc.detail.detail', {
      url: '/detail',
      views: {
        'tab-loc-detail': {
          templateUrl: 'templates/detail/location-details.html',
          controller: 'LocationDetailCtrl'
        }
      }
    })
    .state('loc.detail.tour', {
      url: '/tour',
      views: {
        'tab-loc-tour': {
          templateUrl: 'templates/detail/location-tours.html',
          controller: 'LocationDetailCtrl'
        }
      }
    })
      .state('loc.detail.tour-video', {
        url: '/tour/v/:tourId',
        views: {
          'tab-loc-tour': {
            templateUrl: 'templates/detail/location-tours-videoplayer.html',
            controller: 'LocationDetailCtrl'
          }
        }
      })

      .state('loc.detail.tour-audio', {
        url: '/tour/a/:tourId',
        views: {
          'tab-loc-tour': {
            templateUrl: 'templates/detail/location-tours-audioplayer.html',
            controller: 'LocationDetailCtrl'
          }
        }
      })

    .state('loc.detail.image', {
      url: '/image',
      views: {
        'tab-loc-image': {
          templateUrl: 'templates/detail/location-gallery.html',
          controller: 'LocationDetailCtrl'
        }
      }
    })
      .state('loc.detail.image-view', {
        url: '/image/v/:imageId',
        views: {
          'tab-loc-image': {
            templateUrl: 'templates/detail/location-gallery-view.html',
            controller: 'LocationDetailCtrl'
          }
        }
      })
    .state('loc.detail.map', {
      url: '/map',
      views: {
        'tab-loc-map': {
          templateUrl: 'templates/detail/location-map.html',
          controller: 'LocationDetailCtrl'
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/loc/all');

});
