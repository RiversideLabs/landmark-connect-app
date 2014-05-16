angular.module('landmarkConnect.controllers', [])


.controller('MainCtrl', function($scope, $localStorage, $location, $sce, LocationsService) {
  $scope.$storage = $localStorage.$default({
    sortLoc: "name",
    favorites: [],
    visited: []
  });

  console.log("mainload sort: " + $localStorage.sortLoc);

  $scope.isActive = function(route) {
    return route === $location.path();
  }

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  // --- Set / Unset / Check Visited & Favorites ---
  $scope.makeFavorite = function(loc) {
    $scope.$storage.favorites.push(loc.id);
  }
  $scope.unFavorite = function(loc) {
    var index = $scope.$storage.favorites.indexOf(loc.id);
    $scope.$storage.favorites.splice(index,1);
  }
  $scope.isFavorite = function(loc) {
    return $scope.$storage.favorites.indexOf(loc.id) >= 0;
  }

  $scope.makeVisited = function(loc) {
    $scope.$storage.visited.push(loc.id);
  }
  $scope.unVisit = function(loc) {
    var index = $scope.$storage.visited.indexOf(loc.id);
    $scope.$storage.visited.splice(index,1);
  }
  $scope.isVisited = function(loc) {
    return $scope.$storage.visited.indexOf(loc.id) >= 0;
  }
  // --- END Set / Unset / Check Visited & Favorites ---


  ionic.Platform.ready(function(){
    console.log("Cordova is ready");
    // Add device specific stuff here
  });
})

.controller('AboutCtrl', function ($scope) {
  $scope.navTitle = "About Landmark Connect";

  $scope.linkTo = function(link){
    console.log("Link to " + link);
    var ref = window.open(link, '_blank', 'location=yes');
  }
})

.controller('SettingsCtrl', function ($scope, $localStorage, $ionicNavBarDelegate, LocationsService) {
  $scope.navTitle = "Settings";
  $scope.$storage = $localStorage;

  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.locations = [];
  $scope.locations = LocationsService.all();

  $scope.favorites = $scope.$storage.favorites;
  $scope.visited = $scope.$storage.visited;

  console.log("favs: " + $scope.favorites);
  console.log("vis: " + $scope.visited);

  $scope.sortLocList = [
    { text: "Sort By Name", value: "name" },
    { text: "Sort By Distance", value: "distanceFromHere" }
  ];
})


.controller('LocationsCtrl', function($scope, $location, $ionicLoading, $ionicPopup, $timeout, $ionicScrollDelegate, cordovaGeolocationService, LocationsService, $localStorage, geomath) {
  $scope.$storage = $localStorage;
  $scope.locations = [];
  $scope.locations = LocationsService.all();
  $scope.locations.showDistance = false;

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
    $scope.search.name = '';
  };

  $scope.scrollTop = function() {
    $ionicScrollDelegate.$getByHandle('locations-list').scrollTo(0, 44, true);
  };
  $scope.showscrollbtn = false;
  $scope.checkScrollTop = function() {
    $timeout( function() {
      var scrollView = $ionicScrollDelegate.getScrollView();
      var scrollPos = $ionicScrollDelegate.getScrollPosition();
      var r = (scrollView.__clientHeight / 2);

      if(scrollPos.top > r) {
        $scope.showscrollbtn = true;
        console.log("show scroll to top btn");
      } else {
        $scope.showscrollbtn = false;
        console.log("don't show scroll to top btn");
      }
      $scope.$apply();
    });
  };


  var adjustScroll = function() {
    var scrollView = $ionicScrollDelegate.getScrollView();
    //console.log(scrollView.__contentHeight);
    //console.log(scrollView.__clientHeight);

    if(scrollView.__contentHeight < scrollView.__clientHeight) {
      $scope.search.showSearch=false;
    } else {
      $scope.search.showSearch=true;
      $ionicScrollDelegate.scrollTo(0, 44, false);
    }
  };

  $timeout( function() {
    console.log($scope.$storage.currentLocation);
    if ($scope.$storage.currentLocation) {
      $scope.locations.showDistance=true;
      $scope.locations = LocationsService.all();
      adjustScroll();
    } else {
      $ionicLoading.show({
        content: '<i class=\'ion-ios7-reloading\'></i><br/>Getting current location...',
        showBackdrop: false
      });

      cordovaGeolocationService.watchPosition(function(pos) {
        var coords = $scope.$storage.currentLocation = [
          pos.coords.latitude,
          pos.coords.longitude
        ];
        $scope.locations.showDistance=true;
        $scope.locations = LocationsService.all();
        $ionicLoading.hide();
        adjustScroll();
      }, function(error) {
        $ionicPopup.alert({
          title: 'Unable to get location: ' + error.message
        }).then(function(res) {
          $scope.locations.showDistance=false;
          $ionicLoading.hide();
          adjustScroll();
        });
      });
    }


    $timeout( function() {
      adjustScroll();
    }, 700);

  }, 500);


  $scope.distanceFromHere = function (_location, _startPoint) {
    var start = [33.9833,-117.3728];

    if ($scope.$storage.currentLocation) {
      start = {
        latitude: $scope.$storage.currentLocation[0],
        longitude: $scope.$storage.currentLocation[1]
      };
    }

    start = _startPoint || start;

    var end = {
      latitude: _location.location.lat,
      longitude: _location.location.lng
    };

    var num = geomath.calculateDistance(start, end);
    return num;
  }
})

