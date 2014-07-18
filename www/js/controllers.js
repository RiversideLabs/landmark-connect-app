angular.module('landmarkConnect.controllers', ['ngCordova'])


.controller('MainCtrl', function($scope, $localStorage, $location, $sce, LocationsService, $ionicPlatform, $ionicModal, cordovaGeolocationService) {

  // START SET APP DEFAULTS
  $scope.$storage = $localStorage.$default({
    favorites: [],
    visited: []
  });

  $ionicPlatform.ready(function() {
    console.log("ionic is ready");
    if (cordovaGeolocationService.checkGeolocationAvailability()) {
      $scope.$storage = $localStorage.$default({
        sortLoc: 'distance'
      });
    } else {
      $scope.$storage = $localStorage.$default({
        sortLoc: 'name'
      });
    }
  });
  // END SET APP DEFAULTS

  if (ionic.Platform.isAndroid){
    $scope.scroll = false;
  } else if (ionic.Platform.isIOS){
    $scope.scroll = true;
  };


  $scope.isActive = function(route) {
    return route === $location.path();
  }

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  // --- Set / Unset / Check Visited & Favorites ---
  $scope.makeFavorite = function(loc) {
    $scope.$storage.favorites.push(loc._id);
  }
  $scope.unFavorite = function(loc) {
    var index = $scope.$storage.favorites.indexOf(loc._id);
    $scope.$storage.favorites.splice(index,1);
  }
  $scope.isFavorite = function(loc) {
    return $scope.$storage.favorites.indexOf(loc._id) >= 0;
  }

  $scope.makeVisited = function(loc) {
    $scope.$storage.visited.push(loc._id);
  }
  $scope.unVisit = function(loc) {
    var index = $scope.$storage.visited.indexOf(loc._id);
    $scope.$storage.visited.splice(index,1);
  }
  $scope.isVisited = function(loc) {
    return $scope.$storage.visited.indexOf(loc._id) >= 0;
  }
  // --- END Set / Unset / Check Visited & Favorites ---


  $scope.getDirections = function(loc) {
    var locationString = loc.location.street1+'+'+loc.location.suburb+'+'+loc.location.state+'+'+loc.location.postcode;

    if (ionic.Platform.isAndroid()) {
      var url = 'geo:0,0?q=' + locationString;
      url = encodeURI(url);
      window.open(url,'_system','location=yes');
    } else if (ionic.Platform.isIOS()) {
      if ($scope.$storage.currentLocation != null) {
        var url = 'http://maps.apple.com/?daddr=' + locationString + '&saddr=' + $scope.$storage.currentLocation[0] + ',' + $scope.$storage.currentLocation[1];
      } else {
        var url = 'http://maps.apple.com/?q=' + locationString;
      }
      url = encodeURI(url);
      window.open(url,'_system','location=yes');
    } else {
      var url = 'http://maps.google.com/?q=' + locationString;
      window.open(url,'_system','location=yes');
    }
  }

  $ionicModal.fromTemplateUrl('search-modal.html', function(modal) {
    $scope.modalSearch = modal;
  }, {
    // Use our scope for the scope of the modal to keep it simple
    scope: $scope,
    animation: 'slide-in-up'
  });

  $ionicPlatform.ready(function() {
    console.log("Cordova is ready");
    // Add device specific stuff here
  });
})

.controller('AboutCtrl', function ($scope) {
  $scope.navTitle = "About Landmark Connect";

  if (ionic.Platform.isAndroid){
    $scope.scroll = false;
  } else if (ionic.Platform.isIOS){
    $scope.scroll = true;
  };

  $scope.linkTo = function(link){
    var ref = window.open(link, '_blank', 'location=yes');
  }
})

