angular.module('landmarkConnect', ['ionic', 'ngAnimate', 'ngStorage', 'cordovaGeolocationModule', 'landmarkConnect.controllers', 'landmarkConnect.directives', 'landmarkConnect.filters', 'landmarkConnect.services'])

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
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "app.html"
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html",
          controller: "LocationsCtrl"
        }
      }
    })

    .state('app.menu', {
      url: "/menu",
      views: {
        'menuContent' :{
          templateUrl: "templates/menu.html",
          controller: function($scope){
            $scope.aboutBroughtBy = "The City of Riverside's Historic Preservation, Neighborhoods and Urban Design Division, and Economic Development Department";
          }
        }
      }
    })

    .state('app.favorites', {
      url: "/favorites",
      views: {
        'menuContent' :{
          templateUrl: "templates/favorites.html",
          controller: "SettingsCtrl"
        }
      }
    })

    .state('app.visited', {
      url: "/visited",
      views: {
        'menuContent' :{
          templateUrl: "templates/visited.html",
          controller: "SettingsCtrl"
        }
      }
    })

    .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "templates/settings.html",
          controller: "SettingsCtrl"
        }
      }
    })

    // Each tab has its own nav history stack:

    .state('app.loc', {
      url: "/loc",
      abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'locations-wrap.html'
        }
      }
    })
    .state('app.loc.all', {
      url: '/all',
      views: {
        'locContent': {
          templateUrl: 'templates/locations-list.html',
          controller: 'LocationsCtrl'
        }
      }
    })

    .state('app.loc.map', {
      url: '/map',
      views: {
        'locContent': {
          templateUrl: 'templates/locations-map.html',
          controller: 'LocationsMapCtrl'
        }
      }
    })




    .state('app.loc.detail', {
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
    .state('app.loc.detail.detail', {
      url: '/detail',
      views: {
        'tab-loc-detail': {
          templateUrl: 'templates/detail/location-details.html',
          controller: 'LocationDetailCtrl'
        }
      }
    })
    .state('app.loc.detail.tour', {
      url: '/tour',
      views: {
        'tab-loc-tour': {
          templateUrl: 'templates/detail/location-tours.html',
          controller: 'LocationDetailCtrl'
        }
      }
    })
      .state('app.loc.detail.tour-video', {
        url: '/tour/v/:tourId',
        views: {
          'tab-loc-tour': {
            templateUrl: 'templates/detail/location-tours-videoplayer.html',
            controller: 'LocationDetailCtrl'
          }
        }
      })

      .state('app.loc.detail.tour-audio', {
        url: '/tour/a/:tourId',
        views: {
          'tab-loc-tour': {
            templateUrl: 'templates/detail/location-tours-audioplayer.html',
            controller: 'LocationDetailCtrl'
          }
        }
      })

    .state('app.loc.detail.photo', {
      url: '/photo',
      views: {
        'tab-loc-photo': {
          templateUrl: 'templates/detail/location-gallery.html',
          controller: 'LocationDetailCtrl'
        }
      }
    })
      .state('app.loc.detail.photo-view', {
        url: '/photo/v/:photoId',
        views: {
          'tab-loc-photo': {
            templateUrl: 'templates/detail/location-gallery-view.html',
            controller: 'LocationDetailCtrl'
          }
        }
      })
    .state('app.loc.detail.map', {
      url: '/map',
      views: {
        'tab-loc-map': {
          templateUrl: 'templates/detail/location-map.html',
          controller: 'LocationDetailCtrl'
        }
      }
    })





    // Location Detail Tabs OLD WAY

    // .state('location', {
    //   url: "/location/:locationId",
    //   abstract: true,
    //   templateUrl: "templates/detail/location-detail-wrap.html",
    //   controller: 'LocationDetailCtrl'
    // })
    //
    // .state('location.detail', {
    //   url: '/details',
    //   views: {
    //     'tab-location-detail-details': {
    //       templateUrl: 'templates/detail/location-details.html',
    //       controller: 'LocationDetailCtrl'
    //     }
    //   }
    // })
    //
    // .state('location.tours', {
    //   url: '/tours',
    //   views: {
    //     'tab-location-detail-tours': {
    //       templateUrl: 'templates/detail/location-tours.html',
    //       controller: 'LocationDetailCtrl'
    //     }
    //   }
    // })
    //
    // .state('location.tours-video-player', {
    //   url: '/tours/v/:tourId',
    //   views: {
    //     'tab-location-detail-tours': {
    //       templateUrl: 'templates/detail/location-tours-videoplayer.html',
    //       controller: 'LocationDetailCtrl'
    //     }
    //   }
    // })
    //
    // .state('location.tours-audio-player', {
    //   url: '/tours/a/:tourId',
    //   views: {
    //     'tab-location-detail-tours': {
    //       templateUrl: 'templates/detail/location-tours-audioplayer.html',
    //       controller: 'LocationDetailCtrl'
    //     }
    //   }
    // })
    //
    // .state('location.gallery', {
    //   url: '/gallery',
    //   views: {
    //     'tab-location-detail-gallery': {
    //       templateUrl: 'templates/detail/location-gallery.html',
    //       controller: 'LocationDetailCtrl'
    //     }
    //   }
    // })
    //
    // .state('location.gallery-view', {
    //   url: '/gallery/view/:photoId',
    //   views: {
    //     'tab-location-detail-gallery': {
    //       templateUrl: 'templates/detail/location-gallery-view.html',
    //       controller: 'LocationDetailCtrl'
    //     }
    //   }
    // })
    //
    // .state('location.map', {
    //   url: '/map',
    //   views: {
    //     'tab-location-detail-map': {
    //       templateUrl: 'templates/detail/location-map.html',
    //       controller: 'LocationDetailCtrl'
    //     }
    //   }
    // })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/loc/all');

});