.controller('LocationsMapCtrl', function($scope, $ionicLoading, $ionicPopup, LocationsService, $localStorage, cordovaGeolocationService) {
  $scope.$storage = $localStorage;
  $scope.locations = [];
  $scope.locations = LocationsService.all();

  $scope.navTitle = "Map of Locations";

  var pinImage = {
    url: 'assets/img/map-pin.png',
    size: new google.maps.Size(27, 80),
    scaledSize: new google.maps.Size(13.5, 40),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(0, 40)
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
    var infowindow =  new google.maps.InfoWindow({
        content: ""
    });
    for (var i = 0; i < locations.length; i++) {
      var location = locations[i];
      var latLng = new google.maps.LatLng(locations[i].location.lat, locations[i].location.lng);
      var contentString = '<div style="width:200px;"><h4>' + location.name + '</h4><p>' + location.location.formattedAddress + '</p><p><a href="/#/location/'+location.id+'/details/">View Details</a> | <a href="http://maps.apple.com/?q='+location.location.formattedAddress+'">Get Directions</a></p></div>';

      bounds.extend(latLng); // Create a new viewpoint bound

      // Add Marker
      var marker = new google.maps.Marker({
        position: latLng,
        map: $scope.map,
        title: location.name,
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

  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    var currentLocImage = {
      url: 'assets/img/map-bluedot.png',
      size: new google.maps.Size(44, 44),
      scaledSize: new google.maps.Size(22, 22),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(0, 22)
    };


    if ($scope.$storage.currentLocation) {
      console.log("already has it");
      currentPos = new google.maps.LatLng($scope.$storage.currentLocation[0], $scope.$storage.currentLocation[1]);
      $scope.map.setCenter(currentPos);
      $scope.bounds.extend(currentPos);
      var marker = new google.maps.Marker({
          position: currentPos,
          map: $scope.map,
          icon: currentLocImage
      });
      $scope.map.fitBounds($scope.bounds);
    } else {
      $ionicLoading.show({
        content: '<i class=\'ion-ios7-reloading\'></i><br/>Getting current location...',
        showBackdrop: false
      });

      cordovaGeolocationService.watchPosition(function(pos) {
        var coords = $scope.$storage.currentLocation = [
          pos.coords.latitude,
          pos.coords.longitude
        ];
        currentPos = new google.maps.LatLng($scope.$storage.currentLocation[0], $scope.$storage.currentLocation[1]);
        $scope.map.setCenter(currentPos);
        var marker = new google.maps.Marker({
            position: currentPos,
            map: $scope.map,
            icon: currentLocImage
        });
        $scope.map.setZoom(18);
        $ionicLoading.hide();
      }, function(error) {
        $ionicPopup.alert({
          title: 'Unable to get location: ' + error.message
        }).then(function(res) {
          $ionicLoading.hide();
          // reset the view to default
          initializeMapAll();
        });
      });
    }
  };


})


.controller('LocationDetailCtrl', function($scope, $stateParams, LocationsService, $ionicNavBarDelegate, AudioService, $ionicLoading, $ionicPopup, $localStorage, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
  $scope.location = LocationsService.getLocation($stateParams.locationId);
  $scope.navTitle = $scope.location.name;

  $scope.fade = true;
  $scope.$storage = $localStorage;

  //$ionicNavBarDelegate.showBackButton(show); // seems to produce a blank screen
  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.checkScroll = function() {
    $timeout( function() {
      var scrollView = $ionicScrollDelegate.getScrollView();
      var scrollPos = $ionicScrollDelegate.getScrollPosition();
      var r = (scrollView.__contentHeight - scrollView.__clientHeight - 10);

      if(scrollView.__contentHeight < scrollView.__clientHeight) {
        $scope.fade = false;
        console.log('Not enough content, no need for fade.');
      } else {
        if(scrollPos.top > r) {
          $scope.fade = false;
          console.log('Scrolled within 10 of bottom.');
        } else {
          $scope.fade = true;
          console.log('display the fade');
        }
      }
      $scope.$apply();
    });
  };

  // --- Set / Unset / Check Visited & Favorites ---
  $scope.makeFavorite = function(loc) {
    $scope.$storage.favorites.push(loc.id);
  }
  $scope.unFavorite = function(loc) {
    var index = $scope.$storage.favorites.indexOf(loc.id);
    $scope.$storage.favorites.splice(index,1);
  }
  $scope.isFavorite = function(loc) {
    return $scope.$storage.favorites.indexOf(loc.id) >= 0;
  }

  $scope.makeVisited = function(loc) {
    $scope.$storage.visited.push(loc.id);
  }
  $scope.unVisit = function(loc) {
    var index = $scope.$storage.visited.indexOf(loc.id);
    $scope.$storage.visited.splice(index,1);
  }
  $scope.isVisited = function(loc) {
    return $scope.$storage.visited.indexOf(loc.id) >= 0;
  }
  // --- END Set / Unset / Check Visited & Favorites ---


  // --- TOURS -----
  $scope.tour = LocationsService.getTour($stateParams.locationId, $stateParams.tourId);
  $scope.aPlayer = AudioService;
  // --- END TOURS -----

  // --- PHOTOS -----
  $scope.photo = LocationsService.getPhoto($stateParams.locationId, $stateParams.photoId);
  angular.forEach(location.photos, function(photo, index){
    $scope.photos.push(photo);
  });

  var delegate = $ionicScrollDelegate.$getByHandle('photo-gallery');

  if($stateParams.photoId) {
    $timeout( function() {
      $scope.$broadcast('slideBox.setSlide', $stateParams.photoId);
    }, 50);
  }

  $scope.dataSlide = {};
  $scope.dataSlide.currSlide = $ionicSlideBoxDelegate.currentIndex();

  $scope.slideChanged = function() {
    delegate.rememberScrollPosition('photo-gallery');
    $scope.dataSlide.currSlide = $ionicSlideBoxDelegate.currentIndex();

    $timeout( function() {
      $ionicScrollDelegate.resize();
    }, 50);
  };

  // --- END PHOTOS -----

  // ------- MAP -------
  var latLng = new google.maps.LatLng($scope.location.location.lat, $scope.location.location.lng);

  var currentLocImage = {
    url: 'assets/img/map-bluedot.png',
    // This marker is 27 pixels wide by 80 pixels tall.
    size: new google.maps.Size(44, 44),
    scaledSize: new google.maps.Size(22, 22),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(0, 22)
  };
  var pinImage = {
    url: 'assets/img/map-pin.png',
    // This marker is 27 pixels wide by 80 pixels tall.
    size: new google.maps.Size(27, 80),
    scaledSize: new google.maps.Size(13.5, 40),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(0, 40)
  };

  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
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

    var contentString = '<div style="width:200px;"><h4>' + $scope.location.name + '</h4><p>' + $scope.location.location.formattedAddress + '</p><p><a href="http://maps.apple.com/?q='+$scope.location.location.formattedAddress+'">Get Directions</a></div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var marker = new google.maps.Marker({
      position: latLng,
      map: $scope.map,
      title: $scope.location.name,
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