.controller('SettingsCtrl', function ($scope, $localStorage, $ionicNavBarDelegate, LocationsService) {
  $scope.navTitle = "Settings";
  $scope.$storage = $localStorage;

  if (ionic.Platform.isAndroid){
    $scope.scroll = false;
  } else if (ionic.Platform.isIOS){
    $scope.scroll = true;
  };

  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.locations = [];
  $scope.locations = LocationsService.all();

  $scope.favorites = $scope.$storage.favorites;
  $scope.visited = $scope.$storage.visited;

  // console.log("favs: " + $scope.favorites);
  // console.log("vis: " + $scope.visited);

  $scope.sortLocList = [
    { text: 'Sort By Name', value: 'name' },
    { text: 'Sort By Distance', value: 'distance' }
  ];
})

.controller('SearchCtrl', function ($scope, $localStorage, LocationsService) {
  $scope.$storage = $localStorage;
  $scope.locations = [];
  $scope.locations = LocationsService.all();

  $scope.closeSearch = function() {
    //var iF = document.getElementById("searchBox");
    //iF.blur();
    cordova.plugins.Keyboard.close();
    $scope.modalSearch.hide();
  };
  $scope.clearSearch = function() {
    $scope.search = '';
  };
})


.controller('LocationsCtrl', function($rootScope, $scope, $location, $ionicPlatform, $ionicLoading, $ionicPopup, $timeout, $ionicScrollDelegate, cordovaGeolocationService, LocationsService, $localStorage, geomath) {
  $scope.$storage = $localStorage;
  $scope.locations = [];
  $scope.locations = LocationsService.all();
  if ($scope.$storage.currentLocation != null) {
    $scope.$storage.showDistance = true;
  } else {
    $scope.$storage.showDistance = false;
  }

  if (ionic.Platform.isAndroid){
    $scope.scroll = false;
  } else if (ionic.Platform.isIOS){
    $scope.scroll = true;
  };

  // Method called on infinite scroll
  // Saving this for later
  // Receives a "done" callback to inform the infinite scroll that we are done
  $scope.loadMore = function() {
    $timeout(function() {
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, 1000);
  };

  $scope.search = {};
  $scope.search.showSearch = false;

  $scope.clearSearch = function() {
    $scope.search.commonName = '';
  };



  $scope.scrollTop = function() {
    $ionicScrollDelegate.$getByHandle('locations-list').scrollTo(0, 44, true);
  };
  $scope.showscrollbtn = false;
  $scope.checkScrollTop = function() {
    $timeout( function() {
      //var scrollView = $ionicScrollDelegate.$getByHandle('locations-list');
      var scrollView = $ionicScrollDelegate.$getByHandle('locations-list').getScrollView();
      var scrollPos = $ionicScrollDelegate.$getByHandle('locations-list').getScrollPosition();
      var r = (scrollView.__clientHeight / 2);

      if(scrollPos.top > r) {
        $scope.showscrollbtn = true;
        // console.log("show scroll to top btn");
      } else {
        $scope.showscrollbtn = false;
        // console.log("don't show scroll to top btn");
      }
      $scope.$apply();
    });
  };



  var adjustScroll = function() {
    var scrollView = $ionicScrollDelegate.getScrollView();

    if(scrollView.__contentHeight < scrollView.__clientHeight) {
      $scope.search.showSearch=false;
    } else {
      $scope.search.showSearch=true;
      $ionicScrollDelegate.scrollTo(0, 44, false);
    }
  };

  // --- START Get Current Location ---
  $scope.getCurrentPosition = function() {
    cordovaGeolocationService.getCurrentPosition(function(position) {
      successHandler(position)
    }, function(err) {
      errorHandler(err)
    });
  };

  // var watch = cordovaGeolocationService.watchPosition({
  //   maximumAge: 3000,
  //   timeout: 10000,
  //   enableHighAccuracy: true
  // });
  var successHandler = function(position) {
    if ($scope.$storage.currentLocation != null) {
      console.log("not null");
    } else {
      console.log("is null");
    };
    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });
    $scope.$storage.currentLocation = [
      position.coords.latitude,
      position.coords.longitude
    ];
    $scope.$storage.showDistance=true;
    $ionicLoading.hide();
    $scope.locations = LocationsService.all();
    adjustScroll();
  };
  var errorHandler = function(err) {
    $scope.showAlert();
    $scope.$storage.sortLoc='name';
    $scope.$storage.showDistance=false;
    $ionicLoading.hide();
    $scope.locations = LocationsService.all();
    adjustScroll();
  };

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Error Getting Location',
      template: 'We are having trouble getting your location. Please try later. Please check that the app has permission in your settings.'
    });
    alertPopup.then(function(res) {
      console.log('ok');
    });
  };

  $ionicPlatform.ready(function() {
    console.log("ready");
    if (cordovaGeolocationService.checkGeolocationAvailability()) {
      console.log("supports cordovaGeolocationService");
      $scope.getCurrentPosition();
    } else {
      console.log("no geo support");
      $scope.showAlert();
    }

    // watch.promise.then(function() {
    //     $scope.getCurrentPosition();
    //   }, function(err) {
    //     // An error occured. Show a message to the user
    //     //errorHandler(err);
    //     console.log(err)
    //   }, function(position) {
    //     successHandler(position);
    // });
  });
  // --- END Get Current Location ---



  $scope.distanceFromHere = function (_location, _startPoint) {
    var start = [33.9833,-117.3728];

    if ($scope.$storage.currentLocation != null) {
      start = {
        latitude: $scope.$storage.currentLocation[0],
        longitude: $scope.$storage.currentLocation[1]
      };
    }

    start = _startPoint || start;

    var end = {
      latitude: _location.location.geo[1],
      longitude: _location.location.geo[0]
    };

    var num = geomath.calculateDistance(start, end);
    return num;
  }

  $scope.sortOpt = function(loc) {
    if ($localStorage.sortLoc === 'distance') {
      return $scope.distanceFromHere(loc);
    } else if ($localStorage.sortLoc === 'name') {
      return loc.commonName;
    }
  };

})

