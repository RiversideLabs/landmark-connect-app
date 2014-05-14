angular.module('landmarkConnect.controllers', [])


.controller('MainCtrl', function($scope, $localStorage, $location) {
  $scope.$storage = $localStorage.$default({
    currentLocation: [],
    sortLoc: "name",
    favorites: [],
    visited: []
  });

  console.log("mainload sort: " + $localStorage.sortLoc);

  $scope.isActive = function(route) {
    return route === $location.path();
  }

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

.controller('SettingsCtrl', function ($scope, $localStorage, $ionicNavBarDelegate) {
  $scope.navTitle = "Settings";
  $scope.$storage = $localStorage;

  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.sortLocList = [
    { text: "Sort By Name", value: "name" },
    { text: "Sort By Distance", value: "distanceFromHere" }
  ];
})


.controller('LocationsCtrl', function($scope, $location, $ionicLoading, $ionicPopup, $timeout, $ionicScrollDelegate, cordovaGeolocationService, LocationsService, $localStorage, geomath) {
  $scope.$storage = $localStorage;
  $scope.locations = {};
  $scope.locations = LocationsService.all();
  $scope.locations.showDistance = false;

  // Method called on infinite scroll
  // Receives a "done" callback to inform the infinite scroll that we are done
  $scope.loadMore = function() {
    $timeout(function() {
      // Placeholder for later
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }, 1000);
  };

  $scope.search = {};
  $scope.search.showSearch = false;

  $scope.clearSearch = function() {
    $scope.search.name = '';
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
          pos.coords.longitude,
          pos.coords.latitude
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



  $scope.distanceFromHere = function (_item, _startPoint) {
    var start = null;

    if ($scope.$storage.currentLocation) {
      start = {
        longitude: $scope.$storage.currentLocation[0],
        latitude: $scope.$storage.currentLocation[1]
      };
    }
    start = _startPoint || start;

    var end = {
      longitude: _item.location.lng,
      latitude: _item.location.lat
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
    // This marker is 27 pixels wide by 80 pixels tall.
    size: new google.maps.Size(27, 80),
    scaledSize: new google.maps.Size(13.5, 40),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
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
      // This marker is 27 pixels wide by 80 pixels tall.
      size: new google.maps.Size(44, 44),
      scaledSize: new google.maps.Size(22, 22),
      // The origin for this image is 0,0.
      origin: new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      anchor: new google.maps.Point(0, 22)
    };


    if ($scope.$storage.currentLocation) {
      console.log("already has it");
      currentPos = new google.maps.LatLng($scope.$storage.currentLocation[1], $scope.$storage.currentLocation[0]);
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
          pos.coords.longitude,
          pos.coords.latitude
        ];
        currentPos = new google.maps.LatLng($scope.$storage.currentLocation[1], $scope.$storage.currentLocation[0]);
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


.controller('LocationDetailCtrl', function($scope, $stateParams, LocationsService, AudioService, $ionicLoading, $ionicPopup, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
  $scope.location = LocationsService.getLocation($stateParams.locationId);
  $scope.navTitle = $scope.location.name;

  $scope.fade = true;
  $scope.checkScroll = function() {
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
  };


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