.controller('LocationsMapCtrl', function($scope, $ionicLoading, $ionicPopup, LocationsService, $localStorage, $compile, cordovaGeolocationService) {
  $scope.$storage = $localStorage;
  $scope.locations = [];
  $scope.locations = LocationsService.all();

  $scope.navTitle = "Map of Locations";

  var pinImage = {
    url: 'assets/img/pin.png',
    size: new google.maps.Size(27, 30),
    scaledSize: new google.maps.Size(27, 30),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(7, 30)
  };

  // Google Maps
  function initializeMapAll() {

    var mapOptions = {
      center: new google.maps.LatLng(33.953349,-117.396156),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_all"), mapOptions);

    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(document.getElementById('map_all'), 'mousedown', function(e) {
      e.preventDefault();
      return false;
    });

    $scope.map = map;

    var locations = $scope.locations;
    var bounds = new google.maps.LatLngBounds();
    $scope.bounds = bounds;
    var infowindow = new google.maps.InfoWindow({
      content: compiled
    });

    for (var i = 0; i < locations.length; i++) {
      var location = locations[i];
      var latLng = new google.maps.LatLng(locations[i].location.geo[1], locations[i].location.geo[0]);
      var locationString = location.location.street1+'+'+location.location.suburb+'+'+location.location.state+'+'+location.location.postcode;

      if (ionic.Platform.isAndroid()) {
        var url = 'geo:0,0?q=' + locationString;
        url = encodeURI(url);
        var contentString = '<div style="width:200px;"><h4>' + location.commonName + '</h4><p>' + location.location.street1 + '<br>'+location.location.suburb+', '+location.location.state+' '+location.location.postcode+'</p><p><a href="/#/loc/'+location._id+'/detail" class="button button-small button-positive">View Details</a> <a onClick="window.open(\''+url+'\',\'_system\',\'location=yes\');return false;" class="button button-small button-positive" target="_system">Get Directions</a></p></div>';
      } else if (ionic.Platform.isIOS()) {
        if ($scope.$storage.currentLocation != null) {
          var url = 'http://maps.apple.com/?daddr=' + locationString + '&saddr=' + $scope.$storage.currentLocation[0] + ',' + $scope.$storage.currentLocation[1];
        } else {
          var url = 'http://maps.apple.com/?q=' + locationString;
        }
        url = encodeURI(url);
        var contentString = '<div style="width:200px;"><h4>' + location.commonName + '</h4><p>' + location.location.street1 + '<br>'+location.location.suburb+', '+location.location.state+' '+location.location.postcode+'</p><p><a href="/#/loc/'+location._id+'/detail" class="button button-small button-positive">View Details</a> <a onClick="window.open(\''+url+'\',\'_system\',\'location=yes\');return false;" class="button button-small button-positive" target="_system">Get Directions</a></p></div>';
      } else {
        var contentString = '<div style="width:200px;"><h4>' + location.commonName + '</h4><p>' + location.location.street1 + '<br>'+location.location.suburb+', '+location.location.state+' '+location.location.postcode+'</p><p><a href="/#/loc/'+location._id+'/detail" class="button button-small button-positive">View Details</a> <a onClick="window.open(\'http://maps.google.com/?q='+locationString+'\',\'_system\',\'location=yes\');return false;" class="button button-small button-positive" target="_system">Get Directions</a></p></div>';
      }

      var compiled = $compile(contentString)($scope);
      bounds.extend(latLng); // Create a new viewpoint bound

      // Add Marker
      var marker = new google.maps.Marker({
        position: latLng,
        map: $scope.map,
        title: location.commonName,
        icon: pinImage
      });

      bindInfoWindow(marker, map, infowindow, contentString); // Add Marker to viewpoint bound
    }

    $scope.map.fitBounds(bounds);
    //$scope.centerOnMe();
  }
  function bindInfoWindow(marker, map, infowindow, contentString) {
    google.maps.event.addListener(marker, 'click', function(event) {
      infowindow.setContent(contentString);
      infowindow.open($scope.map, marker);
    });
  }


  //google.maps.event.addDomListener(window, 'load', initialize);
  if (document.getElementById('map_all')) {
    initializeMapAll();
  }

  // $scope.centerOnMe = function() {
  //   if(!$scope.map) {
  //     return;
  //   }
  //
  //   var currentLocImage = {
  //     url: 'assets/img/map-bluedot.png',
  //     size: new google.maps.Size(44, 44),
  //     scaledSize: new google.maps.Size(22, 22),
  //     origin: new google.maps.Point(0,0),
  //     anchor: new google.maps.Point(0, 22)
  //   };
  //
  //
  //   if ($scope.$storage.currentLocation != null) {
  //     console.log("already has location");
  //     currentPos = new google.maps.LatLng($scope.$storage.currentLocation[0], $scope.$storage.currentLocation[1]);
  //     $scope.map.setCenter(currentPos);
  //     $scope.bounds.extend(currentPos);
  //     var marker = new google.maps.Marker({
  //         position: currentPos,
  //         map: $scope.map,
  //         icon: currentLocImage
  //     });
  //     $scope.map.fitBounds($scope.bounds);
  //   } else {
  //     $ionicLoading.show({
  //       content: '<i class=\'ion-ios7-reloading\'></i><br/>Getting current location...',
  //       showBackdrop: false
  //     });
  //
  //     var watch = cordovaGeolocationService.watchPosition({
  //       frequency: 3000,
  //       maximumAge: 3000,
  //       timeout: 5000,
  //       enableHighAccuracy: true
  //     });
  //
  //     watch.promise.then(function() {
  //         // Not currently used
  //       }, function(err) {
  //         // An error occured. Show a message to the user
  //         $ionicPopup.alert({
  //           title: 'Unable to get location: ' + err.message
  //         }).then(function(res) {
  //           $ionicLoading.hide();
  //           // reset the view to default
  //           initializeMapAll();
  //         });
  //       }, function(pos) {
  //         var coords = $scope.$storage.currentLocation = [
  //           position.coords.latitude,
  //           position.coords.longitude
  //         ];
  //         currentPos = new google.maps.LatLng($scope.$storage.currentLocation[0], $scope.$storage.currentLocation[1]);
  //         $scope.map.setCenter(currentPos);
  //         var marker = new google.maps.Marker({
  //             position: currentPos,
  //             map: $scope.map,
  //             icon: currentLocImage
  //         });
  //         $scope.map.setZoom(18);
  //         $ionicLoading.hide();
  //     });
  //   }
  // };


})


.controller('LocationDetailCtrl', function($scope, $stateParams, LocationsService, TourService, $ionicNavBarDelegate, $ionicTabsDelegate, AudioService, $ionicLoading, $ionicPopup, $localStorage, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
  $scope.location = LocationsService.getLocation($stateParams.locationId);
  $scope.navTitle = $scope.location.commonName;

  $scope.$storage = $localStorage;

  if (ionic.Platform.isAndroid){
    $scope.scroll = false;
  } else if (ionic.Platform.isIOS){
    $scope.scroll = true;
  };

  //$ionicNavBarDelegate.showBackButton(show); // seems to produce a blank screen
  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.selectTabWithIndex = function(index) {
    $ionicTabsDelegate.select(index);
  };

  // --- Set / Unset / Check Visited & Favorites ---
  $scope.makeFavorite = function(loc) {
    $scope.$storage.favorites.push(loc._id);
  }
  $scope.unFavorite = function(loc) {
    var index = $scope.$storage.favorites.indexOf(loc._id);
    $scope.$storage.favorites.splice(index,1);
  }
  $scope.isFavorite = function(loc) {
    return $scope.$storage.favorites.indexOf(loc._id) >= 0;
  }

  $scope.makeVisited = function(loc) {
    $scope.$storage.visited.push(loc._id);
  }
  $scope.unVisit = function(loc) {
    var index = $scope.$storage.visited.indexOf(loc._id);
    $scope.$storage.visited.splice(index,1);
  }
  $scope.isVisited = function(loc) {
    return $scope.$storage.visited.indexOf(loc._id) >= 0;
  }
  // --- END Set / Unset / Check Visited & Favorites ---


  // --- TOURS -----
  //$scope.tour = TourService.getTour($stateParams.tourId);
  $scope.tour = LocationsService.getTour($stateParams.locationId, $stateParams.tourId);
  $scope.sortTours = 'sortOrder';
  //$scope.aPlayer = AudioService;
  // --- END TOURS -----

  // --- IMAGES -----
  $scope.image = LocationsService.getImage($stateParams.locationId, $stateParams.imageId);
  angular.forEach(location.images, function(image, index){
    $scope.images.push(image);
  });

  $scope.containerStyle = {
    width: '',
    height: ''
  };

  var delegate = $ionicScrollDelegate.$getByHandle('image-gallery');

  if($stateParams.imageId) {
    $timeout( function() {
      $scope.$broadcast('slideBox.setSlide', $stateParams.imageId);
    }, 50);
  }

  $scope.dataSlide = {};
  $scope.dataSlide.currSlide = $ionicSlideBoxDelegate.currentIndex();

  $scope.slideChanged = function() {
    delegate.rememberScrollPosition('image-gallery');
    $scope.dataSlide.currSlide = $ionicSlideBoxDelegate.currentIndex();

    $timeout( function() {
      $ionicScrollDelegate.resize();
    }, 50);
  };

  // --- END IMAGES -----

  // ------- MAP -------

  $scope.getDirections = function(loc) {
    var locationString = loc.location.street1+'+'+loc.location.suburb+'+'+loc.location.state+'+'+loc.location.postcode;

    if (ionic.Platform.isAndroid()) {
      var url = 'geo:0,0?q=' + locationString;
      url = encodeURI(url);
      window.open(url,'_system','location=yes');
    } else if (ionic.Platform.isIOS()) {
      if ($scope.$storage.currentLocation != null) {
        var url = 'http://maps.apple.com/?daddr=' + locationString + '&saddr=' + $scope.$storage.currentLocation[0] + ',' + $scope.$storage.currentLocation[1];
      } else {
        var url = 'http://maps.apple.com/?q=' + locationString;
      }
      url = encodeURI(url);
      window.open(url,'_system','location=yes');
    } else {
      var url = 'http://maps.google.com/?q=' + locationString;
      window.open(url,'_system','location=yes');
    }
  }


  var latLng = new google.maps.LatLng($scope.location.location.geo[1], $scope.location.location.geo[0]);

  var currentLocImage = {
    url: 'assets/img/map-bluedot.png',
    size: new google.maps.Size(44, 44),
    scaledSize: new google.maps.Size(22, 22),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(0, 22)
  };
  var pinImage = {
    url: 'assets/img/pin.png',
    size: new google.maps.Size(27, 30),
    scaledSize: new google.maps.Size(27, 30),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(7, 30)
  };

  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    cordovaGeolocationService.getCurrentPosition(function(pos) {
      var bounds = new google.maps.LatLngBounds();
      currentPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      var marker = new google.maps.Marker({
          position: currentPos,
          map: $scope.map,
          icon: currentLocImage
      });
      // add both the pin location and current location to boundries
      bounds.extend(currentPos);
      bounds.extend(latLng);
      $scope.map.fitBounds(bounds);
      //$scope.loading.hide(); // says it's been depreciated
      $ionicLoading.hide();
    }, function(error) {
      $ionicPopup.alert({
        title: 'Unable to get location: ' + error.message
      }).then(function(res) {
        $ionicLoading.hide();
        // reset the view to default
        initializeDetailMap();
      });
    });
  };

  function initializeDetailMap() {
    var mapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_detail"), mapOptions);

    // Stop the side bar from dragging when mousedown/tapdown on the map
    google.maps.event.addDomListener(document.getElementById('map_detail'), 'mousedown', function(e) {
      e.preventDefault();
      return false;
    });

    $scope.map = map;


    var locationString = $scope.location.location.street1+'+'+$scope.location.location.suburb+'+'+$scope.location.location.state+'+'+$scope.location.location.postcode;

    if (ionic.Platform.isAndroid()) {
      var url = 'geo:0,0?q=' + locationString;
      url = encodeURI(url);
      var contentString = '<div style="width:200px;"><h4>' + $scope.location.commonName + '</h4><p>' + $scope.location.location.street1+'<br>'+$scope.location.location.suburb+', '+$scope.location.location.state+' '+$scope.location.location.postcode+'</p><p><a onClick="window.open(\''+url+'\',\'_system\',\'location=yes\');return false;" class="button button-small button-positive" target="_system">Get Directions</a></p></div>';
    } else if (ionic.Platform.isIOS()) {
      if ($scope.$storage.currentLocation != null) {
        var url = 'http://maps.apple.com/?daddr=' + locationString + '&saddr=' + $scope.$storage.currentLocation[0] + ',' + $scope.$storage.currentLocation[1];
      } else {
        var url = 'http://maps.apple.com/?q=' + locationString;
      }
      url = encodeURI(url);
      var contentString = '<div style="width:200px;"><h4>' + $scope.location.commonName + '</h4><p>' + $scope.location.location.street1+'<br>'+$scope.location.location.suburb+', '+$scope.location.location.state+' '+$scope.location.location.postcode+'</p><p><a onClick="window.open(\''+url+'\',\'_system\',\'location=yes\');return false;" class="button button-small button-positive" target="_system">Get Directions</a></p></div>';
    } else {
      var contentString = '<div style="width:200px;"><h4>' + $scope.location.commonName + '</h4><p>' + $scope.location.location.street1+'<br>'+$scope.location.location.suburb+', '+$scope.location.location.state+' '+$scope.location.location.postcode+'</p><p><a onClick="window.open(\'http://maps.google.com/?q='+locationString+'\',\'_system\',\'location=yes\');return false;" class="button button-small button-positive" target="_system">Get Directions</a></p></div>';
    }

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var marker = new google.maps.Marker({
      position: latLng,
      map: $scope.map,
      title: $scope.location.commonName,
      icon: pinImage
    });
    infowindow.open($scope.map, marker);

    google.maps.event.addListener(marker, 'click', function(event) {
        infowindow.open($scope.map, marker);
    });

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      google.maps.event.trigger(marker,'click');
    });
  }

  if (document.getElementById('map_detail')) {
    //google.maps.event.addDomListener(window, 'load', initializeDetailMap);
    initializeDetailMap();
  }
  // ----- END MAP -----
});
